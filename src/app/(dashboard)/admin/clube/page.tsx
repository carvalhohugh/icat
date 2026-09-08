'use client';
import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, ImageIcon, Tag } from 'lucide-react';

export default function ClubeVantagensAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const vantagens = [
    { id: 1, company: 'Farmácia Preço Baixo', title: '15% de Desconto em Remédios', status: 'Ativo' },
    { id: 2, company: 'Supermercado Bretas', title: '5% de Desconto nas Compras', status: 'Ativo' },
  ];

  const handleSave = () => setIsModalOpen(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clube de Vantagens</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie os descontos e benefícios oferecidos pelas empresas parceiras.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Nova Promoção
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="relative w-72">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar vantagem..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-icat-green outline-none"
            />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-gray-500 uppercase bg-white">
              <th className="p-4 font-semibold">Empresa</th>
              <th className="p-4 font-semibold">Vantagem / Desconto</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {vantagens.map(v => (
              <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900">{v.company}</td>
                <td className="p-4 text-gray-600 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-icat-green" /> {v.title}
                </td>
                <td className="p-4">
                  <span className="bg-green-50 text-icat-green px-2 py-1 rounded-full text-xs font-semibold">{v.status}</span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => setIsModalOpen(true)} className="p-2 text-gray-400 hover:text-icat-blue transition-colors rounded-lg hover:bg-blue-50">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Cadastrar Vantagem no Clube</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              
              <div className="flex gap-4 items-start">
                <div className="w-40 h-40 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 hover:border-icat-green transition-all">
                  <ImageIcon className="w-8 h-8 mb-2" />
                  <span className="text-xs text-center px-2">Imagem da Promoção<br/>(16:9)</span>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Selecione a Empresa Parceira</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none">
                      <option value="">Selecione...</option>
                      <option value="1">Farmácia Preço Baixo</option>
                      <option value="2">Supermercado Bretas</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título do Desconto</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="Ex: 15% off em Medicamentos" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Regras e Descrição</label>
                <textarea rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="Válido apenas para alunos matriculados mediante apresentação da carteirinha..."></textarea>
              </div>

            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-gray-600 hover:text-gray-900 transition-colors">Cancelar</button>
              <button onClick={handleSave} className="btn-primary">Salvar Promoção</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
