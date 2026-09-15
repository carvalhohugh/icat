const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const connectionString = 'postgresql://postgres:101010Icat2026@db.phkhlhuwdqdjsdgxmqod.supabase.co:5432/postgres';
  
  console.log('Conectando ao banco de dados...');
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('Conectado com sucesso!');
    
    const sql = fs.readFileSync(path.join(__dirname, 'supabase.sql'), 'utf8');
    console.log('Executando migração...');
    
    await client.query(sql);
    console.log('MIGRAÇÃO EXECUTADA COM SUCESSO! 🚀');
    
  } catch (err) {
    console.error('Erro na migração:', err);
  } finally {
    await client.end();
  }
}

runMigration();
