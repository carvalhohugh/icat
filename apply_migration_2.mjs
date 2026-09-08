import fs from 'fs';
import path from 'path';
import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgresql://postgres:101010Icat2026@db.phkhlhuwdqdjsdgxmqod.supabase.co:5432/postgres';

async function runMigration() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const schemaSql = fs.readFileSync(path.join(process.cwd(), 'migration_2.sql'), 'utf8');
    await client.query(schemaSql);
    console.log('Migração 2 aplicada com sucesso!');
  } catch (error) {
    console.error('Erro na migração:', error);
  } finally {
    await client.end();
  }
}

runMigration();
