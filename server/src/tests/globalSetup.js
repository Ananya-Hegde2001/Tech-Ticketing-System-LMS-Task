import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { pool } from '../db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function globalSetup() {
  const schemaPath = path.resolve(__dirname, '../../db/schema.sql');
  const seedPath = path.resolve(__dirname, '../../db/seed.sql');
  const schemaSql = await readFile(schemaPath, 'utf8');
  const seedSql = await readFile(seedPath, 'utf8');
  await pool.query(schemaSql);
  await pool.query(seedSql);
}
