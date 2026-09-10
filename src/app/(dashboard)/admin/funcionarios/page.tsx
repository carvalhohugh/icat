'use client';
import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Briefcase, Link as LinkIcon, CheckCircle, Camera } from 'lucide-react';

export default function FuncionariosAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [funcionarios, setFuncionarios] = useState([
    { id: 1, name: 'Carlos Silva', role: 'Professor', department: 'Esportes', perfil: 'Professor', status: 'Ativo' },
    { id: 2, name: 'Amanda Oliveira', role: 'Assistente Social', department: 'Assistência', perfil: 'Administrativo', status: 'Ativo' },
  ]);

  const [formData, setFormData] = useState({ name: '', role: '', department: '', perfil: '', cpf: '', whatsapp: '', address: '' });

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
      status: 'Ativo'
    };
    setFuncionarios([newFunc, ...funcionarios]);
    setFormData({ name: '', role: '', department: '', perfil: '', cpf: '', whatsapp: '', address: '' });
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
                <td className="p-4 text-right space-x-2">
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
                  <Camera className="w-6 h-6 mb-1 group-hover:text-icat-green" />
                  <span className="text-xs text-center px-2">Adicionar<br/>Foto</span>
                  <input type="file" accept="image/*" capture="user" className="absolute inset-0 opacity-0 cursor-pointer" />
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
    </div>
  );
}
