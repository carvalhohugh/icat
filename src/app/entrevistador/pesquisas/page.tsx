'use client';
import { useState, useEffect } from 'react';
import { ClipboardList, ChevronRight, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function EntrevistadorPesquisas() {
  const [nome, setNome] = useState('');

  useEffect(() => {
    const n = localStorage.getItem('entrevistadorNome');
    if (n) setNome(n);
  }, []);

  const pesquisas = [
    { id: 1, nome: 'Intenção de Voto — Prefeito Catalão 2026', tipo: 'Intenção de Voto', respostas: 47, meta: 200 },
    { id: 2, nome: 'Melhorias Necessárias — Catalão', tipo: 'Opinião', respostas: 23, meta: 150 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Mobile */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-icat-blue to-icat-green flex items-center justify-center shadow-sm">
            <ClipboardList className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Olá, {nome || 'Entrevistador'}</p>
            <p className="text-xs text-gray-500">Suas pesquisas ativas</p>
          </div>
        </div>
        <button onClick={() => { localStorage.removeItem('entrevistadorLogin'); localStorage.removeItem('entrevistadorNome'); window.location.href = '/entrevistador'; }}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <div className="p-4 space-y-3 max-w-lg mx-auto">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide px-1">Pesquisas Atribuídas</p>
        {pesquisas.map(p => {
          const pct = Math.round((p.respostas / p.meta) * 100);
          return (
            <Link key={p.id} href={`/entrevistador/pesquisas/${p.id}`}
              className="block bg-white rounded-2xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow active:scale-[0.98]">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-sm leading-tight">{p.nome}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{p.tipo}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className="h-2.5 rounded-full bg-gradient-to-r from-icat-blue to-icat-green transition-all duration-500" style={{ width: `${Math.min(pct, 100)}%` }}></div>
                </div>
                <span className="text-xs font-bold text-gray-600 whitespace-nowrap">{p.respostas}/{p.meta}</span>
              </div>
            </Link>
          );
        })}

        <div className="pt-4 text-center">
          <p className="text-xs text-gray-400">Toque em uma pesquisa para iniciar a coleta</p>
        </div>
      </div>
    </div>
  );
}
