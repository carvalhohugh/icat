'use client';

import { useState } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, Upload, Search, Filter, 
  FileText, CheckCircle, Clock, Plus, Building, User, Wallet, FileUp, List
} from 'lucide-react';

// Mocks
const mockTransacoes = [
  { id: 1, data: '2026-09-01', descricao: 'Mensalidade - Pedro Henrique', categoria: 'Mensalidades', tipo: 'entrada', valor: 80.00, status: 'pago', banco: 'Caixa Econômica' },
  { id: 2, data: '2026-09-02', descricao: 'Conta de Luz', categoria: 'Custos Fixos', tipo: 'saida', valor: 450.00, status: 'pago', banco: 'Banco do Brasil' },
  { id: 3, data: '2026-09-03', descricao: 'Doação Pessoa Física', categoria: 'Doações', tipo: 'entrada', valor: 150.00, status: 'pago', banco: 'Sicoob' },
  { id: 4, data: '2026-09-05', descricao: 'Emenda Parlamentar #123 (Dep. X)', categoria: 'Emendas', tipo: 'entrada', valor: 50000.00, status: 'pendente', banco: 'Banco do Brasil' },
  { id: 5, data: '2026-09-10', descricao: 'Compra de Bolas e Coletes', categoria: 'Equipamentos', tipo: 'saida', valor: 1200.00, status: 'pago', banco: 'Caixa Econômica' },
];

const mockEmendas = [
  { id: 1, numero: 'EM-2026-001', autor: 'Deputado João', valor: 50000, finalidade: 'Reforma da quadra esportiva', status: 'Aprovada', recebido: 0 },
  { id: 2, numero: 'EM-2026-045', autor: 'Senadora Maria', valor: 120000, finalidade: 'Custeio de profissionais (Ano 1)', status: 'Recebida', recebido: 120000 },
];

const mockAlunos = [
  { id: 1, nome: 'Pedro Henrique', turma: 'Futebol Sub-12', valor: 80, status: 'Em dia', proxVencimento: '2026-10-10' },
  { id: 2, nome: 'Ana Clara', turma: 'Ballet Infantil', valor: 80, status: 'Atrasado', proxVencimento: '2026-09-10' },
  { id: 3, nome: 'Lucas Santos', turma: 'Informática Básica', valor: 60, status: 'Isento', proxVencimento: '-' },
];

