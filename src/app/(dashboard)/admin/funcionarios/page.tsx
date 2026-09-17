'use client';
import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Briefcase, Link as LinkIcon, CheckCircle, Camera, User, Download, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function FuncionariosAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCrachaOpen, setIsCrachaOpen] = useState(false);
  const [selectedFuncId, setSelectedFuncId] = useState<number | null>(null);
  const [crachaBg, setCrachaBg] = useState<string>('');
  const [copied, setCopied] = useState(false);
  
  const [funcionarios, setFuncionarios] = useState([
    { id: 1, name: 'Carlos Silva', role: 'Professor', department: 'Esportes', perfil: 'Professor', status: 'Ativo', foto: '' },
    { id: 2, name: 'Amanda Oliveira', role: 'Assistente Social', department: 'Assistência', perfil: 'Administrativo', status: 'Ativo', foto: '' },
  ]);

  const [formData, setFormData] = useState({ name: '', role: '', department: '', perfil: '', cpf: '', whatsapp: '', address: '', foto: '' });

  const handleCopyLink = () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/cadastro/professor` : 'https://icat.org.br/cadastro/professor';
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!formData.name) return;
    const newFunc = {
      id: Date.now(),
      name: formData.name,
      role: formData.role || 'Colaborador',
      department: formData.department || 'Geral',
      perfil: formData.perfil || 'Administrativo',
      status: 'Ativo',
      foto: formData.foto
    };
    setFuncionarios([newFunc, ...funcionarios]);
    setFormData({ name: '', role: '', department: '', perfil: '', cpf: '', whatsapp: '', address: '', foto: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipe e Funcionários</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie os colaboradores, professores e voluntários do ICAT.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleCopyLink}
            className="btn-secondary flex items-center bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            {copied ? <CheckCircle className="w-5 h-5 mr-2 text-green-500" /> : <LinkIcon className="w-5 h-5 mr-2 text-icat-blue" />}
            {copied ? 'Link Copiado!' : 'Link de Cadastro Externo'}
          </button>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Novo Funcionário
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="relative w-72">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar colaborador..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-icat-green outline-none"
            />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-gray-500 uppercase bg-white">
              <th className="p-4 font-semibold">Nome do Colaborador</th>
              <th className="p-4 font-semibold">Cargo</th>
              <th className="p-4 font-semibold">Departamento</th>
              <th className="p-4 font-semibold">Perfil</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {funcionarios.map(f => (
              <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-gray-400" /> {f.name}
                  </div>
                </td>
                <td className="p-4 text-gray-600">{f.role}</td>
                <td className="p-4 text-gray-600">{f.department}</td>
                <td className="p-4 text-gray-600"><span className="bg-gray-100 px-2 py-1 rounded text-xs font-semibold">{f.perfil}</span></td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-50 text-icat-green">
                    {f.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2 flex justify-end">
                  <button onClick={() => { setSelectedFuncId(f.id); setIsCrachaOpen(true); }} className="p-2 text-gray-400 hover:text-icat-blue transition-colors rounded-lg hover:bg-blue-50" title="Gerar Crachá">
                    <User className="w-4 h-4" />
                  </button>
                  <button onClick={() => alert('Senha resetada para 123456')} className="p-2 text-gray-400 hover:text-icat-blue transition-colors rounded-lg hover:bg-blue-50" title="Resetar Senha para 123456">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  </button>
                  <button onClick={() => setIsModalOpen(true)} className="p-2 text-gray-400 hover:text-icat-blue transition-colors rounded-lg hover:bg-blue-50">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50" onClick={() => setFuncionarios(funcionarios.filter(x => x.id !== f.id))}>
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
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Cadastrar Colaborador</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 max-h-[80vh]">
              
              <div className="flex gap-6 items-start">
                <div className="w-32 h-32 bg-gray-100 rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 hover:border-icat-green transition-all relative overflow-hidden group">
                  {formData.foto ? (
                    <img src={formData.foto} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Camera className="w-6 h-6 mb-1 group-hover:text-icat-green" />
                      <span className="text-xs text-center px-2">Adicionar<br/>Foto</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="user" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => setFormData({...formData, foto: e.target?.result as string});
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
                
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                    <input type="text" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="000.000.000-00" />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                    <input type="text" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="(64) 90000-0000" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
                  <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="Rua, Número, Bairro, CEP" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cargo / Função</label>
                  <input type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="Ex: Professor" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                  <select value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none">
                    <option value="">Selecione...</option>
                    <option value="Administrativo">Administrativo</option>
                    <option value="Assistência">Assistência Social</option>
                    <option value="Esportes">Esportes</option>
                    <option value="Cultura">Cultura</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Perfil de Acesso</label>
                  <select value={formData.perfil} onChange={e => setFormData({...formData, perfil: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none">
                    <option value="">Selecione...</option>
                    <option value="Administrador">Administrador</option>
                    <option value="Suporte">Suporte</option>
                    <option value="Administrativo">Administrativo</option>
                    <option value="Professor">Professor</option>
                    <option value="Aluno">Aluno</option>
                    <option value="Beneficiário">Beneficiário</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-gray-600 hover:text-gray-900 transition-colors">Cancelar</button>
              <button onClick={handleSave} className="btn-primary">Salvar Colaborador</button>
            </div>
          </div>
        </div>
      )}
      {isCrachaOpen && selectedFuncId && (() => {
        const func = funcionarios.find(f => f.id === selectedFuncId);
        if (!func) return null;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsCrachaOpen(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[800px]">
              
              <style>{`
                @media print {
                  @page {
                    size: 54mm 86mm;
                    margin: 0;
                  }
                }
              `}</style>
              
              {/* Lado Esquerdo: Configurações */}
              <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Emissão de Crachá (PVC)</h2>
                  <button onClick={() => setIsCrachaOpen(false)} className="text-gray-400 hover:text-gray-600 md:hidden"><X className="w-6 h-6" /></button>
                </div>
                
                <p className="text-sm text-gray-600 mb-6">O layout padrão de Cartões PVC (CR80 - 54x86mm). Use uma impressora térmica para imprimir.</p>

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
                                setFuncionarios(funcionarios.map(f => f.id === selectedFuncId ? {...f, foto: ev.target?.result as string} : f));
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
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200 space-y-3">
                    <button 
                      onClick={async () => {
                        const { toPng } = await import('html-to-image');
                        const node = document.getElementById('cracha-pvc-card');
                        if (!node) return;
                        const dataUrl = await toPng(node, { pixelRatio: 4, backgroundColor: '#ffffff' });
                        const link = document.createElement('a');
                        link.download = `cracha-ICAT-${func.id}.png`;
                        link.href = dataUrl;
                        link.click();
                      }}
                      className="w-full bg-icat-blue hover:bg-blue-700 text-white py-3 rounded-lg flex justify-center items-center gap-2 text-sm font-bold transition-colors"
                    >
                      Baixar PNG (300 DPI)
                    </button>
                    
                    <button 
                      onClick={() => window.print()}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 rounded-lg flex justify-center items-center gap-2 text-xs font-medium transition-colors"
                    >
                      Imprimir pelo Navegador (Ctrl+P)
                    </button>
                  </div>
                </div>
              </div>

              {/* Lado Direito: Preview */}
              <div className="w-full md:w-1/2 p-6 flex flex-col items-center justify-center bg-gray-200 relative">
                <button onClick={() => setIsCrachaOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 hidden md:block">
                  <X className="w-6 h-6" />
                </button>
                
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Preview em Tempo Real</p>
                
                <div id="cracha-print-area" className="flex justify-center items-center">
                  <div 
                    id="cracha-pvc-card"
                    className="relative bg-white shadow-2xl overflow-hidden print:shadow-none print:m-0 print-exact"
                    style={{
                      width: '54mm',
                      height: '86mm',
                      backgroundImage: crachaBg ? `url(${crachaBg})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {/* Topo Azul Escuro (Diferencial Funcionários) */}
                    <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-br from-blue-900 to-blue-800 rounded-b-[40%]"></div>

                    <div className="relative z-10 flex flex-col items-center h-full pt-2 pb-3 px-3">
                      
                      <div className="w-full flex justify-center mb-1.5">
                        <img src="/logo.png" alt="ICAT" className="h-5 w-auto object-contain bg-white/90 backdrop-blur px-2 py-0.5 rounded-full shadow-sm" />
                      </div>

                      <div className="w-[22mm] h-[22mm] rounded-full bg-gray-100 border-[3px] border-white shadow-md overflow-hidden flex items-center justify-center shrink-0">
                        {(func as any).foto ? (
                          <img src={(func as any).foto} alt="Foto" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-10 h-10 text-gray-300" />
                        )}
                      </div>
                      
                      <h2 className="font-black text-[11px] text-gray-900 leading-tight uppercase text-center line-clamp-2 mt-2">{func.name}</h2>
                      <span className="inline-block bg-blue-900 text-white text-[7px] font-black uppercase px-2 py-0.5 rounded-full mt-1 line-clamp-1">{func.role}</span>

                      <div className="w-full text-center mt-2 space-y-0">
                        <p className="text-[9px] text-gray-700"><span className="font-bold">ID:</span> ICAT-FUNC-{func.id.toString().padStart(4, '0')}</p>
                        <p className="text-[9px] text-gray-700 font-medium truncate">Setor: {func.department}</p>
                      </div>

                      <div className="flex-1"></div>

                      <div className="flex flex-col items-center shrink-0">
                        <div className="bg-white p-0.5 rounded border border-gray-200">
                          <QRCodeSVG value={`icat-access-func-${func.id}`} size={36} level="M" />
                        </div>
                        <p className="text-[7px] text-gray-400 mt-0.5 uppercase font-bold">Acesso Autorizado</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
