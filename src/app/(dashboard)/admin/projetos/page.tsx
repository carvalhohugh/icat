'use client';
import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Folder, Wand2 } from 'lucide-react';

export default function ProjetosAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  type Projeto = { id: number; title: string; area: string; desc: string; status?: string };
  const [projetos, setProjetos] = useState<Projeto[]>([
    { id: 1, title: 'Aula de reforço para ensino fundamental', area: 'Educação e Formação', desc: 'Reforço escolar focado no ensino fundamental para alunos da rede pública.', status: 'Ativo' },
    { id: 2, title: 'ENEM EM FOCO (Ensino médio / UF)', area: 'Educação e Formação', desc: 'Aulas preparatórias intensivas para o ENEM e vestibulares de universidades federais.', status: 'Ativo' },
    { id: 4, title: 'Atleta do Futuro', area: 'Esporte e Inclusão', desc: 'Escolinha de esportes focado em crianças e adolescentes, promovendo disciplina, trabalho em equipe e saúde física, além de tirá-los das ruas no contraturno escolar.', status: 'Ativo' },
    { id: 5, title: 'Cesta Solidária', area: 'Assistência Social', desc: 'Entrega mensal de cestas básicas para famílias em situação de extrema vulnerabilidade, cadastradas e acompanhadas por nossa equipe de assistência social.', status: 'Ativo' },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('icat_projetos');
    if (saved) {
      setProjetos(JSON.parse(saved));
    } else {
      localStorage.setItem('icat_projetos', JSON.stringify(projetos));
    }
  }, []);

  const [formData, setFormData] = useState({ title: '', area: '', desc: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSave = () => {
    if (!formData.title) return;
    
    let updated;
    if (editingId) {
      updated = projetos.map(p => p.id === editingId ? { ...p, title: formData.title, area: formData.area || 'Geral', desc: formData.desc || 'Descrição do projeto.' } : p);
    } else {
      const newProj = {
        id: Date.now(),
        title: formData.title,
        area: formData.area || 'Geral',
        desc: formData.desc || 'Descrição do projeto.',
        status: 'Ativo'
      };
      updated = [newProj, ...projetos];
    }
    
    setProjetos(updated);
    localStorage.setItem('icat_projetos', JSON.stringify(updated));
    setFormData({ title: '', area: '', desc: '' });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleOpenEdit = (p: any) => {
    setFormData({ title: p.title, area: p.area, desc: p.desc || '' });
    setEditingId(p.id);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Projetos</h1>
          <p className="text-gray-500 text-sm mt-1">Crie e gerencie os grandes projetos do ICAT.</p>
        </div>
        <button onClick={() => {
          setEditingId(null);
          setFormData({ title: '', area: '', desc: '' });
          setIsModalOpen(true);
        }} className="btn-primary flex items-center">
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
              <th className="p-4 font-semibold text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {projetos.map(p => (
              <tr key={p.id} className={`hover:bg-gray-50 transition-colors ${p.status === 'Suspenso' ? 'opacity-60' : ''}`}>
                <td className="p-4 font-medium text-gray-900 flex items-center gap-2">
                  <Folder className="w-5 h-5 text-gray-400" /> {p.title}
                </td>
                <td className="p-4 text-gray-600">{p.area}</td>
                <td className="p-4">
                  <span className={`${p.status === 'Ativo' ? 'bg-green-50 text-icat-green' : 'bg-red-50 text-red-600'} px-2 py-1 rounded-full text-xs font-semibold`}>{p.status}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center space-x-2">
                    {p.status === 'Ativo' ? (
                      <button onClick={() => setProjetos(projetos.map(x => x.id === p.id ? { ...x, status: 'Suspenso' } : x))} className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50" title="Suspender">
                        <span className="text-xs font-bold mr-1">Suspender</span>
                      </button>
                    ) : (
                      <button onClick={() => setProjetos(projetos.map(x => x.id === p.id ? { ...x, status: 'Ativo' } : x))} className="p-2 text-gray-400 hover:text-icat-green transition-colors rounded-lg hover:bg-green-50" title="Ativar">
                        <span className="text-xs font-bold mr-1">Ativar</span>
                      </button>
                    )}
                    <a href={`/cadastro/aluno?curso=${p.id}`} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-icat-green transition-colors rounded-lg hover:bg-green-50 inline-block" title="Link de Inscrição">
                      <span className="text-xs font-bold">Link Inscrição</span>
                    </a>
                    <button onClick={() => handleOpenEdit(p)} className="p-2 text-gray-400 hover:text-icat-blue transition-colors rounded-lg hover:bg-blue-50">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setProjetos(projetos.filter(x => x.id !== p.id))} className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
              <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Editar Projeto' : 'Cadastrar Projeto'}</h2>
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
                <div className="flex justify-between items-end mb-1">
                  <label className="block text-sm font-medium text-gray-700">Descrição</label>
                  <button 
                    type="button"
                    onClick={async () => {
                      if(!formData.title) return alert('Digite o título primeiro para a IA entender o contexto.');
                      const btn = document.getElementById('btn-ai-proj');
                      if(btn) btn.innerHTML = 'Gerando...';
                      const { mockAiGenerator } = await import('@/lib/ai-generator');
                      const aiText = await mockAiGenerator.generateDescription(formData.title, 'projeto');
                      setFormData({...formData, desc: aiText});
                      if(btn) btn.innerHTML = '<svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg> Gerar com IA';
                    }}
                    id="btn-ai-proj"
                    className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-800 transition-colors bg-indigo-50 px-2 py-1 rounded-md"
                  >
                    <Wand2 className="w-3 h-3" /> Gerar com IA
                  </button>
                </div>
                <textarea rows={3} value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="Detalhes do projeto..."></textarea>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="allowEnroll" className="w-4 h-4 text-icat-green border-gray-300 rounded focus:ring-icat-green" defaultChecked />
                <label htmlFor="allowEnroll" className="text-sm font-medium text-gray-700">Permitir inscrições online via form de cadastro</label>
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
