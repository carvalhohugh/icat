import fs from 'fs';
import path from 'path';
import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgresql://postgres:101010Icat2026@db.phkhlhuwdqdjsdgxmqod.supabase.co:5432/postgres';

async function runSchema() {
  console.log('Conectando ao Supabase via PostgreSQL...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Conectado com sucesso!');
    
    const schemaPath = path.join(process.cwd(), 'supabase_schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Executando schema SQL...');
    await client.query(schemaSql);
    
    console.log('Schema aplicado com sucesso no Supabase!');
  } catch (error) {
    console.error('Erro ao aplicar o schema:', error);
  } finally {
    await client.end();
  }
}

runSchema();
