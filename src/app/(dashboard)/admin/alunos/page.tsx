'use client';
import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, GraduationCap, Link as LinkIcon, CheckCircle } from 'lucide-react';

export default function AlunosAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [alunos, setAlunos] = useState([
    { id: 1, name: 'Pedro Henrique', course: 'Escolinha de Futebol', age: 12, status: 'Matriculado' },
    { id: 2, name: 'Ana Clara', course: 'Ballet Infantil', age: 8, status: 'Pendente' },
  ]);

  const [formData, setFormData] = useState({ name: '', course: '', age: '' });

  const handleCopyLink = () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/cadastro/aluno` : 'https://icat.org.br/cadastro/aluno';
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!formData.name) return;
    const newAluno = {
      id: Date.now(),
      name: formData.name,
      course: formData.course || 'Sem Curso',
      age: Number(formData.age) || 0,
      status: 'Matriculado'
    };
    setAlunos([newAluno, ...alunos]);
    setFormData({ name: '', course: '', age: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alunos e Matrículas</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie os alunos matriculados nos cursos e turmas.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleCopyLink}
            className="btn-secondary flex items-center bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            {copied ? <CheckCircle className="w-5 h-5 mr-2 text-green-500" /> : <LinkIcon className="w-5 h-5 mr-2 text-icat-blue" />}
            {copied ? 'Link Copiado!' : 'Link de Matrícula'}
          </button>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Novo Aluno
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="relative w-72">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar aluno..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-icat-green outline-none"
            />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-gray-500 uppercase bg-white">
              <th className="p-4 font-semibold">Nome do Aluno</th>
              <th className="p-4 font-semibold">Curso / Turma</th>
              <th className="p-4 font-semibold">Idade</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {alunos.map(a => (
              <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-gray-400" /> {a.name}
                </td>
                <td className="p-4 text-gray-600">{a.course}</td>
                <td className="p-4 text-gray-600">{a.age} anos</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${a.status === 'Matriculado' ? 'bg-green-50 text-icat-green' : 'bg-orange-50 text-orange-600'}`}>
                    {a.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => setIsModalOpen(true)} className="p-2 text-gray-400 hover:text-icat-blue transition-colors rounded-lg hover:bg-blue-50">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50" onClick={() => setAlunos(alunos.filter(x => x.id !== a.id))}>
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
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Cadastrar Aluno</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo do Aluno</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
                  <input type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
                  <select value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none">
                    <option value="">Selecione...</option>
                    <option value="Escolinha de Futebol">Escolinha de Futebol</option>
                    <option value="Ballet Infantil">Ballet Infantil</option>
                    <option value="Informática Básica">Informática Básica</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-gray-600 hover:text-gray-900 transition-colors">Cancelar</button>
              <button onClick={handleSave} className="btn-primary">Matricular Aluno</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
