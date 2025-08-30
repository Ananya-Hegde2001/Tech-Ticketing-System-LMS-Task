import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { query } from '../../src/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const schemaPath = path.resolve(__dirname, '../../db/schema.sql');
  const seedPath = path.resolve(__dirname, '../../db/seed.sql');
  const schemaSql = await readFile(schemaPath, 'utf8');
  const seedSql = await readFile(seedPath, 'utf8');

  await query(schemaSql);
  await query(seedSql);
  console.log('Database reset complete');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
