'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, CheckCircle2, QrCode } from 'lucide-react';

export default function ChamadaPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const method = searchParams.get('method') || 'manual';
  const [token] = useState('icat-test-qr-12345');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    if (method === 'qrcode' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, method]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const alunosMock = [
    { id: 1, name: 'Ana Souza', present: false },
    { id: 2, name: 'João Guilherme', present: true },
    { id: 3, name: 'Maria Eduarda', present: false },
    { id: 4, name: 'Pedro Henrique', present: false },
  ];

  const [alunos, setAlunos] = useState(alunosMock);

  const togglePresenca = (id: number) => {
    setAlunos(alunos.map(a => a.id === id ? { ...a, present: !a.present } : a));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="mb-6 flex items-center justify-between">
        <Link href={`/professor/turma/${params.id}`} className="text-sm font-medium text-gray-500 hover:text-icat-blue flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar para turma
        </Link>
        <div className="text-sm font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
          Diário: {new Date().toLocaleDateString('pt-BR')}
        </div>
      </div>

      {method === 'qrcode' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center flex flex-col items-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Escaneie o QR Code</h2>
          <p className="text-gray-500 mb-8">Alunos devem utilizar o aplicativo ou a Área do Aluno para registrar presença.</p>
          
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-6">
            <QRCodeSVG 
              value={`https://icat.org.br/aluno/presenca?token=${token}`}
              size={280}
              level="H"
              includeMargin={true}
              fgColor="#1F2937"
            />
          </div>

          <div className="flex items-center justify-center space-x-2 text-xl font-bold text-gray-900 mb-8">
            <span>Expira em:</span>
            <span className={`px-3 py-1 rounded-lg ${timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-800'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>

          <div className="w-full max-w-sm space-y-4">
            <button className="btn-secondary w-full" onClick={() => setTimeLeft(300)}>
              Gerar Novo QR Code
            </button>
            <Link href={`/professor/turma/${params.id}/chamada?method=manual`} className="block w-full text-center text-icat-blue font-medium hover:underline">
              Alternar para Chamada Manual
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Chamada Manual</h2>
              <p className="text-sm text-gray-500">Marque os alunos presentes</p>
            </div>
            <Link href={`/professor/turma/${params.id}/chamada?method=qrcode`} className="mt-4 sm:mt-0 flex items-center text-sm font-medium text-icat-blue bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors">
              <QrCode className="h-4 w-4 mr-2" />
              Usar QR Code
            </Link>
          </div>
          
          <ul className="divide-y divide-gray-100">
            {alunos.map(aluno => (
              <li key={aluno.id} className="p-4 hover:bg-gray-50 flex items-center justify-between cursor-pointer" onClick={() => togglePresenca(aluno.id)}>
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                    {aluno.name.charAt(0)}
                  </div>
                  <span className="font-medium text-gray-900">{aluno.name}</span>
                </div>
                <div>
                  {aluno.present ? (
                    <CheckCircle2 className="h-8 w-8 text-icat-green" />
                  ) : (
                    <div className="h-8 w-8 rounded-full border-2 border-gray-300"></div>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <button className="btn-primary w-full md:w-auto">
              Salvar Chamada
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
