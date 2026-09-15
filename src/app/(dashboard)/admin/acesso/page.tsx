'use client';
import { useState } from 'react';
import { Camera, QrCode, ScanFace, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function ControleAcesso() {
  const [scanMode, setScanMode] = useState<'qr' | 'facial'>('qr');
  const [simulatedId, setSimulatedId] = useState('');
  const [accessResult, setAccessResult] = useState<{status: 'granted' | 'denied' | 'suspended', name: string, message: string} | null>(null);

  const users = [
    { id: '1', name: 'Maria da Silva', status: 'Aprovado' },
    { id: '2', name: 'João Oliveira', status: 'Suspenso' },
  ];

  const handleSimulateScan = () => {
    if (!simulatedId) return;
    setTimeout(() => {
      const user = users.find(u => u.id === simulatedId);
      if (!user) {
        setAccessResult({ status: 'denied', name: 'Desconhecido', message: 'Cadastro não encontrado no sistema.' });
      } else if (user.status === 'Suspenso') {
        setAccessResult({ status: 'suspended', name: user.name, message: 'Acesso Negado: Cadastro Suspenso.' });
      } else {
        setAccessResult({ status: 'granted', name: user.name, message: 'Acesso Liberado.' });
      }
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catraca Virtual</h1>
          <p className="text-gray-500 text-sm mt-1">Controle de acesso via QR Code ou Reconhecimento Facial.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 flex justify-center gap-4 bg-gray-50">
            <button onClick={() => setScanMode('qr')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${scanMode === 'qr' ? 'bg-icat-blue text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
              <QrCode className="w-4 h-4" /> Leitor de QR Code
            </button>
            <button onClick={() => setScanMode('facial')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${scanMode === 'facial' ? 'bg-icat-blue text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
              <ScanFace className="w-4 h-4" /> Reconhecimento Facial
            </button>
          </div>
          <div className="flex-1 min-h-[300px] bg-black relative flex items-center justify-center">
            {scanMode === 'facial' ? (
              <div className="absolute inset-0 border-4 border-dashed border-green-500/50 rounded-[4rem] m-8 pointer-events-none animate-pulse"></div>
            ) : (
              <div className="absolute w-48 h-48 border-2 border-white/50 pointer-events-none">
                 <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-icat-green"></div>
                 <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-icat-green"></div>
                 <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-icat-green"></div>
                 <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-icat-green"></div>
              </div>
            )}
            <Camera className="w-16 h-16 text-white/20" />
            <p className="absolute bottom-4 text-white/50 text-sm font-medium">Câmera Ativa...</p>
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Simulação de Leitura (MVP)</label>
            <div className="flex gap-2">
              <input type="text" value={simulatedId} onChange={e => setSimulatedId(e.target.value)} placeholder="Digite o ID (ex: 1 ou 2)" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-blue outline-none" />
              <button onClick={handleSimulateScan} className="btn-primary">Ler</button>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-center items-center text-center">
          {!accessResult ? (
            <div className="text-gray-400">
              <QrCode className="w-20 h-20 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-bold text-gray-700">Aguardando Leitura...</h3>
              <p className="text-sm mt-2">Apresente a carteirinha ou posicione o rosto.</p>
            </div>
          ) : (
            <div className="w-full animate-in zoom-in duration-300">
              {accessResult.status === 'granted' && <CheckCircle className="w-24 h-24 mx-auto mb-4 text-green-500" />}
              {accessResult.status === 'denied' && <XCircle className="w-24 h-24 mx-auto mb-4 text-red-500" />}
              {accessResult.status === 'suspended' && <AlertTriangle className="w-24 h-24 mx-auto mb-4 text-orange-500" />}
              <h2 className="text-3xl font-black text-gray-900 mb-2">{accessResult.name}</h2>
              <div className={`mt-4 inline-block px-6 py-3 rounded-full text-lg font-bold ${accessResult.status === 'granted' ? 'bg-green-100 text-green-700' : accessResult.status === 'denied' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                {accessResult.message}
              </div>
              <button onClick={() => setAccessResult(null)} className="mt-8 text-sm font-semibold text-gray-500 hover:text-gray-800 underline">
                Limpar e ler próximo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
