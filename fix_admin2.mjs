import pkg from 'pg';
import { createClient } from '@supabase/supabase-js';

const { Client } = pkg;
const connectionString = 'postgresql://postgres:101010Icat2026@db.phkhlhuwdqdjsdgxmqod.supabase.co:5432/postgres';
const supabaseUrl = 'https://phkhlhuwdqdjsdgxmqod.supabase.co';
const supabaseAnonKey = 'sb_publishable_ZkMu9FxcYxhKmMf60dyEUA_lVQc8eec';

async function fixAdmin() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@admin.com',
      password: 'super123',
    });
    
    if (error) {
      console.error('Erro no signup:', error.message);
      return;
    }
    
    const userId = data.user.id;
    console.log('Usuário admin@admin.com criado com sucesso via API! ID:', userId);

    await client.query(`UPDATE auth.users SET email_confirmed_at = now() WHERE id = $1`, [userId]);
    
    await client.query(`
      INSERT INTO public.profiles (id, full_name, email, role)
      VALUES ($1, 'Administrador do Sistema', 'admin@admin.com', 'admin')
      ON CONFLICT (id) DO UPDATE SET role = 'admin', full_name = 'Administrador do Sistema';
    `, [userId]);
    
    console.log('Tudo pronto!');
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await client.end();
  }
}

fixAdmin();
