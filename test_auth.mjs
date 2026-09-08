import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://phkhlhuwdqdjsdgxmqod.supabase.co';
const supabaseAnonKey = 'sb_publishable_ZkMu9FxcYxhKmMf60dyEUA_lVQc8eec';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuth() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@admin.com',
    password: 'super123',
  });
  console.log('SignIn Result:', error ? error.message : 'Success! User ID: ' + data.user.id);
}
testAuth();
