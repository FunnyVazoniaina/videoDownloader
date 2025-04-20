import pool from '../utils/db';
import downloadQueue from '../jobs/downloadJob';

export const createDownload = async (url: string) => {
  console.log('createDownload called with url:', url); // Add this log
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('Inserting into downloads table'); // Add this log
    const insertResult = await client.query(
      'INSERT INTO downloads (url, status) VALUES ($1, $2) RETURNING *',
      [url, 'pending']
    );
    const download = insertResult.rows[0];
    console.log('Download record created:', download); // Add this log
    console.log('Adding job to queue:', { downloadId: download.id, url }); // Add this log
    await downloadQueue.add({ downloadId: download.id, url });
    await client.query('COMMIT');
    console.log('Transaction committed'); // Add this log
    return download;
  } catch (error) {
    console.error('Error in createDownload:', error); // Add this log
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getDownload = async (id: number) => {
  const result = await pool.query('SELECT * FROM downloads WHERE id = $1', [id]);
  return result.rows[0] || null;
};