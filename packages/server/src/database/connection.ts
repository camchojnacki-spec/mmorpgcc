/**
 * PostgreSQL connection pool.
 * Uses pg (node-postgres) for lightweight, non-ORM database access.
 */

import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'threshold',
  user: process.env.DB_USER || 'threshold',
  password: process.env.DB_PASSWORD || 'threshold_dev',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
});

export { pool };

/**
 * Run the schema.sql file to initialize/migrate the database.
 * Idempotent — uses IF NOT EXISTS throughout.
 */
export async function initializeDatabase(): Promise<void> {
  const fs = await import('fs');
  const path = await import('path');
  const { fileURLToPath } = await import('url');

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const schemaPath = path.join(__dirname, 'schema.sql');

  try {
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    await pool.query(schema);
    console.log('Database schema initialized');
  } catch (err) {
    console.warn('Database initialization skipped (DB may not be running):', (err as Error).message);
  }
}
