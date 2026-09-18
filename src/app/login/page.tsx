'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowRight, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Fallback manual para o administrador testar (já que o Supabase exige formato de e-mail válido com .com/.br)
    if (cleanEmail === 'admin@admin' && cleanPassword === 'super123') {
      document.cookie = 'icat-session=admin; path=/; max-age=86400';
      localStorage.setItem('icat_currentRole', 'admin');
      window.location.href = '/admin';
      return;
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_URL === 'Sua URL do Supabase Aqui') {
      setError('Sistema não conectado ao Banco de Dados. Configure o arquivo .env.local com as chaves do Supabase, ou use o login de teste (admin@admin / super123).');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          setError('E-mail não confirmado. Libere o acesso no painel do Supabase.');
        } else {
          setError('E-mail ou senha incorretos.');
        }
        setLoading(false);
        return;
      }

      if (data.user) {
        // Fallback for middleware to allow access (since standard supabase-js doesn't set cookies by default)
        document.cookie = 'icat-session=authenticated; path=/; max-age=86400';
        
        // Buscar o perfil do usuário para saber a role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        const role = profile?.role || 'admin'; // Fallback
        localStorage.setItem('icat_currentRole', role);

        if (role === 'student' || role === 'beneficiario') {
          window.location.href = '/beneficiario';
        } else if (role === 'entrevistador') {
          window.location.href = '/entrevistador';
        } else {
          window.location.href = '/admin';
        }
      }
    } catch (err: unknown) {
      setError('Erro de conexão com o servidor.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img src="/logo.png" alt="ICAT" className="h-16 w-auto" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Acesso Restrito</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Portal do Administrador, Professor e Colaboradores
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Endereço de E-mail</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-icat-green focus:border-icat-green sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Senha</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-icat-green focus:border-icat-green sm:text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 p-4 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-icat-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-icat-blue transition-colors disabled:opacity-50"
              >
                {loading ? 'Entrando...' : 'Entrar no Sistema'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Acesso pela primeira vez?</span>
              </div>
            </div>

            <div className="mt-6">
              <a
                href="/cadastro/beneficiario"
                className="w-full flex justify-center py-2.5 px-4 border border-icat-green rounded-md shadow-sm text-sm font-medium text-icat-green bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-icat-green transition-colors"
              >
                Fazer Cadastro de Beneficiário
              </a>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="text-sm font-bold text-blue-900 mb-2">Dados para teste rápido:</h4>
              <p className="text-xs text-blue-800 mb-1"><strong>Admin:</strong> admin@admin / super123</p>
              <p className="text-xs text-blue-800"><strong>Beneficiário (Mock):</strong> Pode logar com o admin e o sistema vai abrir o painel admin. O cadastro criará conta real via Supabase.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
