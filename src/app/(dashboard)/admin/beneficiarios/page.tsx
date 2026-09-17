'use client';
import { useState, useEffect } from 'react';
import { Search, Plus, Filter, Edit2, Trash2, Heart, Users, FileText, CheckCircle, Copy, Check, ClipboardEdit, X, Download, Camera, User } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '@/lib/supabase';

export default function BeneficiariosAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProntuarioOpen, setIsProntuarioOpen] = useState(false);
  const [isCarteirinhaOpen, setIsCarteirinhaOpen] = useState(false);
  const [selectedBenId, setSelectedBenId] = useState<number | null>(null);
  const [carteirinhaBg, setCarteirinhaBg] = useState<string>('');
  
  const [beneficiarios, setBeneficiarios] = useState([
    { id: 1001, name: 'Maria da Silva', dependents: 3, neighborhood: 'Vila Margarida', status: 'Aprovado' },
    { id: 1002, name: 'João Oliveira', dependents: 1, neighborhood: 'Centro', status: 'Pendente' }
  ]);

  const [formData, setFormData] = useState({
    name: '', cpf: '', birthdate: '', dependents: '', income: '', whatsapp: '',
    cep: '', logradouro: '', bairro: '', cidade: '', uf: '',
    maritalStatus: 'Solteiro(a)', spouseName: '', spouseBirthdate: '',
    hasChildren: 'Não', foto: ''
  });

  const [childrenList, setChildrenList] = useState<{name: string, birthdate: string}[]>([]);
  const [copied, setCopied] = useState(false);

  const [prontuario, setProntuario] = useState([
    { id: 1, benId: 1001, date: '05/09/2026', type: 'Assistência Social', note: 'Visita domiciliar realizada. Família em situação de vulnerabilidade, necessita de cesta básica com urgência.', assistant: 'Amanda Oliveira' },
    { id: 2, benId: 1001, date: '10/08/2026', type: 'Assistência Social', note: 'Cadastro inicial aprovado.', assistant: 'Carlos Silva' }
  ]);
  
  const [novaAnotacao, setNovaAnotacao] = useState('');
  const [tipoAtendimento, setTipoAtendimento] = useState('Assistência Social');

  useEffect(() => {
    async function fetchBeneficiarios() {
      const { data } = await supabase.from('beneficiarios').select('*').order('id', { ascending: false });
      if (data && data.length > 0) {
        setBeneficiarios(data.map(d => ({
          id: d.id, name: d.nome, dependents: d.filhos, neighborhood: d.bairro, status: d.status
        })));
      }
    }
    fetchBeneficiarios();
  }, []);

  const handleCopyLink = () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/cadastro/beneficiario` : 'https://institutocatalano.com.br/cadastro/beneficiario';
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCepChange = async (cep: string) => {
    setFormData(prev => ({ ...prev, cep }));
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            logradouro: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            uf: data.uf || ''
          }));
        }
      } catch (err) {
        console.error('Erro ao buscar CEP', err);
      }
    }
  };

  const handleSave = async () => {
    if(!formData.name) return;
    const nextId = beneficiarios.length > 0 ? Math.max(...beneficiarios.map(b => b.id)) + 1 : 1001;
    const depCount = formData.hasChildren === 'Sim' ? childrenList.length : (parseInt(formData.dependents) || 0);
    setBeneficiarios([
      ...beneficiarios,
      { id: nextId, name: formData.name, dependents: depCount, neighborhood: formData.bairro || 'Não informado', status: 'Aprovado', foto: formData.foto }
    ]);
    
    await supabase.from('beneficiarios').insert([{
      nome: formData.name, cpf: formData.cpf, bairro: formData.bairro || 'Não informado',
      filhos: depCount, status: 'Aprovado', renda_estimada: parseFloat(formData.income) || 0,
      whatsapp: formData.whatsapp
    }]);

    setFormData({ name: '', cpf: '', birthdate: '', dependents: '', income: '', whatsapp: '', cep: '', logradouro: '', bairro: '', cidade: '', uf: '', maritalStatus: 'Solteiro(a)', spouseName: '', spouseBirthdate: '', hasChildren: 'Não', foto: '' });
    setChildrenList([]);
    setIsModalOpen(false);
  };

  const calculateAge = (dateStr: string) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const age = new Date(diff).getUTCFullYear() - 1970;
    return age > 0 ? `${age} anos` : '';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Beneficiários</h1>
          <p className="text-gray-500 text-sm mt-1">Gestão de famílias e acompanhamento social.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleCopyLink} className="btn-secondary flex items-center gap-2">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Link Copiado!' : 'Copiar Link de Cadastro'}
          </button>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Novo Beneficiário
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Buscar por nome, CPF ou bairro..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
        </div>
        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 font-medium">
          <Filter className="w-4 h-4" /> Filtros
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-gray-500 uppercase bg-white">
              <th className="p-4 font-semibold">ID</th>
              <th className="p-4 font-semibold">Responsável Familiar</th>
              <th className="p-4 font-semibold">Dependentes</th>
              <th className="p-4 font-semibold">Bairro</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {beneficiarios.map(b => (
              <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-600 font-bold text-xs">#{b.id}</td>
                <td className="p-4 font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-icat-yellow" /> {b.name}
                  </div>
                </td>
                <td className="p-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-gray-400"/> {b.dependents}
                  </div>
                </td>
                <td className="p-4 text-gray-600">{b.neighborhood}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${b.status === 'Aprovado' ? 'bg-green-50 text-icat-green' : b.status === 'Suspenso' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>{b.status}</span>
                </td>
                <td className="p-4 text-right space-x-1">
                  <button onClick={() => { setSelectedBenId(b.id); setIsProntuarioOpen(true); }} className="p-2 text-gray-400 hover:text-icat-green transition-colors rounded-lg hover:bg-green-50" title="Prontuário">
                    <ClipboardEdit className="w-4 h-4" />
                  </button>
                  <button onClick={() => { setSelectedBenId(b.id); setIsCarteirinhaOpen(true); }} className="p-2 text-gray-400 hover:text-icat-blue transition-colors rounded-lg hover:bg-blue-50" title="Gerar Carteirinha">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-id-card"><path d="M16 10h2"/><path d="M16 14h2"/><path d="M6.17 15a3 3 0 0 1 5.66 0"/><circle cx="9" cy="11" r="2"/><rect x="2" y="5" width="20" height="14" rx="2"/></svg>
                  </button>
                  <button onClick={() => setIsModalOpen(true)} className="p-2 text-gray-400 hover:text-icat-blue transition-colors rounded-lg hover:bg-blue-50" title="Editar">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setBeneficiarios(beneficiarios.map(x => x.id === b.id ? { ...x, status: x.status === 'Suspenso' ? 'Aprovado' : 'Suspenso' } : x))} className="p-2 text-gray-400 hover:text-orange-500 transition-colors rounded-lg hover:bg-orange-50" title={b.status === 'Suspenso' ? 'Reativar Cadastro' : 'Suspender Cadastro'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ban"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50" onClick={() => setBeneficiarios(beneficiarios.filter(x => x.id !== b.id))} title="Excluir">
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
              <h2 className="text-xl font-bold text-gray-900">Cadastro de Família</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4 max-h-[70vh]">
              
              <h3 className="font-semibold text-gray-800 border-b pb-2 mb-4">Dados Pessoais</h3>
              <div className="flex flex-col md:flex-row gap-6 mb-4">
                <div className="w-32 h-32 bg-gray-100 rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 hover:border-icat-green transition-all relative overflow-hidden group shrink-0 mx-auto md:mx-0">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Responsável</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento <span className="text-gray-400 font-normal">{calculateAge(formData.birthdate)}</span></label>
                    <input type="date" value={formData.birthdate} onChange={e => setFormData({...formData, birthdate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                  <input type="text" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="000.000.000-00" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                  <input type="text" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="(64) 90000-0000" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado Civil</label>
                  <select value={formData.maritalStatus} onChange={e => setFormData({...formData, maritalStatus: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none">
                    <option>Solteiro(a)</option>
                    <option>Casado(a)</option>
                    <option>Divorciado(a)</option>
                    <option>Viúvo(a)</option>
                  </select>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Renda Familiar Declarada</label>
                  <input type="text" value={formData.income} onChange={e => setFormData({...formData, income: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="R$ 0,00" />
                </div>
              </div>

              {formData.maritalStatus === 'Casado(a)' && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mt-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Dados do Cônjuge</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Cônjuge</label>
                      <input type="text" value={formData.spouseName} onChange={e => setFormData({...formData, spouseName: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento <span className="text-gray-400 font-normal">{calculateAge(formData.spouseBirthdate)}</span></label>
                      <input type="date" value={formData.spouseBirthdate} onChange={e => setFormData({...formData, spouseBirthdate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tem filhos?</label>
                <select value={formData.hasChildren} onChange={e => setFormData({...formData, hasChildren: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none">
                  <option>Não</option>
                  <option>Sim</option>
                </select>
              </div>

              {formData.hasChildren === 'Sim' && (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Filhos/Dependentes</h4>
                  
                  {childrenList.map((child, index) => (
                    <div key={index} className="flex gap-2 mb-2 items-end">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Nome</label>
                        <input type="text" value={child.name} onChange={e => {
                          const newList = [...childrenList];
                          newList[index].name = e.target.value;
                          setChildrenList(newList);
                        }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                      </div>
                      <div className="w-1/3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Nascimento <span className="text-gray-400 font-normal">{calculateAge(child.birthdate)}</span></label>
                        <input type="date" value={child.birthdate} onChange={e => {
                          const newList = [...childrenList];
                          newList[index].birthdate = e.target.value;
                          setChildrenList(newList);
                        }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                      </div>
                      <button onClick={() => setChildrenList(childrenList.filter((_, i) => i !== index))} className="p-2 text-red-500 hover:bg-red-100 rounded-lg mb-0.5">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  
                  <button onClick={() => setChildrenList([...childrenList, {name: '', birthdate: ''}])} className="text-sm text-icat-blue font-semibold hover:underline mt-2 flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Adicionar Filho
                  </button>
                </div>
              )}

              <h3 className="font-semibold text-gray-800 border-b pb-2 mt-6 mb-4">Endereço</h3>
              <div className="grid grid-cols-6 gap-4">
                <div className="col-span-6 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                  <input type="text" value={formData.cep} onChange={e => handleCepChange(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="00000-000" />
                </div>
                <div className="col-span-6 md:col-span-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logradouro / Rua</label>
                  <input type="text" value={formData.logradouro} onChange={e => setFormData({...formData, logradouro: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                </div>
                <div className="col-span-6 md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                  <input type="text" value={formData.bairro} onChange={e => setFormData({...formData, bairro: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                  <input type="text" value={formData.cidade} onChange={e => setFormData({...formData, cidade: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">UF</label>
                  <input type="text" value={formData.uf} onChange={e => setFormData({...formData, uf: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                </div>
              </div>

            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-gray-600 hover:text-gray-900 transition-colors">Cancelar</button>
              <button onClick={handleSave} className="btn-primary">Salvar Família</button>
            </div>
          </div>
        </div>
      )}

      {isProntuarioOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsProntuarioOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Prontuário de Acompanhamento</h2>
                <p className="text-sm text-gray-500">Histórico da assistência social familiar</p>
              </div>
              <button onClick={() => setIsProntuarioOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
              <div className="space-y-3">
                {prontuario.filter(p => p.benId === selectedBenId).map(p => (
                  <div key={p.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">{p.date}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">{p.type}</span>
                      </div>
                      <span className="text-xs text-gray-500">{p.assistant}</span>
                    </div>
                    <p className="text-sm text-gray-700">{p.note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-white space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Especialidade / Tipo de Atendimento</label>
                <select 
                  value={tipoAtendimento}
                  onChange={e => setTipoAtendimento(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none text-sm"
                >
                  <option value="Assistência Social">Assistência Social</option>
                  <option value="Psicologia">Psicóloga(o)</option>
                  <option value="Jurídico">Advogado(a)</option>
                  <option value="Nutrição">Nutricionista</option>
                  <option value="Contabilidade">Contador(a)</option>
                  <option value="Médico">Médico(a)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nova Anotação</label>
                <textarea 
                  rows={3} 
                  value={novaAnotacao}
                  onChange={e => setNovaAnotacao(e.target.value)}
                  placeholder="Descreva o acompanhamento, consulta ou orientação..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none text-sm"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setIsProntuarioOpen(false)} className="px-4 py-2 font-medium text-gray-600 hover:text-gray-900 text-sm">Fechar</button>
                <button 
                  onClick={() => {
                    if(!novaAnotacao) return;
                    setProntuario([{ id: Date.now(), benId: selectedBenId!, date: new Date().toLocaleDateString('pt-BR'), type: tipoAtendimento, note: novaAnotacao, assistant: 'Admin (Você)' }, ...prontuario]);
                    setNovaAnotacao('');
                    setTipoAtendimento('Assistência Social');
                  }} 
                  className="btn-primary text-sm py-2"
                >
                  Adicionar Registro
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CARTEIRINHA */}
      {isCarteirinhaOpen && selectedBenId && (() => {
        const beneficiario = beneficiarios.find(b => b.id === selectedBenId);
        if (!beneficiario) return null;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsCarteirinhaOpen(false)}></div>
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
                  <h2 className="text-xl font-bold text-gray-900">Emissão de Carteirinha (PVC)</h2>
                  <button onClick={() => setIsCarteirinhaOpen(false)} className="text-gray-400 hover:text-gray-600 md:hidden"><X className="w-6 h-6" /></button>
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
                                setBeneficiarios(beneficiarios.map(b => b.id === selectedBenId ? {...b, foto: ev.target?.result as string} : b));
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
                        const node = document.getElementById('carteirinha-pvc-card');
                        if (!node) return;
                        const dataUrl = await toPng(node, { pixelRatio: 4, backgroundColor: '#ffffff' });
                        const link = document.createElement('a');
                        link.download = `carteirinha-ICAT-${beneficiario.id}.png`;
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
                <button onClick={() => setIsCarteirinhaOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 hidden md:block">
                  <X className="w-6 h-6" />
                </button>
                
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Preview em Tempo Real</p>
                
                <div id="carteirinha-print-area" className="flex justify-center items-center">
                  <div 
                    id="carteirinha-pvc-card"
                    className="relative bg-white shadow-2xl overflow-hidden print:shadow-none print:m-0 print-exact"
                    style={{
                      width: '54mm',
                      height: '86mm',
                      backgroundImage: carteirinhaBg ? `url(${carteirinhaBg})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-br from-icat-blue to-icat-green rounded-b-[40%]"></div>

                    <div className="relative z-10 flex flex-col items-center h-full pt-2 pb-3 px-3">
                      
                      <div className="w-full flex justify-center mb-1.5">
                        <img src="/logo.png" alt="ICAT" className="h-5 w-auto object-contain bg-white/90 backdrop-blur px-2 py-0.5 rounded-full shadow-sm" />
                      </div>

                      <div className="w-[22mm] h-[22mm] rounded-full bg-gray-100 border-[3px] border-white shadow-md overflow-hidden flex items-center justify-center shrink-0">
                        {(beneficiario as any).foto ? (
                          <img src={(beneficiario as any).foto} alt="Foto" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-10 h-10 text-gray-300" />
                        )}
                      </div>
                      
                      <h2 className="font-black text-[11px] text-gray-900 leading-tight uppercase text-center line-clamp-2 mt-2">{beneficiario.name}</h2>
                      <span className="inline-block bg-icat-yellow text-white text-[7px] font-black uppercase px-2 py-0.5 rounded-full mt-1">BENEFICIÁRIO(A)</span>

                      <div className="w-full text-center mt-2 space-y-0">
                        <p className="text-[9px] text-gray-700"><span className="font-bold">ID:</span> ICAT-{beneficiario.id.toString().padStart(4, '0')}</p>
                        <p className="text-[9px] text-gray-700"><span className="font-bold">Bairro:</span> {beneficiario.neighborhood}</p>
                        <p className="text-[9px] text-gray-700 font-medium truncate">Status: {beneficiario.status}</p>
                      </div>

                      <div className="flex-1"></div>

                      <div className="flex flex-col items-center shrink-0">
                        <div className="bg-white p-0.5 rounded border border-gray-200">
                          <QRCodeSVG value={`icat-access-${beneficiario.id}`} size={36} level="M" />
                        </div>
                        <p className="text-[7px] text-gray-400 mt-0.5 uppercase font-bold">Válido até 12/2026</p>
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
