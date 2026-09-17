'use client';
import { useState, useEffect } from 'react';
import { Users, HeartHandshake, Briefcase, GraduationCap, MapPin, Search, AlertCircle, Plus, Building2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function RecomecoDashboard() {
  const [stats, setStats] = useState({
    participantes: 0,
    oportunidades: 0,
    encaminhamentos: 0,
    autonomia: 0
  });

  const [oportunidades, setOportunidades] = useState<any[]>([]);
  const [loadingScrape, setLoadingScrape] = useState(false);

  // Mock data para a interface inicial
  useEffect(() => {
    setStats({
      participantes: 142,
      oportunidades: 2,
      encaminhamentos: 35,
      autonomia: 12
    });
    setOportunidades([
      { id: 1, titulo: 'Auxiliar Administrativo', empresa: 'Prefeitura de Catalão (SINE)', local: 'Catalão, GO', tipo: 'Emprego', requisitos: 'Ensino Médio, Informática', status: 'Aberta' },
      { id: 2, titulo: 'Jovem Aprendiz', empresa: 'Supermercado ABC', local: 'Catalão, GO', tipo: 'Jovem Aprendiz', requisitos: '14 a 18 anos', status: 'Aberta' }
    ]);
  }, []);

  const handleSyncVagas = async () => {
    setLoadingScrape(true);
    try {
      const res = await fetch('/api/oportunidades/sync');
      const data = await res.json();
      if (data.success && data.vagas) {
        setOportunidades(data.vagas);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingScrape(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projeto Recomeço</h1>
          <p className="text-gray-500 text-sm mt-1">Módulo Integrado de Gestão Social e Desenvolvimento Humano.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/beneficiarios" className="btn-primary flex items-center bg-icat-blue hover:bg-blue-600">
            <Users className="w-5 h-5 mr-2" />
            Participantes
          </Link>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center hover:border-icat-green transition-all">
          <div className="bg-blue-50 p-4 rounded-full mr-4"><Users className="w-6 h-6 text-icat-blue" /></div>
          <div><p className="text-sm font-medium text-gray-500">Participantes Ativos</p><h3 className="text-2xl font-bold text-gray-900">{stats.participantes}</h3></div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center hover:border-icat-green transition-all">
          <div className="bg-yellow-50 p-4 rounded-full mr-4"><Briefcase className="w-6 h-6 text-icat-yellow" /></div>
          <div><p className="text-sm font-medium text-gray-500">Oportunidades (SINE)</p><h3 className="text-2xl font-bold text-gray-900">{stats.oportunidades}</h3></div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center hover:border-icat-green transition-all">
          <div className="bg-orange-50 p-4 rounded-full mr-4"><HeartHandshake className="w-6 h-6 text-orange-500" /></div>
          <div><p className="text-sm font-medium text-gray-500">Encaminhamentos</p><h3 className="text-2xl font-bold text-gray-900">{stats.encaminhamentos}</h3></div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center hover:border-icat-green transition-all">
          <div className="bg-green-50 p-4 rounded-full mr-4"><GraduationCap className="w-6 h-6 text-icat-green" /></div>
          <div><p className="text-sm font-medium text-gray-500">Alcançaram Autonomia</p><h3 className="text-2xl font-bold text-gray-900">{stats.autonomia}</h3></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel de Oportunidades */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-icat-yellow" /> Mural de Oportunidades
              </h2>
              <button 
                onClick={handleSyncVagas} 
                disabled={loadingScrape}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loadingScrape ? 'Sincronizando SINE...' : 'Sincronizar Vagas SINE'}
              </button>
            </div>
            
            <div className="space-y-4">
              {oportunidades.map((vaga, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-4 hover:border-icat-green transition-colors bg-gray-50/50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{vaga.titulo}</h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1"><Building2 className="w-3.5 h-3.5"/> {vaga.empresa}</p>
                    </div>
                    <span className="bg-green-100 text-green-700 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full">{vaga.tipo}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-3 flex items-center gap-4">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5"/> {vaga.local}</span>
                    <span className="flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5"/> Requisitos: {vaga.requisitos}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                    <button className="text-sm font-semibold text-icat-blue hover:underline">Fazer Cruzamento de Perfil (Match)</button>
                  </div>
                </div>
              ))}
              {oportunidades.length === 0 && !loadingScrape && (
                <div className="text-center py-8 text-gray-400">Nenhuma vaga encontrada.</div>
              )}
            </div>
          </div>
        </div>

        {/* Status Recomeço */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-icat-green" /> Acompanhamentos
          </h2>
          
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
             <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-slate-300 group-[.is-active]:bg-icat-yellow text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded bg-white border border-gray-100 shadow-sm">
                   <div className="flex items-center justify-between mb-1">
                      <div className="font-bold text-slate-900 text-sm">Maria S. (Emergencial)</div>
                      <time className="text-xs font-medium text-red-500">Atrasado</time>
                   </div>
                   <div className="text-xs text-slate-500">Agendar visita domiciliar.</div>
                </div>
             </div>

             <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-slate-300 group-[.is-active]:bg-icat-green text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded bg-white border border-gray-100 shadow-sm">
                   <div className="flex items-center justify-between mb-1">
                      <div className="font-bold text-slate-900 text-sm">João P. (Oportunidade)</div>
                      <time className="text-xs font-medium text-slate-500">Hoje</time>
                   </div>
                   <div className="text-xs text-slate-500">Entrevista no ABC.</div>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
