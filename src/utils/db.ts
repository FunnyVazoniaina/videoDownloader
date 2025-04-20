import { Pool } from 'pg';

console.log('DATABASE_URL:', process.env.DATABASE_URL); // Log the DATABASE_URL

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('PostgreSQL pool error:', err);
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Failed to connect to PostgreSQL:', err);
  } else {
    console.log('Successfully connected to PostgreSQL');
    release();
  }
});

export default pool;