export default function FinanceiroAdmin() {
  const [activeTab, setActiveTab] = useState<'geral' | 'transacoes' | 'conciliacao' | 'emendas' | 'mensalidades'>('geral');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestão Financeira</h1>
        <p className="text-gray-500 text-sm mt-1">Acompanhe entradas, saídas, emendas e conciliações bancárias.</p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200 hide-scrollbar space-x-6">
        <button onClick={() => setActiveTab('geral')} className={`pb-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'geral' ? 'border-icat-green text-icat-green' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Visão Geral</button>
        <button onClick={() => setActiveTab('transacoes')} className={`pb-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'transacoes' ? 'border-icat-green text-icat-green' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Transações</button>
        <button onClick={() => setActiveTab('conciliacao')} className={`pb-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'conciliacao' ? 'border-icat-green text-icat-green' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Contas e Extratos</button>
        <button onClick={() => setActiveTab('emendas')} className={`pb-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'emendas' ? 'border-icat-green text-icat-green' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Emendas Parlamentares</button>
        <button onClick={() => setActiveTab('mensalidades')} className={`pb-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'mensalidades' ? 'border-icat-green text-icat-green' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Mensalidades / Repasses</button>
      </div>

      {activeTab === 'geral' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-gray-500">Saldo Atual (Caixa)</span>
                <div className="p-2 bg-blue-50 text-icat-blue rounded-lg"><Wallet className="w-5 h-5" /></div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900">R$ 14.520,50</h3>
                <p className="text-xs text-gray-400 mt-1">Soma das contas ativas</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-gray-500">Entradas (Mês)</span>
                <div className="p-2 bg-green-50 text-green-600 rounded-lg"><ArrowUpRight className="w-5 h-5" /></div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-green-600">R$ 3.450,00</h3>
                <p className="text-xs text-gray-400 mt-1">+12% vs mês passado</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-gray-500">Saídas (Mês)</span>
                <div className="p-2 bg-red-50 text-red-500 rounded-lg"><ArrowDownRight className="w-5 h-5" /></div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-red-500">R$ 1.820,00</h3>
                <p className="text-xs text-gray-400 mt-1">-5% vs mês passado</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-gray-500">Emendas (Aprovadas)</span>
                <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg"><Building className="w-5 h-5" /></div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900">R$ 170.000</h3>
                <p className="text-xs text-gray-400 mt-1">2 emendas em 2026</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Últimas Transações</h3>
              <div className="space-y-4">
                {mockTransacoes.slice(0,4).map(t => (
                  <div key={t.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${t.tipo === 'entrada' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                        {t.tipo === 'entrada' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{t.descricao}</p>
                        <p className="text-xs text-gray-500">{t.data} • {t.categoria}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-sm ${t.tipo === 'entrada' ? 'text-green-600' : 'text-red-500'}`}>
                        {t.tipo === 'entrada' ? '+' : '-'} R$ {t.valor.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setActiveTab('transacoes')} className="w-full mt-4 text-sm text-icat-blue hover:underline font-medium">Ver todas as transações</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'transacoes' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex flex-wrap gap-4 justify-between items-center bg-gray-50">
            <div className="relative w-full sm:w-80">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Buscar por descrição..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-icat-green outline-none" />
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary bg-white border border-gray-200 flex items-center text-gray-700">
                <Filter className="w-4 h-4 mr-2" /> Filtros
              </button>
              <button className="btn-primary flex items-center">
                <Plus className="w-4 h-4 mr-2" /> Nova Transação
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200 text-sm text-gray-500 uppercase bg-white">
                  <th className="p-4 font-semibold">Data</th>
                  <th className="p-4 font-semibold">Descrição / Categoria</th>
                  <th className="p-4 font-semibold">Banco</th>
                  <th className="p-4 font-semibold text-right">Valor</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockTransacoes.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="p-4 text-sm text-gray-600">{t.data}</td>
                    <td className="p-4">
                      <p className="font-medium text-gray-900 text-sm">{t.descricao}</p>
                      <p className="text-xs text-gray-500">{t.categoria}</p>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{t.banco}</td>
                    <td className="p-4 text-right">
                      <span className={`font-bold text-sm ${t.tipo === 'entrada' ? 'text-green-600' : 'text-red-500'}`}>
                        {t.tipo === 'entrada' ? '+' : '-'} R$ {t.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${t.status === 'pago' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                        {t.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'conciliacao' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Contas Bancárias e Conciliação</h2>
            <button onClick={() => setIsUploadModalOpen(true)} className="btn-primary flex items-center">
              <Upload className="w-4 h-4 mr-2" /> Importar Extrato (OFX/CSV)
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <h3 className="font-bold text-gray-900">Caixa Econômica</h3>
              <p className="text-sm text-gray-500 mb-4">Ag: 0001 • CC: 12345-6</p>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-black text-gray-900">R$ 8.420,00</span>
                <span className="text-xs text-green-500 bg-green-50 px-2 py-1 rounded-full flex items-center"><CheckCircle className="w-3 h-3 mr-1"/> Conciliada</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
              <h3 className="font-bold text-gray-900">Banco do Brasil</h3>
              <p className="text-sm text-gray-500 mb-4">Ag: 0002 • CC: 98765-4</p>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-black text-gray-900">R$ 5.100,50</span>
                <span className="text-xs text-orange-500 bg-orange-50 px-2 py-1 rounded-full flex items-center"><Clock className="w-3 h-3 mr-1"/> Desatualizada</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
              <h3 className="font-bold text-gray-900">Sicoob</h3>
              <p className="text-sm text-gray-500 mb-4">Ag: 4004 • CC: 1111-1</p>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-black text-gray-900">R$ 1.000,00</span>
                <span className="text-xs text-green-500 bg-green-50 px-2 py-1 rounded-full flex items-center"><CheckCircle className="w-3 h-3 mr-1"/> Conciliada</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'emendas' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Emendas Parlamentares</h2>
              <p className="text-sm text-gray-500">Controle de verbas governamentais e prestação de contas.</p>
            </div>
            <button className="btn-primary flex items-center">
              <Plus className="w-4 h-4 mr-2" /> Nova Emenda
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            {mockEmendas.map(e => (
              <div key={e.id} className="border border-gray-200 rounded-xl p-5 hover:border-icat-green transition-colors">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div>
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded mb-2">{e.numero}</span>
                    <h3 className="text-xl font-bold text-gray-900">{e.autor}</h3>
                    <p className="text-gray-500 text-sm">Finalidade: {e.finalidade}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-icat-green">R$ {e.valor.toLocaleString('pt-BR')}</p>
                    <span className={`inline-block px-2 py-1 mt-1 rounded-full text-xs font-semibold ${e.status === 'Recebida' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                      {e.status}
                    </span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100 flex gap-4">
                  <button className="text-sm font-medium text-icat-blue hover:underline flex items-center">
                    <List className="w-4 h-4 mr-1" /> Ver Despesas Vinculadas
                  </button>
                  <button className="text-sm font-medium text-purple-600 hover:underline flex items-center">
                    <FileText className="w-4 h-4 mr-1" /> Gerar Prestação de Contas
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'mensalidades' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex flex-wrap gap-4 justify-between items-center bg-gray-50">
            <div className="relative w-full sm:w-80">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Buscar aluno/beneficiário..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-icat-green outline-none" />
            </div>
            <button className="btn-secondary bg-white border border-gray-200 flex items-center text-gray-700">
              <CheckCircle className="w-4 h-4 mr-2" /> Gerar Relatório de Inadimplência
            </button>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-500 uppercase bg-white">
                <th className="p-4 font-semibold">Aluno</th>
                <th className="p-4 font-semibold">Turma / Plano</th>
                <th className="p-4 font-semibold">Valor da Mensalidade</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-right">Próx. Vencimento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockAlunos.map(a => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500"><User className="w-4 h-4"/></div>
                      <span className="font-medium text-gray-900">{a.nome}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{a.turma}</td>
                  <td className="p-4 text-sm font-medium">R$ {a.valor.toFixed(2)}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      a.status === 'Em dia' ? 'bg-green-50 text-green-600' : 
                      a.status === 'Atrasado' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="p-4 text-right text-sm text-gray-500">{a.proxVencimento}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Importar Extrato */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsUploadModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Importar Extrato Bancário</h2>
            <p className="text-gray-500 text-sm mb-6">Selecione a conta e faça upload do arquivo OFX ou CSV do banco para alimentar o sistema automaticamente.</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conta de Destino</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none">
                  <option>Caixa Econômica (Ag: 0001)</option>
                  <option>Banco do Brasil (Ag: 0002)</option>
                  <option>Sicoob (Ag: 4004)</option>
                </select>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
                <FileUp className="w-10 h-10 text-icat-green mb-3" />
                <p className="font-medium text-gray-900 mb-1">Clique para enviar ou arraste o arquivo</p>
                <p className="text-xs text-gray-500">Formatos suportados: .ofx, .csv (Máx. 5MB)</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button onClick={() => setIsUploadModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium">Cancelar</button>
              <button onClick={() => setIsUploadModalOpen(false)} className="btn-primary">Processar Arquivo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
