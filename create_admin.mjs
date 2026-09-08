import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgresql://postgres:101010Icat2026@db.phkhlhuwdqdjsdgxmqod.supabase.co:5432/postgres';

async function createAdmin() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Conectado ao DB. Verificando usuário admin@admin...');

    await client.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

    // Check if user exists
    let res = await client.query(`SELECT id FROM auth.users WHERE email = 'admin@admin'`);
    let userId;

    if (res.rows.length > 0) {
      userId = res.rows[0].id;
      console.log('Usuário já existe, atualizando senha...');
      await client.query(`UPDATE auth.users SET encrypted_password = crypt('super123', gen_salt('bf')) WHERE id = $1`, [userId]);
    } else {
      console.log('Usuário não existe, criando...');
      res = await client.query(`
        INSERT INTO auth.users (
          instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
          raw_app_meta_data, raw_user_meta_data, created_at, updated_at
        ) VALUES (
          '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'admin@admin', 
          crypt('super123', gen_salt('bf')), now(), 
          '{"provider":"email","providers":["email"]}', '{"full_name":"Super Admin"}', now(), now()
        ) RETURNING id;
      `);
      userId = res.rows[0].id;
    }

    console.log('Usuário garantido em auth.users com ID:', userId);

    // Inserir ou atualizar public.profiles
    await client.query(`
      INSERT INTO public.profiles (id, full_name, email, role)
      VALUES ($1, 'Administrador do Sistema', 'admin@admin', 'admin')
      ON CONFLICT (id) DO UPDATE SET role = 'admin', full_name = 'Administrador do Sistema';
    `, [userId]);

    console.log('Perfil de administrador criado/atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao criar admin:', error);
  } finally {
    await client.end();
  }
}

createAdmin();
