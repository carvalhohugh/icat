'use client';
import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Link as LinkIcon, CheckCircle, X, Camera } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function AlunosAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [alunos, setAlunos] = useState([
    { id: 7001, name: 'Pedro Henrique', course: 'Escolinha de Futebol', age: 12, status: 'Matriculado', whatsapp: '(64) 99900-1111', responsavel: 'Maria Henrique' },
    { id: 7002, name: 'Ana Clara', course: 'Ballet Infantil', age: 8, status: 'Pendente', whatsapp: '(64) 99900-2222', responsavel: 'Carlos Clara' },
    { id: 7003, name: 'Lucas Santos', course: 'Informática Básica', age: 15, status: 'Matriculado', whatsapp: '(64) 99900-3333', responsavel: 'João Santos' },
  ]);

  const [formData, setFormData] = useState({ name: '', course: '', age: '', whatsapp: '', responsavel: '' });
  const [editData, setEditData] = useState({ id: 0, name: '', course: '', age: '', status: '', whatsapp: '', responsavel: '' });
  const [isCarteirinhaOpen, setIsCarteirinhaOpen] = useState(false);
  const [selectedAlunoId, setSelectedAlunoId] = useState<number | null>(null);
  const [carteirinhaBg, setCarteirinhaBg] = useState<string>('');

  const handleCopyLink = () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/cadastro/aluno` : 'https://icat.org.br/cadastro/aluno';
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!formData.name) return;
    const nextId = alunos.length > 0 ? Math.max(...alunos.map(a => a.id)) + 1 : 7001;
    const newAluno = {
      id: nextId, name: formData.name, course: formData.course || 'Sem Curso',
      age: Number(formData.age) || 0, status: 'Matriculado', whatsapp: formData.whatsapp || '', responsavel: formData.responsavel || ''
    };
    setAlunos([newAluno, ...alunos]);
    setFormData({ name: '', course: '', age: '', whatsapp: '', responsavel: '' });
    setIsModalOpen(false);
  };

  const openProfile = (a: typeof alunos[0]) => {
    setEditData({ id: a.id, name: a.name, course: a.course, age: a.age.toString(), status: a.status, whatsapp: a.whatsapp, responsavel: a.responsavel });
    setIsProfileOpen(true);
  };

  const saveProfile = () => {
    setAlunos(alunos.map(a => a.id === editData.id ? { ...a, name: editData.name, course: editData.course, age: Number(editData.age), status: editData.status, whatsapp: editData.whatsapp, responsavel: editData.responsavel } : a));
    setIsProfileOpen(false);
  };

  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);
  const [filtroTurma, setFiltroTurma] = useState('');
  const [filtroCurso, setFiltroCurso] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alunos e Matrículas</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie os alunos matriculados nos cursos e turmas.</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => setIsPendingModalOpen(true)} className="btn-secondary flex items-center bg-white border border-orange-200 text-orange-600 hover:bg-orange-50">
             <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
             Matrículas Pendentes ({alunos.filter(a => a.status === 'Pendente').length})
          </button>
          <button 
            onClick={handleCopyLink}
            className="btn-secondary flex items-center bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            {copied ? <CheckCircle className="w-5 h-5 mr-2 text-green-500" /> : <LinkIcon className="w-5 h-5 mr-2 text-icat-blue" />}
            {copied ? 'Link Copiado!' : 'Link de Cadastro Externo'}
          </button>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Nova Matrícula
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 bg-gray-50">
          <div className="relative w-full md:w-72">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Buscar aluno..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-icat-green outline-none" />
          </div>
          <select value={filtroCurso} onChange={e => setFiltroCurso(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-icat-green outline-none text-sm">
            <option value="">Todos os Cursos / Turmas</option>
            <option value="Escolinha de Futebol">Escolinha de Futebol</option>
            <option value="Ballet Infantil">Ballet Infantil</option>
            <option value="Informática Básica">Informática Básica</option>
          </select>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-gray-500 uppercase bg-white">
              <th className="p-4 font-semibold text-center">ID</th>
              <th className="p-4 font-semibold text-center">Nome do Aluno</th>
              <th className="p-4 font-semibold text-center">Curso / Turma</th>
              <th className="p-4 font-semibold text-center">Idade</th>
              <th className="p-4 font-semibold text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {alunos.filter(a => a.status === 'Matriculado' && (!filtroCurso || a.course === filtroCurso)).map((a, idx) => (
              <tr 
                key={a.id} 
                className={`transition-colors cursor-pointer ${idx % 2 === 0 ? 'bg-white hover:bg-blue-50/50' : 'bg-blue-50/40 hover:bg-blue-50/70'}`}
                onClick={() => openProfile(a)}
              >
                <td className="p-4 text-gray-600 font-bold text-xs text-center">#{a.id}</td>
                <td className="p-4 font-medium text-gray-900">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-icat-blue to-icat-green text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      {a.name.charAt(0)}
                    </div>
                    <div>
                      <span className="block">{a.name}</span>
                      <span className="text-xs text-gray-400">{a.responsavel}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-gray-600 text-sm text-center">{a.course}</td>
                <td className="p-4 text-gray-600 text-sm text-center">{a.age} anos</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={(e) => { e.stopPropagation(); setSelectedAlunoId(a.id); setIsCarteirinhaOpen(true); }} className="p-2 text-gray-400 hover:text-icat-blue transition-colors rounded-lg hover:bg-blue-50" title="Gerar Carteirinha">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-id-card"><path d="M16 10h2"/><path d="M16 14h2"/><path d="M6.17 15a3 3 0 0 1 5.66 0"/><circle cx="9" cy="11" r="2"/><rect x="2" y="5" width="20" height="14" rx="2"/></svg>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); openProfile(a); }} className="p-2 text-gray-400 hover:text-icat-blue transition-colors rounded-lg hover:bg-blue-50">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50" onClick={(e) => { e.stopPropagation(); setAlunos(alunos.filter(x => x.id !== a.id)); }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Novo Aluno */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Cadastrar Aluno</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-24 h-24 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 hover:border-icat-green transition-all relative overflow-hidden group">
                  <Camera className="w-6 h-6 mb-1 text-gray-400 group-hover:text-icat-green" />
                  <span className="text-[10px] font-semibold text-center leading-tight">Adicionar<br/>Foto</span>
                  <input type="file" accept="image/*" capture="user" className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo do Aluno</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                </div>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
                <input type="text" value={formData.responsavel} onChange={e => setFormData({...formData, responsavel: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="Nome do pai/mãe/responsável" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                <input type="text" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="(64) 99000-0000" />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-gray-600 hover:text-gray-900 transition-colors">Cancelar</button>
              <button onClick={handleSave} className="btn-primary">Matricular Aluno</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Perfil do Aluno (Edição) */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsProfileOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-icat-blue to-icat-green text-white flex items-center justify-center font-bold text-xl shadow-sm relative group cursor-pointer overflow-hidden">
                  <span>{editData.name.charAt(0)}</span>
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <input type="file" accept="image/*" capture="user" className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Perfil do Aluno</h2>
                  <p className="text-sm text-gray-500">Editar dados e foto</p>
                </div>
              </div>
              <button onClick={() => setIsProfileOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input type="text" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
                  <input type="number" value={editData.age} onChange={e => setEditData({...editData, age: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={editData.status} onChange={e => setEditData({...editData, status: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none">
                    <option value="Matriculado">Matriculado</option>
                    <option value="Pendente">Pendente</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Curso / Turma</label>
                <select value={editData.course} onChange={e => setEditData({...editData, course: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none">
                  <option value="Escolinha de Futebol">Escolinha de Futebol</option>
                  <option value="Ballet Infantil">Ballet Infantil</option>
                  <option value="Informática Básica">Informática Básica</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
                <input type="text" value={editData.responsavel} onChange={e => setEditData({...editData, responsavel: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                <input type="text" value={editData.whatsapp} onChange={e => setEditData({...editData, whatsapp: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
              <button onClick={() => setIsProfileOpen(false)} className="px-4 py-2 font-medium text-gray-600 hover:text-gray-900 transition-colors">Cancelar</button>
              <button onClick={saveProfile} className="btn-primary">Salvar Alterações</button>
            </div>
          </div>
        </div>
      )}
      {/* Modal Matrículas Pendentes */}
      {isPendingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsPendingModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Matrículas Pendentes</h2>
              <button onClick={() => setIsPendingModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-4 border-b border-gray-100 flex gap-4 bg-white">
              <select value={filtroCurso} onChange={(e) => setFiltroCurso(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none text-sm">
                <option value="">Todos os Cursos</option>
                <option value="Escolinha de Futebol">Escolinha de Futebol</option>
                <option value="Ballet Infantil">Ballet Infantil</option>
                <option value="Informática Básica">Informática Básica</option>
              </select>
              <select value={filtroTurma} onChange={(e) => setFiltroTurma(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none text-sm">
                <option value="">Todas as Turmas</option>
                <option value="Turma A">Turma A</option>
                <option value="Turma B">Turma B</option>
              </select>
            </div>

            <div className="overflow-y-auto p-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase bg-gray-50">
                    <th className="p-4 font-semibold">Aluno</th>
                    <th className="p-4 font-semibold">Idade</th>
                    <th className="p-4 font-semibold">Curso Selecionado</th>
                    <th className="p-4 font-semibold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {alunos.filter(a => a.status === 'Pendente').map(a => (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">
                        {a.name} <br/> <span className="text-xs text-gray-400 font-normal">{a.responsavel} - {a.whatsapp}</span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{a.age} anos</td>
                      <td className="p-4 text-sm text-gray-600">{a.course}</td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => setAlunos(alunos.map(x => x.id === a.id ? {...x, status: 'Matriculado'} : x))} className="px-3 py-1 bg-green-50 text-icat-green hover:bg-green-100 rounded-md text-xs font-bold transition-colors">Aprovar</button>
                        <button onClick={() => setAlunos(alunos.filter(x => x.id !== a.id))} className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-xs font-bold transition-colors">Rejeitar</button>
                      </td>
                    </tr>
                  ))}
                  {alunos.filter(a => a.status === 'Pendente').length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-500 text-sm">Nenhuma matrícula pendente no momento.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* MODAL DE CARTEIRINHA */}
      {isCarteirinhaOpen && selectedAlunoId && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsCarteirinhaOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Gerar Carteirinha do Aluno</h2>
              <button onClick={() => setIsCarteirinhaOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagem de Fundo (Opcional)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => setCarteirinhaBg(e.target?.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {/* Preview da Carteirinha */}
              <div className="flex justify-center bg-gray-100 p-4 rounded-xl">
                <div 
                  id="carteirinha-card"
                  className="relative w-80 h-48 rounded-xl shadow-lg overflow-hidden flex flex-col border border-gray-200 bg-white"
                  style={{
                    backgroundImage: carteirinhaBg ? `url(${carteirinhaBg})` : 'linear-gradient(to right bottom, #f8fafc, #e2e8f0)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {carteirinhaBg && <div className="absolute inset-0 bg-white/60"></div>}
                  <div className="relative z-10 flex flex-col h-full p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <img src="/logo.png" alt="ICAT" className="h-8 w-auto mb-2" />
                        <h3 className="font-bold text-gray-900 text-sm leading-tight max-w-[140px]">
                          {alunos.find(b => b.id === selectedAlunoId)?.name}
                        </h3>
                        <p className="text-xs text-gray-700 font-medium mt-1">ID: ICAT-{selectedAlunoId.toString().padStart(4, '0')}</p>
                      </div>
                      <div className="bg-white p-1 rounded-lg shadow-sm">
                        <QRCodeSVG 
                          value={`icat-access-${selectedAlunoId}`}
                          size={64}
                          level="M"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-auto flex justify-between items-end">
                      <span className="text-[10px] font-bold text-icat-green px-2 py-1 bg-green-50 rounded border border-green-100">
                        ALUNO MATRICULADO
                      </span>
                      <span className="text-[10px] text-gray-600 font-medium">Válido até 12/2026</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setIsCarteirinhaOpen(false)} className="px-4 py-2 font-medium text-gray-600 hover:text-gray-900 text-sm">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
