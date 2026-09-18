'use client';
import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Image as ImageIcon, Clock, X, Wand2 } from 'lucide-react';

export default function CursosAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estado interativo para a lista
  const [cursos, setCursos] = useState([
    { id: 1, title: 'Inclusão Digital para Jovens e Adultos', cost: 0, vacancies: 30, status: 'Ativo' },
    { id: 2, title: 'Informática para Comunidades Rurais', cost: 0, vacancies: 25, status: 'Ativo' },
    { id: 3, title: 'Informática Kids / Educação Tecnológica', cost: 0, vacancies: 20, status: 'Ativo' },
    { id: 4, title: 'Laboratório de Robótica Maker', cost: 0, vacancies: 15, status: 'Ativo' },
    { id: 5, title: 'Escolinha de Vôlei', cost: 0, vacancies: 30, status: 'Ativo' },
    { id: 6, title: 'Escola de Futebol', cost: 0, vacancies: 45, status: 'Ativo' },
    { id: 7, title: 'Escola de Desenho e Pintura', cost: 0, vacancies: 20, status: 'Ativo' },
    { id: 8, title: 'Escola de Música - Violão', cost: 0, vacancies: 15, status: 'Ativo' },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('icat_cursos');
    if (saved) {
      setCursos(JSON.parse(saved));
    } else {
      localStorage.setItem('icat_cursos', JSON.stringify(cursos));
    }
  }, []);

  // Estado do formulário
  const [formData, setFormData] = useState({ title: '', cost: '', vacancies: '', desc: '' });
  const [horarios, setHorarios] = useState<{dia: string, inicio: string, fim: string}[]>([{ dia: 'Segunda', inicio: '14:00', fim: '16:00' }]);

  const handleSave = () => {
    if (!formData.title) return;
    
    const newCourse = {
      id: Date.now(),
      title: formData.title,
      cost: Number(formData.cost) || 0,
      vacancies: Number(formData.vacancies) || 0,
      status: 'Ativo'
    };

    const updated = [newCourse, ...cursos];
    setCursos(updated);
    localStorage.setItem('icat_cursos', JSON.stringify(updated));
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
              <tr 
                key={c.id} 
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => {
                  setFormData({ title: c.title, vacancies: c.vacancies.toString(), cost: c.cost.toString() });
                  setIsModalOpen(true);
                }}
              >
                <td className="p-4 font-medium text-gray-900">{c.title}</td>
                <td className="p-4 text-gray-600">
                  {c.cost === 0 ? <span className="text-icat-green font-bold bg-green-50 px-2 py-1 rounded-md">Gratuito</span> : `R$ ${c.cost.toFixed(2)}`}
                </td>
                <td className="p-4 text-gray-600">{c.vacancies}</td>
                <td className="p-4">
                  <span className="bg-blue-50 text-icat-blue px-2 py-1 rounded-full text-xs font-semibold">{c.status}</span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }} className="p-2 text-gray-400 hover:text-icat-blue transition-colors rounded-lg hover:bg-blue-50">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50" onClick={(e) => { e.stopPropagation(); setCursos(cursos.filter(x => x.id !== c.id)); }}>
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
                <div className="flex justify-between items-end mb-1">
                  <label className="block text-sm font-medium text-gray-700">Descrição Completa</label>
                  <button 
                    type="button"
                    onClick={async () => {
                      if(!formData.title) return alert('Digite o título primeiro para a IA entender o contexto.');
                      const btn = document.getElementById('btn-ai-curso');
                      if(btn) btn.innerHTML = 'Gerando...';
                      const { mockAiGenerator } = await import('@/lib/ai-generator');
                      const aiText = await mockAiGenerator.generateDescription(formData.title, 'curso');
                      setFormData({...formData, desc: aiText});
                      if(btn) btn.innerHTML = '<svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg> Gerar com IA';
                    }}
                    id="btn-ai-curso"
                    className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-800 transition-colors bg-indigo-50 px-2 py-1 rounded-md"
                  >
                    <Wand2 className="w-3 h-3" /> Gerar com IA
                  </button>
                </div>
                <textarea rows={3} value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="Detalhes sobre o que será ensinado..."></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Professor / Instrutor Responsável</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none">
                  <option value="">Selecione um professor cadastrado...</option>
                  <option value="prof1">João Carlos (Esportes)</option>
                  <option value="prof2">Maria Antonieta (Artes)</option>
                  <option value="prof3">Ricardo Silva (Informática)</option>
                </select>
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
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1"><Clock className="w-4 h-4" /> Dias e Horários das Aulas</label>
                <div className="space-y-2">
                  {horarios.map((h, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <select value={h.dia} onChange={e => { const n = [...horarios]; n[i].dia = e.target.value; setHorarios(n); }} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none text-sm">
                        <option>Segunda</option>
                        <option>Terça</option>
                        <option>Quarta</option>
                        <option>Quinta</option>
                        <option>Sexta</option>
                        <option>Sábado</option>
                      </select>
                      <input type="time" value={h.inicio} onChange={e => { const n = [...horarios]; n[i].inicio = e.target.value; setHorarios(n); }} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none text-sm w-28" />
                      <span className="text-gray-400 text-sm">às</span>
                      <input type="time" value={h.fim} onChange={e => { const n = [...horarios]; n[i].fim = e.target.value; setHorarios(n); }} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none text-sm w-28" />
                      {horarios.length > 1 && (
                        <button onClick={() => setHorarios(horarios.filter((_, j) => j !== i))} className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setHorarios([...horarios, { dia: 'Terça', inicio: '14:00', fim: '16:00' }])} 
                  className="mt-2 text-sm text-icat-green font-semibold flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-4 h-4" /> Adicionar outro dia
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Professor Responsável</label>
                <div className="flex items-center gap-2">
                  <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none">
                    <option value="">Selecione um professor...</option>
                    <option>Carlos Silva</option>
                    <option>Amanda Oliveira</option>
                    <option>João Pedro</option>
                  </select>
                  <button className="p-2 bg-gray-100 hover:bg-icat-green hover:text-white text-gray-600 rounded-lg transition-colors" title="Cadastrar novo professor" onClick={() => alert('Abrir modal de Novo Funcionário (Atalho)')}>
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
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
