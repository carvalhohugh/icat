'use client';
import { useEffect, useState } from 'react';
import { Users, BookOpen, Package, Heart, Cake, MessageCircle, BarChart3, PieChart, Activity } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    alunos: 0,
    beneficiarios: 0,
    doacoes: 0,
    funcionarios: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Como não sabemos a estrutura completa de todas as tabelas, vamos tentar buscar as que conhecemos
      try {
        const { count: alunosCount } = await supabase.from('alunos').select('*', { count: 'exact', head: true });
        const { count: benCount } = await supabase.from('beneficiarios').select('*', { count: 'exact', head: true });
        
        // Mock fallback if table doesn't exist or is empty
        setStats({
          alunos: alunosCount || 112,
          beneficiarios: benCount || 45,
          doacoes: 89, // Mock financeiro/estoque
          funcionarios: 12 // Mock
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const kpis = [
    { title: 'Alunos Matriculados', value: loading ? '...' : stats.alunos, icon: BookOpen, color: 'text-icat-green', bg: 'bg-green-50', link: '/admin/alunos' },
    { title: 'Famílias Beneficiadas', value: loading ? '...' : stats.beneficiarios, icon: Heart, color: 'text-icat-yellow', bg: 'bg-yellow-50', link: '/admin/beneficiarios' },
    { title: 'Pessoas Atendidas', value: loading ? '...' : (stats.alunos + stats.beneficiarios), icon: Users, color: 'text-icat-blue', bg: 'bg-blue-50', link: '/admin/beneficiarios' },
    { title: 'Benefícios Entregues', value: loading ? '...' : stats.doacoes, icon: Package, color: 'text-orange-500', bg: 'bg-orange-50', link: '/admin/estoque' },
  ];

  const aniversariantes = [
    { name: 'Ana Souza (Aluna)', data: 'Hoje', fone: '5564900001111' },
    { name: 'João Silva (Resp.)', data: 'Amanhã', fone: '5564900001111' },
    { name: 'Marcos Costa (Aluno)', data: 'Sexta-feira', fone: '5564900001111' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          {loading ? 'Sincronizando dados...' : 'Atualizado em tempo real'}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((stat, i) => (
          <Link href={stat.link} key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center hover:shadow-md transition-all cursor-pointer hover:border-icat-green group">
            <div className={`${stat.bg} p-4 rounded-full mr-4 group-hover:scale-110 transition-transform`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráficos de Relatórios */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 relative z-10">
              <Activity className="w-5 h-5 text-icat-blue" /> Receitas x Despesas (Anual)
            </h2>
            
            {/* Gráfico Simulado de Barras (Financeiro) */}
            <div className="h-64 flex items-end justify-between gap-2 md:gap-4 pt-8 pb-4 border-b border-gray-200 relative z-10 mt-4">
              {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'].map((mes, idx) => {
                const heightReceita = Math.floor(Math.random() * 60) + 20; // 20 a 80
                const heightDespesa = Math.floor(Math.random() * (heightReceita - 10)) + 10;
                
                return (
                  <div key={mes} className="flex flex-col items-center justify-end h-full flex-1 group gap-1">
                    <div className="flex gap-1 w-full justify-center items-end h-full relative">
                      <div className="w-1/2 bg-icat-green/80 rounded-t-sm transition-all group-hover:bg-icat-green group-hover:w-full" style={{ height: `${heightReceita}%` }} title={`Receita: R$ ${heightReceita}k`}></div>
                      <div className="w-1/2 bg-red-400/80 rounded-t-sm transition-all group-hover:bg-red-500 group-hover:hidden" style={{ height: `${heightDespesa}%` }} title={`Despesa: R$ ${heightDespesa}k`}></div>
                    </div>
                    <span className="text-[10px] md:text-xs text-gray-500 mt-2 font-medium">{mes}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center gap-6 mt-4">
               <div className="flex items-center gap-2"><div className="w-3 h-3 bg-icat-green rounded-full"></div><span className="text-xs text-gray-600 font-medium">Entradas (Doações/Mensalidades)</span></div>
               <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-400 rounded-full"></div><span className="text-xs text-gray-600 font-medium">Saídas (Custo/Folha)</span></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-gray-400" /> Perfil de Gênero
              </h2>
              <div className="h-48 flex flex-col items-center justify-center gap-6">
                <div 
                  className="w-32 h-32 rounded-full shadow-inner animate-pulse" 
                  style={{ background: 'conic-gradient(#05B253 0% 62%, #2A8CFF 62% 100%)' }}
                ></div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-icat-green"></div>
                    <span className="text-xs font-bold text-gray-700">Fem. (62%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-icat-blue"></div>
                    <span className="text-xs font-bold text-gray-700">Masc. (38%)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-gray-400" /> Metas de Matrículas
              </h2>
              <div className="space-y-6 mt-6">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-gray-700">Futebol</span>
                    <span className="font-bold text-icat-green">85%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="bg-icat-green h-2.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-gray-700">Ballet</span>
                    <span className="font-bold text-icat-blue">60%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="bg-icat-blue h-2.5 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-gray-700">Informática</span>
                    <span className="font-bold text-icat-yellow">92%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="bg-icat-yellow h-2.5 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Aniversariantes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-fit sticky top-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Cake className="w-5 h-5 text-icat-yellow" /> Aniversariantes da Semana
          </h2>
          <div className="space-y-4">
            {aniversariantes.map((a, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-green-200 transition-colors group">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{a.name}</p>
                  <p className="text-xs text-gray-500">{a.data}</p>
                </div>
                <a 
                  href={`https://wa.me/${a.fone}?text=Parabéns!`}
                  target="_blank" rel="noreferrer"
                  className="p-2 bg-green-50 text-green-600 rounded-full group-hover:bg-green-500 group-hover:text-white transition-all shadow-sm"
                  title="Enviar mensagem via WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100">
             <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Avisos do Sistema</h2>
             <div className="space-y-3">
                <div className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded-r-lg">
                   <p className="text-xs text-orange-800 font-medium">O estoque de Leite Integral está abaixo da margem de segurança (Restam 4 caixas).</p>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg">
                   <p className="text-xs text-blue-800 font-medium">Reunião de professores agendada para 20/09 às 19h.</p>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
