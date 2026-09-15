'use client';
import { useState, useRef, useCallback } from 'react';
import { Plus, Search, Edit2, Trash2, Link as LinkIcon, CheckCircle, X, Camera, User } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Webcam from 'react-webcam';

export default function AlunosAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [alunos, setAlunos] = useState([
    { id: 7001, name: 'Pedro Henrique', course: 'Escolinha de Futebol', age: 12, status: 'Matriculado', whatsapp: '(64) 99900-1111', responsavel: 'Maria Henrique', foto: '' },
    { id: 7002, name: 'Ana Clara', course: 'Ballet Infantil', age: 8, status: 'Pendente', whatsapp: '(64) 99900-2222', responsavel: 'Carlos Clara', foto: '' },
    { id: 7003, name: 'Lucas Santos', course: 'Informática Básica', age: 15, status: 'Matriculado', whatsapp: '(64) 99900-3333', responsavel: 'João Santos', foto: '' },
  ]);

  const [formData, setFormData] = useState({ name: '', course: '', age: '', whatsapp: '', responsavel: '' });
  const [editData, setEditData] = useState({ id: 0, name: '', course: '', age: '', status: '', whatsapp: '', responsavel: '' });
  const [isCarteirinhaOpen, setIsCarteirinhaOpen] = useState(false);
  const [selectedAlunoId, setSelectedAlunoId] = useState<number | null>(null);
  const [carteirinhaBg, setCarteirinhaBg] = useState<string>('');
  
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc && selectedAlunoId) {
      setAlunos(alunos.map(a => a.id === selectedAlunoId ? {...a, foto: imageSrc} : a));
      setIsWebcamOpen(false);
    }
  }, [webcamRef, selectedAlunoId, alunos]);

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
      {isCarteirinhaOpen && selectedAlunoId && (() => {
        const aluno = alunos.find(b => b.id === selectedAlunoId);
        if(!aluno) return null;

        return (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsCarteirinhaOpen(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[800px]">
              
              {/* Lado Esquerdo: Configurações e WebCam */}
              <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Emissão de Carteirinha (PVC)</h2>
                  <button onClick={() => setIsCarteirinhaOpen(false)} className="text-gray-400 hover:text-gray-600 md:hidden"><X className="w-6 h-6" /></button>
                </div>
                
                <p className="text-sm text-gray-600 mb-6">O layout foi ajustado para a dimensão padrão de Cartões PVC (CR80 - 54x86mm). Use uma impressora térmica para imprimir.</p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">1. Capturar ou Enviar Foto</label>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = (e: any) => {
                            const file = e.target.files?.[0];
                            if(file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                setAlunos(alunos.map(a => a.id === selectedAlunoId ? {...a, foto: ev.target?.result as string} : a));
                              };
                              reader.readAsDataURL(file);
                            }
                          };
                          input.click();
                        }}
                        className="flex-1 bg-white border border-gray-300 rounded-lg py-2 flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors"
                      >
                        <svg className="w-5 h-5 text-icat-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                        <span className="text-xs font-semibold text-gray-600">Fazer Upload</span>
                      </button>
                      <button 
                        onClick={() => setIsWebcamOpen(true)}
                        className="flex-1 bg-white border border-gray-300 rounded-lg py-2 flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors"
                      >
                        <Camera className="w-5 h-5 text-icat-green" />
                        <span className="text-xs font-semibold text-gray-600">Usar Webcam</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">2. Imagem de Fundo (Opcional)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => setCarteirinhaBg(ev.target?.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <button 
                      onClick={() => {
                        const printContent = document.getElementById('carteirinha-print-area');
                        if (printContent) {
                          const originalContents = document.body.innerHTML;
                          document.body.innerHTML = printContent.innerHTML;
                          window.print();
                          window.location.reload();
                        }
                      }}
                      className="w-full btn-primary py-3 flex justify-center items-center gap-2 text-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                      Imprimir Cartão
                    </button>
                  </div>
                </div>
              </div>

              {/* Lado Direito: Preview */}
              <div className="w-full md:w-1/2 p-6 flex flex-col items-center justify-center bg-gray-200 relative">
                <button onClick={() => setIsCarteirinhaOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 hidden md:block">
                  <X className="w-6 h-6" />
                </button>
                
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Preview em Tempo Real</p>
                
                <div id="carteirinha-print-area" className="flex justify-center items-center">
                  {/* Cartão PVC (Proporção CR80) */}
                  <div 
                    className="relative bg-white shadow-2xl overflow-hidden print:shadow-none print:m-0"
                    style={{
                      width: '54mm',
                      height: '86mm',
                      backgroundImage: carteirinhaBg ? `url(${carteirinhaBg})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {/* Elementos Decorativos da Marca */}
                    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-icat-blue to-icat-green rounded-b-[40%] shadow-inner"></div>

                    {/* Foto */}
                    <div className="relative z-10 pt-10 flex flex-col items-center">
                      <div className="w-[30mm] h-[30mm] rounded-full bg-gray-100 border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
                        {(aluno as any).foto ? (
                          <img src={(aluno as any).foto} alt="Foto" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-12 h-12 text-gray-300" />
                        )}
                      </div>
                      
                      <div className="w-full px-4 text-center mt-3">
                        <h2 className="font-black text-sm text-gray-900 leading-tight uppercase line-clamp-2">{aluno.name}</h2>
                        <span className="inline-block bg-icat-yellow text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full mt-1">ALUNO(A)</span>
                      </div>

                      <div className="w-full px-4 text-center mt-3 space-y-0.5">
                        <p className="text-[10px] text-gray-800"><span className="font-bold">Matrícula:</span> ICAT-{aluno.id}</p>
                        <p className="text-[10px] text-gray-800"><span className="font-bold">Nasc:</span> {aluno.age} anos</p>
                        <p className="text-[10px] text-gray-800 font-medium truncate">{aluno.course}</p>
                      </div>
                    </div>

                    {/* QR Code no Rodapé */}
                    <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center">
                      <div className="bg-white p-1 rounded border border-gray-200">
                        <QRCodeSVG value={`icat-access-${aluno.id}`} size={48} level="M" />
                      </div>
                      <p className="text-[8px] text-gray-400 mt-1 uppercase font-bold">Válido até 12/2026</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL WEBCAM */}
      {isWebcamOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-gray-900/90 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-gray-900">Tirar Foto</h2>
              <button onClick={() => setIsWebcamOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            </div>
            <div className="bg-black relative flex justify-center items-center aspect-video">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "user" }}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 bg-gray-50 flex justify-center border-t border-gray-200">
              <button 
                onClick={capture}
                className="w-16 h-16 bg-white border-4 border-gray-300 rounded-full shadow-md flex items-center justify-center hover:border-icat-blue transition-colors focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                <div className="w-12 h-12 bg-icat-blue rounded-full"></div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
