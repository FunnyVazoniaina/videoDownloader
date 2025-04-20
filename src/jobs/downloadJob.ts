import Queue from 'bull';
import ytdl from 'ytdl-core';
import fs from 'fs';
import path from 'path';
import pool from '../utils/db';

const downloadQueue = new Queue('video-download', process.env.REDIS_URL || 'redis://localhost:6379');

downloadQueue.process(async (job) => {
  const { downloadId, url } = job.data;

  try {
    // Mettre à jour le statut à "processing"
    await pool.query('UPDATE downloads SET status = $1 WHERE id = $2', ['processing', downloadId]);

    // Obtenir les infos de la vidéo
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, '_');
    const filePath = path.join(__dirname, '../../downloads', `${title}.mp4`);

    // Télécharger la vidéo
    const stream = ytdl(url, { filter: 'audioandvideo', quality: 'highest' });
    const writeStream = fs.createWriteStream(filePath);

    stream.pipe(writeStream);

    await new Promise<void>((resolve: () => void, reject: (error?: Error) => void) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });
    // Mettre à jour le statut et le chemin du fichier
    await pool.query('UPDATE downloads SET status = $1, file_path = $2, title = $3 WHERE id = $4', [
      'completed',
      filePath,
      info.videoDetails.title,
      downloadId,
    ]);
  } catch (error) {
    // Mettre à jour le statut à "failed"
    await pool.query('UPDATE downloads SET status = $1 WHERE id = $2', ['failed', downloadId]);
    throw error;
  }
});

export default downloadQueue;