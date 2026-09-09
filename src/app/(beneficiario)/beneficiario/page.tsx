'use client';
import { useState } from 'react';
import { Heart, Package, MessageCircle, Edit2, Plus, Users, CheckCircle2, Clock, X, Trash2, DollarSign, CreditCard } from 'lucide-react';

export default function BeneficiarioDashboard() {
  const [editOpen, setEditOpen] = useState(false);
  const [addDepOpen, setAddDepOpen] = useState(false);

  const [userData, setUserData] = useState({
    name: 'Maria da Silva', status: 'Aprovado', whatsapp: '(64) 99900-1234',
    endereco: 'Rua das Flores, 123 - Vila Margarida, Catalão-GO'
  });

  const [dependentes, setDependentes] = useState([
    { id: 1, name: 'Ana Silva', birth: '2015-03-12' },
    { id: 2, name: 'Pedro Silva', birth: '2018-07-25' },
  ]);

  const [newDep, setNewDep] = useState({ name: '', birth: '' });

  const beneficios = [
    { name: 'Cesta Básica', status: 'Liberado', next: 'Retirar até 15/09' },
    { name: 'Kit Material Escolar', status: 'Pendente', next: 'Aguardando análise' },
  ];

  const calcAge = (d: string) => {
    if (!d) return '';
    return `${Math.floor((Date.now() - new Date(d).getTime()) / 31557600000)} anos`;
  };

  const handleAddDep = () => {
    if (!newDep.name) return;
    setDependentes([...dependentes, { id: Date.now(), ...newDep }]);
    setNewDep({ name: '', birth: '' });
    setAddDepOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Olá, {userData.name}!</h1>
          <p className="text-gray-500 text-sm mt-1">Seu painel de benefícios e cadastro.</p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${userData.status === 'Aprovado' ? 'bg-green-50 text-icat-green' : 'bg-red-50 text-red-600'}`}>
          {userData.status === 'Aprovado' ? <CheckCircle2 className="w-4 h-4 inline mr-1" /> : null}
          {userData.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Benefícios */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Package className="w-5 h-5 text-icat-green" /> Seus Benefícios</h2>
          <div className="space-y-3">
            {beneficios.map((b, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{b.name}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {b.next}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${b.status === 'Liberado' ? 'bg-green-50 text-icat-green' : 'bg-yellow-50 text-yellow-600'}`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Contato */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><MessageCircle className="w-5 h-5 text-icat-blue" /> Contato Assistência Social</h2>
          <p className="text-gray-600 text-sm mb-4">Fale com nossa equipe para dúvidas sobre seus benefícios, agendamentos ou atualização cadastral.</p>
          <a href="https://wa.me/5564999119610?text=Olá!%20Sou%20beneficiário(a)%20do%20ICAT." target="_blank" rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors">
            <MessageCircle className="w-5 h-5" /> Falar pelo WhatsApp
          </a>
          <p className="text-xs text-gray-400 text-center mt-2">(64) 99911-9610</p>
        </div>
      </div>

      {/* Área Financeira */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><DollarSign className="w-5 h-5 text-icat-yellow" /> Área Financeira</h2>
        <p className="text-gray-500 text-sm mb-4">Acompanhe suas obrigações financeiras, mensalidades e repasses a receber.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900 text-sm">Mensalidade: Futebol Sub-12</p>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Clock className="w-3 h-3" /> Vencimento: 10/10/2026</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">R$ 80,00</p>
              <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full mt-1 inline-block">Pendente</span>
            </div>
          </div>

          <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900 text-sm">Mensalidade: Ballet Infantil</p>
              <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><Clock className="w-3 h-3" /> Vencimento: 10/09/2026</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">R$ 80,00</p>
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full mt-1 inline-block">Atrasado</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
          <button className="text-sm font-medium text-icat-blue hover:underline flex items-center">
            <CreditCard className="w-4 h-4 mr-1" /> Gerar 2ª Via / Pix
          </button>
        </div>
      </div>

      {/* Meu Cadastro */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2"><Heart className="w-5 h-5 text-icat-yellow" /> Meu Cadastro</h2>
          <button onClick={() => setEditOpen(true)} className="text-sm text-icat-blue font-semibold flex items-center gap-1 hover:underline">
            <Edit2 className="w-4 h-4" /> Editar
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">Nome:</span> <span className="font-medium text-gray-900">{userData.name}</span></div>
          <div><span className="text-gray-500">WhatsApp:</span> <span className="font-medium text-gray-900">{userData.whatsapp}</span></div>
          <div className="col-span-2"><span className="text-gray-500">Endereço:</span> <span className="font-medium text-gray-900">{userData.endereco}</span></div>
        </div>
      </div>

      {/* Dependentes */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2"><Users className="w-5 h-5 text-gray-400" /> Dependentes ({dependentes.length})</h2>
          <button onClick={() => setAddDepOpen(true)} className="text-sm text-icat-green font-semibold flex items-center gap-1 hover:underline">
            <Plus className="w-4 h-4" /> Adicionar
          </button>
        </div>
        <div className="space-y-2">
          {dependentes.map(d => (
            <div key={d.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div>
                <p className="font-semibold text-gray-900 text-sm">{d.name}</p>
                <p className="text-xs text-gray-500">{calcAge(d.birth)}</p>
              </div>
              <button onClick={() => setDependentes(dependentes.filter(x => x.id !== d.id))} className="text-gray-400 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Editar Cadastro */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setEditOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Editar Cadastro</h2>
              <button onClick={() => setEditOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input type="text" value={userData.name} onChange={e => setUserData({...userData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                <input type="text" value={userData.whatsapp} onChange={e => setUserData({...userData, whatsapp: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                <input type="text" value={userData.endereco} onChange={e => setUserData({...userData, endereco: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setEditOpen(false)} className="px-4 py-2 text-gray-600 font-medium">Cancelar</button>
              <button onClick={() => setEditOpen(false)} className="btn-primary">Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Adicionar Dependente */}
      {addDepOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setAddDepOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Adicionar Dependente</h2>
              <button onClick={() => setAddDepOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input type="text" value={newDep.name} onChange={e => setNewDep({...newDep, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                <input type="date" value={newDep.birth} onChange={e => setNewDep({...newDep, birth: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setAddDepOpen(false)} className="px-4 py-2 text-gray-600 font-medium">Cancelar</button>
              <button onClick={handleAddDep} className="btn-primary">Adicionar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
