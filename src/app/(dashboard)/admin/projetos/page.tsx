'use client';
import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Folder } from 'lucide-react';

export default function ProjetosAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [projetos, setProjetos] = useState([
    { id: 1, title: 'Atleta do Futuro', area: 'Esporte', status: 'Ativo' },
    { id: 2, title: 'Cesta Solidária', area: 'Assistência Social', status: 'Ativo' },
  ]);

  const [formData, setFormData] = useState({ title: '', area: '', desc: '' });

  const handleSave = () => {
    if (!formData.title) return;
    const newProj = {
      id: Date.now(),
      title: formData.title,
      area: formData.area || 'Geral',
      status: 'Ativo'
    };
    setProjetos([newProj, ...projetos]);
    setFormData({ title: '', area: '', desc: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Projetos</h1>
          <p className="text-gray-500 text-sm mt-1">Crie e gerencie os grandes projetos do ICAT.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Novo Projeto
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="relative w-72">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar projeto..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-icat-green outline-none"
            />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-gray-500 uppercase bg-white">
              <th className="p-4 font-semibold">Nome do Projeto</th>
              <th className="p-4 font-semibold">Área de Atuação</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {projetos.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900 flex items-center gap-2">
                  <Folder className="w-5 h-5 text-gray-400" /> {p.title}
                </td>
                <td className="p-4 text-gray-600">{p.area}</td>
                <td className="p-4">
                  <span className="bg-green-50 text-icat-green px-2 py-1 rounded-full text-xs font-semibold">{p.status}</span>
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
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Cadastrar Projeto</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Projeto</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="Ex: Cesta Solidária" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Área de Atuação</label>
                <select value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none">
                  <option value="">Selecione...</option>
                  <option value="Assistência Social">Assistência Social</option>
                  <option value="Educação e Formação">Educação e Formação</option>
                  <option value="Esporte e Inclusão">Esporte e Inclusão</option>
                  <option value="Cultura e Arte">Cultura e Arte</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea rows={3} value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="Detalhes do projeto..."></textarea>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-gray-600 hover:text-gray-900 transition-colors">Cancelar</button>
              <button onClick={handleSave} className="btn-primary">Salvar Projeto</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
