'use client';
import { useState } from 'react';
import { ClipboardList, LogIn } from 'lucide-react';

export default function EntrevistadorLogin() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!login || !senha) { setError('Preencha login e senha.'); return; }
    localStorage.setItem('entrevistadorLogin', login);
    localStorage.setItem('entrevistadorNome', login.split('.').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' '));
    window.location.href = '/entrevistador/pesquisas';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br from-icat-blue to-icat-green flex items-center justify-center mb-4 shadow-lg">
            <ClipboardList className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Pesquisas ICAT</h1>
          <p className="text-gray-400 text-sm mt-1">Acesso do Entrevistador</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-4">
          {error && <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg font-medium">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input type="email" value={login} onChange={e => { setLogin(e.target.value); setError(''); }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-icat-green outline-none text-sm"
              placeholder="seu@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input type="password" value={senha} onChange={e => { setSenha(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-icat-green outline-none text-sm"
              placeholder="••••••" />
          </div>
          <button onClick={handleLogin}
            className="w-full bg-gradient-to-r from-icat-blue to-icat-green text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm">
            <LogIn className="w-5 h-5" /> Entrar
          </button>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">Instituto Catalano de Ação Social &amp; Tecnologia</p>
      </div>
    </div>
  );
}
