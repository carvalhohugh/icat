'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ClipboardList, ArrowRight, BarChart3, Users } from 'lucide-react';
import { getPesquisas, type Pesquisa } from '@/lib/pesquisas-store';

export function EnquetesSection() {
  const [pesquisas, setPesquisas] = useState<Pesquisa[]>([]);

  useEffect(() => {
    setPesquisas(getPesquisas());
    const handler = () => setPesquisas(getPesquisas());
    window.addEventListener('icat_pesquisas_update', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('icat_pesquisas_update', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const ativas = pesquisas.filter(p => p.status === 'Ativa');

  if (ativas.length === 0) return null;

  return (
    <section id="enquetes" className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4 text-icat-blue">
            <ClipboardList className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">Pesquisas e Enquetes Abertas</h2>
          <p className="mt-4 text-lg text-gray-600">
            Participe ativamente das decisões da nossa comunidade. Sua opinião ajuda a direcionar projetos e melhorias para a nossa região.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ativas.map(p => (
            <div key={p.id} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-icat-blue border border-blue-100">
                    <BarChart3 className="w-3.5 h-3.5" /> {p.tipo}
                  </span>
                  <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {p.respostas.length} votos
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-icat-blue transition-colors leading-tight">
                  {p.nome}
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  {p.multiSelect ? 'Selecione uma ou mais opções.' : 'Escolha uma única opção.'} {p.induzida ? 'Apenas opções listadas.' : 'Opção livre disponível.'}
                </p>
              </div>
              <Link href={`/pesquisa/${p.id}`} className="mt-auto w-full inline-flex justify-center items-center gap-2 bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-colors shadow-md">
                Participar Agora <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
