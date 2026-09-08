'use client';
import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';

export default function CursosAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estado interativo para a lista
  const [cursos, setCursos] = useState([
    { id: 1, title: 'Ballet Infantil', cost: 0, vacancies: 30, status: 'Ativo' },
    { id: 2, title: 'Escolinha de Futebol', cost: 50, vacancies: 45, status: 'Ativo' },
  ]);

  // Estado do formulário
  const [formData, setFormData] = useState({ title: '', cost: '', vacancies: '' });

  const handleSave = () => {
    if (!formData.title) return;
    
    const newCourse = {
      id: Date.now(),
      title: formData.title,
      cost: Number(formData.cost) || 0,
      vacancies: Number(formData.vacancies) || 0,
      status: 'Ativo'
    };

    setCursos([newCourse, ...cursos]);
    setFormData({ title: '', cost: '', vacancies: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Cursos</h1>
          <p className="text-gray-500 text-sm mt-1">Cadastre e gerencie as atividades oferecidas pelo ICAT.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Curso
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="relative w-72">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar curso..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-icat-green outline-none"
            />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-gray-500 uppercase bg-white">
              <th className="p-4 font-semibold">Nome do Curso</th>
              <th className="p-4 font-semibold">Custo</th>
              <th className="p-4 font-semibold">Vagas</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {cursos.map(c => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900">{c.title}</td>
                <td className="p-4 text-gray-600">
                  {c.cost === 0 ? <span className="text-icat-green font-bold bg-green-50 px-2 py-1 rounded-md">Gratuito</span> : `R$ ${c.cost.toFixed(2)}`}
                </td>
                <td className="p-4 text-gray-600">{c.vacancies}</td>
                <td className="p-4">
                  <span className="bg-blue-50 text-icat-blue px-2 py-1 rounded-full text-xs font-semibold">{c.status}</span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => setIsModalOpen(true)} className="p-2 text-gray-400 hover:text-icat-blue transition-colors rounded-lg hover:bg-blue-50">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50" onClick={() => setCursos(cursos.filter(x => x.id !== c.id))}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DE CADASTRO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Cadastrar Novo Curso</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              
              <div className="flex gap-4 items-start">
                <div className="w-40 h-40 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 hover:border-icat-green transition-all">
                  <ImageIcon className="w-8 h-8 mb-2" />
                  <span className="text-xs text-center px-2">Capa do Curso<br/>(800x600px)</span>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Curso / Modalidade</label>
                    <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="Ex: Informática Básica" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Público Alvo (Faixa Etária)</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="Ex: 12 a 17 anos" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Completa</label>
                <textarea rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="Detalhes sobre o que será ensinado..."></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade de Vagas</label>
                  <input type="number" value={formData.vacancies} onChange={e => setFormData({...formData, vacancies: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="Ex: 30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Custo (R$)</label>
                  <div className="relative">
                    <input type="number" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="0 para gratuito" />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Deixe 0 para exibir como &quot;Gratuito&quot;</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Professor Responsável</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none">
                  <option value="">Selecione um professor...</option>
                  <option>Carlos Silva</option>
                  <option>Amanda Oliveira</option>
                  <option>João Pedro</option>
                </select>
              </div>

            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-gray-600 hover:text-gray-900 transition-colors">Cancelar</button>
              <button onClick={handleSave} className="btn-primary">Salvar Curso e Publicar no Site</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
