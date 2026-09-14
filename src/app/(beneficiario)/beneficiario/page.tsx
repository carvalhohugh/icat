'use client';
import { useState } from 'react';
import { Heart, Package, MessageCircle, Edit2, Plus, Users, CheckCircle2, Clock, X, Trash2, DollarSign, CreditCard, LogOut, Home, FileText } from 'lucide-react';
import Link from 'next/link';

function validarCPF(cpf: string) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  let t = 9;
  for (let j = 0; j < 2; j++) {
    let d = 0;
    for (let c = 0; c < t; c++) {
      d += parseInt(cpf[c]) * ((t + 1) - c);
    }
    d = ((10 * d) % 11) % 10;
    if (cpf[t] !== d.toString()) return false;
    t++;
  }
  return true;
}

export default function BeneficiarioDashboard() {
  const [editOpen, setEditOpen] = useState(false);
  const [addDepOpen, setAddDepOpen] = useState(false);
  const [editDepOpen, setEditDepOpen] = useState<number | null>(null);

  const [userData, setUserData] = useState({
    name: 'Maria da Silva', status: 'Aprovado', whatsapp: '(64) 99900-1234',
    endereco: 'Rua das Flores, 123 - Vila Margarida, Catalão-GO', cpf: '000.000.000-00'
  });

  const [dependentes, setDependentes] = useState([
    { id: 1, name: 'Ana Silva', birth: '2015-03-12', cpf: '111.111.111-11' },
    { id: 2, name: 'Pedro Silva', birth: '2018-07-25', cpf: '222.222.222-22' },
  ]);

  const [newDep, setNewDep] = useState({ name: '', birth: '', cpf: '' });
  const [cpfError, setCpfError] = useState('');

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
    if (newDep.cpf && !validarCPF(newDep.cpf)) {
      setCpfError('CPF inválido');
      return;
    }
    setDependentes([...dependentes, { id: Date.now(), ...newDep }]);
    setNewDep({ name: '', birth: '', cpf: '' });
    setCpfError('');
    setAddDepOpen(false);
  };

  const handleEditDep = () => {
    if (newDep.cpf && !validarCPF(newDep.cpf)) {
      setCpfError('CPF inválido');
      return;
    }
    setDependentes(dependentes.map(d => d.id === editDepOpen ? { ...d, ...newDep } : d));
    setNewDep({ name: '', birth: '', cpf: '' });
    setCpfError('');
    setEditDepOpen(null);
  };

  const openEditDep = (dep: any) => {
    setNewDep({ name: dep.name, birth: dep.birth, cpf: dep.cpf });
    setEditDepOpen(dep.id);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* HEADER TOP MENU */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="ICAT" className="h-8" />
            <span className="font-bold text-gray-900 hidden sm:inline">Painel do Beneficiário</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#" className="text-sm font-bold text-icat-blue flex items-center gap-1"><Home className="w-4 h-4"/> Início</a>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-icat-blue flex items-center gap-1"><Package className="w-4 h-4"/> Meus Benefícios</a>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-icat-blue flex items-center gap-1"><FileText className="w-4 h-4"/> Relatórios</a>
          </nav>
          <Link href="/login" className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1 font-medium">
             Sair
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
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
                <p className="font-medium text-gray-900 text-sm">Taxa de Matrícula</p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Pago em: 15/08/2026</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900 line-through text-gray-400">R$ 50,00</p>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full mt-1 inline-block">Pago</span>
              </div>
            </div>
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
            <div><span className="text-gray-500">CPF:</span> <span className="font-medium text-gray-900">{userData.cpf}</span></div>
            <div><span className="text-gray-500">WhatsApp:</span> <span className="font-medium text-gray-900">{userData.whatsapp}</span></div>
            <div className="col-span-2"><span className="text-gray-500">Endereço:</span> <span className="font-medium text-gray-900">{userData.endereco}</span></div>
          </div>
        </div>

        {/* Dependentes */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 flex items-center gap-2"><Users className="w-5 h-5 text-gray-400" /> Dependentes ({dependentes.length})</h2>
            <button onClick={() => { setNewDep({ name: '', birth: '', cpf: '' }); setCpfError(''); setAddDepOpen(true); }} className="text-sm text-icat-green font-semibold flex items-center gap-1 hover:underline">
              <Plus className="w-4 h-4" /> Adicionar
            </button>
          </div>
          <div className="space-y-2">
            {dependentes.map(d => (
              <div key={d.id} onClick={() => openEditDep(d)} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{d.name}</p>
                  <p className="text-xs text-gray-500">{calcAge(d.birth)} • CPF: {d.cpf || 'Não informado'}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setDependentes(dependentes.filter(x => x.id !== d.id)); }} className="text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                <input type="text" value={userData.cpf} onChange={e => setUserData({...userData, cpf: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                {userData.cpf && !validarCPF(userData.cpf) && <span className="text-xs text-red-500">CPF inválido</span>}
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
              <button onClick={() => {
                if (userData.cpf && !validarCPF(userData.cpf)) return alert('Corrija o CPF');
                setEditOpen(false);
              }} className="btn-primary">Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Adicionar/Editar Dependente */}
      {(addDepOpen || editDepOpen !== null) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => { setAddDepOpen(false); setEditDepOpen(null); }}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">{editDepOpen ? 'Editar Dependente' : 'Adicionar Dependente'}</h2>
              <button onClick={() => { setAddDepOpen(false); setEditDepOpen(null); }}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              {cpfError && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{cpfError}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input type="text" value={newDep.name} onChange={e => setNewDep({...newDep, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                <input type="date" value={newDep.birth} onChange={e => setNewDep({...newDep, birth: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CPF (Opcional)</label>
                <input type="text" value={newDep.cpf} onChange={e => setNewDep({...newDep, cpf: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="000.000.000-00" />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => { setAddDepOpen(false); setEditDepOpen(null); }} className="px-4 py-2 text-gray-600 font-medium">Cancelar</button>
              <button onClick={editDepOpen ? handleEditDep : handleAddDep} className="btn-primary">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
