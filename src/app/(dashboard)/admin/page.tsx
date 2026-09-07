import { Users, BookOpen, Heart, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Visão Geral</h1>
        <button className="btn-primary text-sm py-1.5">Gerar Relatório</button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-lg bg-blue-50">
            <Users className="h-6 w-6 text-icat-blue" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Alunos Ativos</p>
            <p className="text-2xl font-bold text-gray-900">432</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-lg bg-green-50">
            <BookOpen className="h-6 w-6 text-icat-green" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Cursos & Turmas</p>
            <p className="text-2xl font-bold text-gray-900">18</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-lg bg-yellow-50">
            <Heart className="h-6 w-6 text-icat-yellow" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Famílias Assistidas</p>
            <p className="text-2xl font-bold text-gray-900">156</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-lg bg-purple-50">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Doações (Mês)</p>
            <p className="text-2xl font-bold text-gray-900">R$ 4.2k</p>
          </div>
        </div>
      </div>

      {/* Recent Activity & Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Frequência Semanal</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <span className="text-gray-400">Gráfico de Frequência Aqui</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Últimos Registros</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">Entrega de Cesta Básica</p>
                  <p className="text-xs text-gray-500">Para: Maria da Silva</p>
                </div>
                <span className="text-xs text-gray-400">Há 2h</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
