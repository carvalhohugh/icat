import { Users, BookOpen, Package, Heart, Cake, MessageCircle, BarChart3, PieChart } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { title: 'Famílias Beneficiadas', value: '45', icon: Heart, color: 'text-icat-yellow', bg: 'bg-yellow-50' },
    { title: 'Pessoas Atendidas', value: '187', icon: Users, color: 'text-icat-blue', bg: 'bg-blue-50' },
    { title: 'Alunos Matriculados', value: '112', icon: BookOpen, color: 'text-icat-green', bg: 'bg-green-50' },
    { title: 'Benefícios Entregues', value: '89', icon: Package, color: 'text-orange-500', bg: 'bg-orange-50' },
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
        <div className="text-sm text-gray-500">Última atualização: Hoje, 08:30</div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
            <div className={`${stat.bg} p-4 rounded-full mr-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráficos de Relatórios */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-gray-400" /> Atendimento por Gênero
            </h2>
            <div className="h-64 flex flex-col md:flex-row items-center justify-center gap-8">
              <div 
                className="w-48 h-48 rounded-full shadow-inner" 
                style={{ background: 'conic-gradient(#05B253 0% 58%, #2A8CFF 58% 100%)' }}
              ></div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm bg-icat-green"></div>
                  <span className="text-sm font-medium text-gray-700">Feminino (58%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm bg-icat-blue"></div>
                  <span className="text-sm font-medium text-gray-700">Masculino (42%)</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-400" /> Faixa de Idade
            </h2>
            <div className="h-64 flex items-end justify-between gap-2 md:gap-6 pt-8 pb-4 border-b border-gray-200">
              <div className="flex flex-col items-center flex-1 group">
                <div className="w-full bg-icat-yellow rounded-t-sm h-[40%] group-hover:bg-yellow-500 transition-colors relative">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-600">40%</span>
                </div>
                <span className="text-xs text-gray-500 mt-2 font-medium">0-12</span>
              </div>
              <div className="flex flex-col items-center flex-1 group">
                <div className="w-full bg-icat-green rounded-t-sm h-[30%] group-hover:bg-green-600 transition-colors relative">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-600">30%</span>
                </div>
                <span className="text-xs text-gray-500 mt-2 font-medium">13-17</span>
              </div>
              <div className="flex flex-col items-center flex-1 group">
                <div className="w-full bg-icat-blue rounded-t-sm h-[15%] group-hover:bg-blue-600 transition-colors relative">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-600">15%</span>
                </div>
                <span className="text-xs text-gray-500 mt-2 font-medium">18-35</span>
              </div>
              <div className="flex flex-col items-center flex-1 group">
                <div className="w-full bg-purple-500 rounded-t-sm h-[10%] group-hover:bg-purple-600 transition-colors relative">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-600">10%</span>
                </div>
                <span className="text-xs text-gray-500 mt-2 font-medium">36-59</span>
              </div>
              <div className="flex flex-col items-center flex-1 group">
                <div className="w-full bg-gray-400 rounded-t-sm h-[5%] group-hover:bg-gray-500 transition-colors relative">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-600">5%</span>
                </div>
                <span className="text-xs text-gray-500 mt-2 font-medium">60+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Aniversariantes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Cake className="w-5 h-5 text-icat-yellow" /> Aniversariantes da Semana
          </h2>
          <div className="space-y-4">
            {aniversariantes.map((a, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{a.name}</p>
                  <p className="text-xs text-gray-500">{a.data}</p>
                </div>
                <a 
                  href={`https://wa.me/${a.fone}?text=Parabéns!`}
                  target="_blank" rel="noreferrer"
                  className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                  title="Enviar mensagem via WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
