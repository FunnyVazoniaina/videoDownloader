import pool from '../utils/db';
import downloadQueue from '../jobs/downloadJob';

interface Download {
  id: number;
  url: string;
  title: string | null;
  status: string;
  file_path: string | null;
  created_at: Date;
  updated_at: Date;
}

export const createDownload = async (url: string): Promise<Download> => {
  const result = await pool.query(
    'INSERT INTO downloads (url, status) VALUES ($1, $2) RETURNING *',
    [url, 'pending']
  );
  const download = result.rows[0];

  // Ajouter à la file d'attente
  await downloadQueue.add({ downloadId: download.id, url });

  return download;
};

export const getDownload = async (id: number): Promise<Download | null> => {
  const result = await pool.query('SELECT * FROM downloads WHERE id = $1', [id]);
  return result.rows[0] || null;
};