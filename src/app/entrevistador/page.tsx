'use client';
import { useState, useEffect } from 'react';
import { ClipboardList, LogIn, KeyRound } from 'lucide-react';

export default function EntrevistadorLogin() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [entrevistadores, setEntrevistadores] = useState<any[]>([]);
  const [showReset, setShowReset] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [novaSenha, setNovaSenha] = useState('');
  const [userIdToUpdate, setUserIdToUpdate] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('icat_entrevistadores');
    if (saved) {
      setEntrevistadores(JSON.parse(saved));
    } else {
      const MOCK_ENTREVISTADORES = [
        { id: 1, nome: 'Carlos Silva', email: 'carlos@institutocatalano.com.br', senha: '123' },
        { id: 2, nome: 'Amanda Oliveira', email: 'amanda@institutocatalano.com.br', senha: '123' },
        { id: 3, nome: 'Roberto Santos', email: 'roberto@institutocatalano.com.br', senha: '123' },
        { id: 4, nome: 'Fernanda Lima', email: 'fernanda@institutocatalano.com.br', senha: '123' },
      ];
      setEntrevistadores(MOCK_ENTREVISTADORES);
      localStorage.setItem('icat_entrevistadores', JSON.stringify(MOCK_ENTREVISTADORES));
    }
  }, []);

  const handleLogin = () => {
    if (!login || !senha) { setError('Preencha e-mail e senha.'); return; }
    const found = entrevistadores.find(
      e => e.email === login.trim().toLowerCase() && e.senha === senha
    );
    if (!found) { setError('E-mail ou senha incorretos.'); return; }

    if (found.senha === '123' || found.senha === '123456') {
      setUserIdToUpdate(found.id);
      setShowNovaSenha(true);
      setError('');
      return;
    }

    localStorage.setItem('entrevistador_session', JSON.stringify({ id: found.id, nome: found.nome }));
    window.location.href = '/entrevistador/pesquisas';
  };

  const handleReset = () => {
    if (!login) { setError('Preencha o e-mail para resetar a senha.'); return; }
    const index = entrevistadores.findIndex(e => e.email === login.trim().toLowerCase());
    if (index === -1) { setError('E-mail não encontrado.'); return; }

    const updated = [...entrevistadores];
    updated[index].senha = '123456';
    setEntrevistadores(updated);
    localStorage.setItem('icat_entrevistadores', JSON.stringify(updated));
    setError('');
    alert('Senha resetada para 123456 com sucesso!');
    setShowReset(false);
  };

  const handleSaveNovaSenha = () => {
    if (!novaSenha || novaSenha.length < 6) { setError('A nova senha deve ter no mínimo 6 caracteres.'); return; }
    const index = entrevistadores.findIndex(e => e.id === userIdToUpdate);
    if (index !== -1) {
      const updated = [...entrevistadores];
      updated[index].senha = novaSenha;
      setEntrevistadores(updated);
      localStorage.setItem('icat_entrevistadores', JSON.stringify(updated));
      localStorage.setItem('entrevistador_session', JSON.stringify({ id: updated[index].id, nome: updated[index].nome }));
      window.location.href = '/entrevistador/pesquisas';
    }
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
          
          {showNovaSenha ? (
            <>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Criar Nova Senha</h2>
              <p className="text-sm text-gray-600 mb-4">Como é o seu primeiro acesso (ou sua senha foi resetada), por favor, cadastre uma nova senha de segurança.</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                <input type="password" value={novaSenha} onChange={e => { setNovaSenha(e.target.value); setError(''); }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-icat-green outline-none text-sm"
                  placeholder="Mínimo 6 caracteres" />
              </div>
              <button onClick={handleSaveNovaSenha}
                className="w-full bg-gradient-to-r from-icat-blue to-icat-green text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity mt-4 shadow-sm">
                Salvar e Entrar
              </button>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input type="email" value={login} onChange={e => { setLogin(e.target.value); setError(''); }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-icat-green outline-none text-sm"
                  placeholder="seu@email.com" />
              </div>
              
              {!showReset && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Senha</label>
                    <button onClick={() => { setShowReset(true); setError(''); }} className="text-xs text-icat-blue hover:underline">Esqueci minha senha</button>
                  </div>
                  <input type="password" value={senha} onChange={e => { setSenha(e.target.value); setError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-icat-green outline-none text-sm"
                    placeholder="******" />
                </div>
              )}

              {showReset ? (
                <div className="pt-2">
                  <button onClick={handleReset}
                    className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-sm mb-2">
                    <KeyRound className="w-5 h-5" /> Resetar Senha
                  </button>
                  <button onClick={() => setShowReset(false)} className="w-full text-sm text-gray-500 py-2 hover:text-gray-800">Voltar ao Login</button>
                </div>
              ) : (
                <button onClick={handleLogin}
                  className="w-full bg-gradient-to-r from-icat-blue to-icat-green text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm pt-2 mt-2">
                  <LogIn className="w-5 h-5" /> Entrar
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
