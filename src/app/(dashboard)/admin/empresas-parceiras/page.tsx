'use client';
import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Building, ImageIcon } from 'lucide-react';

export default function ParceirosAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  const [parceiros, setParceiros] = useState([
    { id: 1, name: 'Sicoob Credi', status: 'Ativo', desc: 'Apoiador principal do projeto esportivo.' },
    { id: 2, name: 'Supermercado Bretas', status: 'Ativo', desc: 'Fornecedor de doações mensais de cestas básicas.' },
  ]);

  const [formData, setFormData] = useState({ name: '', desc: '' });

  const handleOpenModal = (mode: 'create' | 'edit') => {
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name) return;
    const newParceiro = {
      id: Date.now(),
      name: formData.name,
      desc: formData.desc || '',
      status: 'Ativo'
    };
    setParceiros([newParceiro, ...parceiros]);
    setFormData({ name: '', desc: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Empresas Parceiras</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie os patrocinadores oficiais do ICAT.</p>
        </div>
        <button onClick={() => handleOpenModal('create')} className="btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Nova Empresa
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="relative w-72">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar empresa..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-icat-green outline-none"
            />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-gray-500 uppercase bg-white">
              <th className="p-4 font-semibold">Nome da Empresa</th>
              <th className="p-4 font-semibold">Tipo de Apoio</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {parceiros.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Building className="w-5 h-5 text-gray-400" />
                  </div>
                  {p.name}
                </td>
                <td className="p-4 text-gray-600 truncate max-w-[200px]">{p.desc}</td>
                <td className="p-4">
                  <span className="bg-green-50 text-icat-green px-2 py-1 rounded-full text-xs font-semibold">{p.status}</span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleOpenModal('edit')} className="p-2 text-gray-400 hover:text-icat-blue transition-colors rounded-lg hover:bg-blue-50">
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
              <h2 className="text-xl font-bold text-gray-900">
                {modalMode === 'create' ? 'Cadastrar Empresa Parceira' : 'Editar Empresa Parceira'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-32 h-32 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 hover:border-icat-green transition-all">
                  <ImageIcon className="w-8 h-8 mb-2" />
                  <span className="text-xs text-center px-2">Logomarca<br/>(Quadrada)</span>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="Razão Social ou Nome Fantasia" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Link do Site / Instagram</label>
                    <input type="url" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="https://" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resumo do Apoio (Exibido no site)</label>
                <textarea rows={3} value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="Apoiador oficial do projeto X..."></textarea>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-gray-600 hover:text-gray-900 transition-colors">Cancelar</button>
              <button onClick={handleSave} className="btn-primary">Salvar Empresa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
