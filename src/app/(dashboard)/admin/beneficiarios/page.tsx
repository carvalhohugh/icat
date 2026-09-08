'use client';
import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Heart, Users, Link as LinkIcon, CheckCircle, ClipboardEdit, X } from 'lucide-react';

export default function BeneficiariosAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProntuarioOpen, setIsProntuarioOpen] = useState(false);
  const [selectedBenId, setSelectedBenId] = useState<number | null>(null);
  
  const [beneficiarios, setBeneficiarios] = useState([
    { id: 1, name: 'Maria da Silva', dependents: 3, neighborhood: 'Vila Margarida', status: 'Aprovado' },
    { id: 2, name: 'João Santos', dependents: 5, neighborhood: 'Centro', status: 'Em Análise' },
  ]);

  const [formData, setFormData] = useState({
    name: '', cpf: '', birthdate: '', dependents: '', income: '', whatsapp: '',
    cep: '', logradouro: '', bairro: '', cidade: '', uf: '',
    maritalStatus: 'Solteiro(a)', spouseName: '', spouseBirthdate: '',
    hasChildren: 'Não'
  });

  const [childrenList, setChildrenList] = useState<{name: string, birthdate: string}[]>([]);
  const [copied, setCopied] = useState(false);

  const [prontuario, setProntuario] = useState([
    { id: 1, benId: 1, date: '05/09/2026', note: 'Visita domiciliar realizada. Família em situação de vulnerabilidade, necessita de cesta básica com urgência.', assistant: 'Amanda Oliveira' },
    { id: 2, benId: 1, date: '10/08/2026', note: 'Cadastro inicial aprovado.', assistant: 'Carlos Silva' }
  ]);
  
  const [novaAnotacao, setNovaAnotacao] = useState('');

  const handleCopyLink = () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/cadastro/beneficiario` : 'https://icat.org.br/cadastro/beneficiario';
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

  const handleSave = () => {
    if (!formData.name) return;
    const newBen = {
      id: Date.now(),
      name: formData.name,
      dependents: childrenList.length + (formData.maritalStatus === 'Casado(a)' ? 1 : 0),
      neighborhood: formData.bairro || 'Sem Bairro',
      status: 'Aprovado'
    };
    setBeneficiarios([newBen, ...beneficiarios]);
    setFormData({ name: '', cpf: '', birthdate: '', dependents: '', income: '', whatsapp: '', cep: '', logradouro: '', bairro: '', cidade: '', uf: '', maritalStatus: 'Solteiro(a)', spouseName: '', spouseBirthdate: '', hasChildren: 'Não' });
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
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Famílias Beneficiadas</h1>
          <p className="text-gray-500 text-sm mt-1">Cadastro e aprovação de famílias para recebimento de doações.</p>
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
            Novo Cadastro
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="relative w-72">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar família..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-icat-green outline-none"
            />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-gray-500 uppercase bg-white">
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
                  <button onClick={() => { setSelectedBenId(b.id); setIsProntuarioOpen(true); }} className="p-2 text-gray-400 hover:text-icat-green transition-colors rounded-lg hover:bg-green-50" title="Prontuário">
                    <ClipboardEdit className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsModalOpen(true)} className="p-2 text-gray-400 hover:text-icat-blue transition-colors rounded-lg hover:bg-blue-50" title="Editar">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-orange-500 transition-colors rounded-lg hover:bg-orange-50" title="Suspender Cadastro">
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
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Responsável</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento <span className="text-gray-400 font-normal">{calculateAge(formData.birthdate)}</span></label>
                  <input type="date" value={formData.birthdate} onChange={e => setFormData({...formData, birthdate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                </div>
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
                      <span className="text-sm font-bold text-gray-900">{p.date}</span>
                      <span className="text-xs text-gray-500">{p.assistant}</span>
                    </div>
                    <p className="text-sm text-gray-700">{p.note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-white">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nova Anotação</label>
              <textarea 
                rows={3} 
                value={novaAnotacao}
                onChange={e => setNovaAnotacao(e.target.value)}
                placeholder="Descreva o acompanhamento, visita ou entrega de benefícios..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none text-sm mb-3"
              ></textarea>
              <div className="flex justify-end gap-3">
                <button onClick={() => setIsProntuarioOpen(false)} className="px-4 py-2 font-medium text-gray-600 hover:text-gray-900 text-sm">Fechar</button>
                <button 
                  onClick={() => {
                    if(!novaAnotacao) return;
                    setProntuario([{ id: Date.now(), benId: selectedBenId!, date: new Date().toLocaleDateString('pt-BR'), note: novaAnotacao, assistant: 'Admin (Você)' }, ...prontuario]);
                    setNovaAnotacao('');
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
    </div>
  );
}
