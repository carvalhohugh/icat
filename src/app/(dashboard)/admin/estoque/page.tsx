'use client';
import { useState } from 'react';
import { Plus, Search, Package, ArrowDownToLine, ArrowUpFromLine, Settings, Trash2, X, AlertTriangle } from 'lucide-react';

type ItemEstoque = {
  id: number;
  name: string;
  category: string;
  qty: number;
  limitWarning: number;
  description: string;
  packageItems: string[];
};

type Movimento = {
  id: number;
  type: string;
  itemName: string;
  qtyChange: number;
  person: string;
  date: string;
};

export default function EstoqueAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewItemModal, setIsNewItemModal] = useState(false);
  const [itemConfigId, setItemConfigId] = useState<number | null>(null);
  const [lowStockAlert, setLowStockAlert] = useState<{itemName: string, qty: number} | null>(null);
  
  const [beneficios, setBeneficios] = useState<ItemEstoque[]>([
    { id: 1, name: 'Cesta Básica', category: 'Alimentação', qty: 45, limitWarning: 5, description: 'Cesta padrão para doação', packageItems: ['5kg Arroz', '2kg Feijão', '2 un. Óleo', 'Extrato de Tomate', 'Macarrão', 'Açúcar'] },
    { id: 2, name: 'Kit Material Escolar', category: 'Educação', qty: 120, limitWarning: 10, description: 'Kit para início das aulas', packageItems: ['Caderno 10 matérias', 'Lápis', 'Borracha', 'Canetas'] },
  ]);
  
  const [movimentos, setMovimentos] = useState<Movimento[]>([
    { id: 1, type: 'Saída (Entrega)', itemName: 'Cesta Básica', qtyChange: 1, person: 'Maria da Silva', date: '07/09/2026 10:00' },
    { id: 2, type: 'Entrada (Doação)', itemName: 'Cesta Básica', qtyChange: 20, person: 'Supermercado Bretas', date: '06/09/2026 14:30' }
  ]);

  const [formData, setFormData] = useState({ tipo: 'Saída', itemId: 1, qty: 1, person: '' });
  
  const [newItem, setNewItem] = useState({ name: '', category: 'Alimentação', description: '', packageItemsStr: '', limitWarning: 5 });

  const handleSaveMovement = () => {
    if (!formData.person) return;
    
    const targetItem = beneficios.find(b => b.id === formData.itemId);
    if (!targetItem) return;

    const newMov = {
      id: Date.now(),
      type: formData.tipo === 'Saída' ? 'Saída (Entrega)' : 'Entrada (Doação)',
      itemName: targetItem.name,
      qtyChange: formData.qty,
      person: formData.person,
      date: new Date().toLocaleString('pt-BR')
    };

    setMovimentos([newMov, ...movimentos]);

    const newQty = formData.tipo === 'Saída' ? targetItem.qty - formData.qty : targetItem.qty + formData.qty;

    setBeneficios(beneficios.map(b => {
      if (b.id === formData.itemId) {
        return { ...b, qty: newQty };
      }
      return b;
    }));

    setFormData({ ...formData, person: '', qty: 1 });
    setIsModalOpen(false);

    // Notificação de estoque baixo se for saída e chegou/ficou abaixo do limite
    if (formData.tipo === 'Saída' && newQty <= targetItem.limitWarning) {
      setLowStockAlert({ itemName: targetItem.name, qty: newQty });
    }
  };

  const handleSaveNewItem = () => {
    if (!newItem.name.trim()) return;
    
    const items = newItem.packageItemsStr.split(',').map(s => s.trim()).filter(s => s);
    const added: ItemEstoque = {
      id: Date.now(),
      name: newItem.name,
      category: newItem.category,
      description: newItem.description,
      packageItems: items,
      limitWarning: newItem.limitWarning,
      qty: 0
    };
    
    setBeneficios([...beneficios, added]);
    setFormData({ ...formData, itemId: added.id });
    setNewItem({ name: '', category: 'Alimentação', description: '', packageItemsStr: '', limitWarning: 5 });
    setIsNewItemModal(false);
  };

  const handleDeleteItem = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este item? Essa ação não apaga o histórico de movimentações, mas remove o item da lista de estoque.')) {
      setBeneficios(beneficios.filter(b => b.id !== id));
      setItemConfigId(null);
    }
  };

  const activeItemConfig = beneficios.find(b => b.id === itemConfigId);
  const activeItemMovements = movimentos.filter(m => m.itemName === activeItemConfig?.name);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estoque de Benefícios</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie os itens para doação e entregas realizadas.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Registrar Movimentação
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {beneficios.map(b => (
          <div key={b.id} onClick={() => setItemConfigId(b.id)} className={`bg-white p-6 rounded-xl shadow-sm border flex items-center cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden ${b.qty <= b.limitWarning ? 'border-red-200 bg-red-50/30' : 'border-gray-200'}`}>
            {b.qty <= b.limitWarning && <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">Baixo</div>}
            <div className={`p-3 rounded-xl mr-4 ${b.qty <= b.limitWarning ? 'bg-red-100' : 'bg-icat-green/10'}`}>
              <Package className={`w-6 h-6 ${b.qty <= b.limitWarning ? 'text-red-600' : 'text-icat-green'}`} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">{b.name}</p>
              <h2 className="text-2xl font-bold text-gray-900">{b.qty} un.</h2>
            </div>
            <div className="ml-auto text-gray-300">
              <Settings className="w-5 h-5 opacity-50" />
            </div>
          </div>
        ))}
        <div onClick={() => setIsNewItemModal(true)} className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-colors text-gray-500">
          <Plus className="w-6 h-6 mb-2" />
          <span className="font-semibold text-sm">Cadastrar Novo Item</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h2 className="font-bold text-gray-900">Últimas Movimentações (Geral)</h2>
          <div className="relative w-72">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar movimentação..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-icat-green outline-none"
            />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-gray-500 uppercase bg-white">
              <th className="p-4 font-semibold">Tipo</th>
              <th className="p-4 font-semibold">Item</th>
              <th className="p-4 font-semibold">Qtd</th>
              <th className="p-4 font-semibold">Beneficiário/Doador</th>
              <th className="p-4 font-semibold">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {movimentos.map(m => (
              <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                <td className={`p-4 font-medium flex items-center gap-2 ${m.type.includes('Saída') ? 'text-red-500' : 'text-green-500'}`}>
                  {m.type.includes('Saída') ? <ArrowUpFromLine className="w-4 h-4" /> : <ArrowDownToLine className="w-4 h-4" />} {m.type}
                </td>
                <td className="p-4 text-gray-900 font-medium">{m.itemName}</td>
                <td className="p-4 text-gray-600 font-bold">{m.qtyChange}</td>
                <td className="p-4 text-gray-600">{m.person}</td>
                <td className="p-4 text-gray-500 text-sm">{m.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ═══ MODAL REGISTRAR MOVIMENTAÇÃO ═══ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Registrar Movimentação</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Movimento</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer bg-red-50 px-4 py-2 rounded-xl border border-red-100">
                    <input type="radio" name="tipo" checked={formData.tipo === 'Saída'} onChange={() => setFormData({...formData, tipo: 'Saída'})} className="text-red-500 focus:ring-red-500" />
                    <span className="text-red-700 font-semibold text-sm">Saída (Entrega a Família)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-green-50 px-4 py-2 rounded-xl border border-green-100">
                    <input type="radio" name="tipo" checked={formData.tipo === 'Entrada'} onChange={() => setFormData({...formData, tipo: 'Entrada'})} className="text-green-500 focus:ring-green-500" />
                    <span className="text-green-700 font-semibold text-sm">Entrada (Recebimento)</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item do Estoque</label>
                  <div className="flex gap-2">
                    <select value={formData.itemId} onChange={e => setFormData({...formData, itemId: Number(e.target.value)})} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none font-medium">
                      {beneficios.map(b => (
                        <option key={b.id} value={b.id}>{b.name} (Atual: {b.qty})</option>
                      ))}
                    </select>
                    <button onClick={() => setIsNewItemModal(true)} className="px-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-200 flex items-center justify-center" title="Cadastrar Novo Item">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="w-24">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qtd.</label>
                  <input type="number" min="1" value={formData.qty} onChange={e => setFormData({...formData, qty: parseInt(e.target.value) || 1})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none text-center font-bold" />
                </div>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Beneficiário (Responsável) / Doador</label>
                <input 
                  type="text" 
                  value={formData.person} 
                  onChange={e => {
                    setFormData({...formData, person: e.target.value});
                  }} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" 
                  placeholder="Buscar ou digitar nome..." 
                />
                {formData.person.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-200 mt-1 rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {['MARIA DA SILVA', 'MARCOS ANTONIO', 'MARIANA OLIVEIRA', 'MARTA SOUZA', 'JOÃO PEDRO', 'JOÃO BATISTA']
                      .filter(n => n.toLowerCase().includes(formData.person.toLowerCase()))
                      .map(n => (
                       <li key={n} className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 font-medium" onClick={() => {
                          setFormData({...formData, person: n});
                       }}>
                         {n}
                       </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-gray-600 hover:text-gray-900 transition-colors">Cancelar</button>
              <button onClick={handleSaveMovement} className="btn-primary flex items-center gap-2"><ArrowDownToLine className="w-4 h-4" /> Confirmar {formData.tipo}</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ MODAL NOVO ITEM DE ESTOQUE ═══ */}
      {isNewItemModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm" onClick={() => setIsNewItemModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Cadastrar Novo Item</h2>
              <button onClick={() => setIsNewItemModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Item/Pacote</label>
                <input type="text" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="Ex: Cesta Especial" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none">
                    <option>Alimentação</option>
                    <option>Educação</option>
                    <option>Saúde</option>
                    <option>Higiene</option>
                    <option>Vestuário</option>
                    <option>Outros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" title="Avisar quando chegar nessa quantidade">Alerta de Baixa</label>
                  <input type="number" min="0" value={newItem.limitWarning} onChange={e => setNewItem({...newItem, limitWarning: parseInt(e.target.value)||0})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Curta</label>
                <input type="text" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="Opcional" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descriminação (Itens no Pacote)</label>
                <textarea rows={3} value={newItem.packageItemsStr} onChange={e => setNewItem({...newItem, packageItemsStr: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none text-sm" placeholder="Separe por vírgula. Ex: Arroz 5kg, Feijão 2kg, Papel Higiênico, Extrato de Tomate..." />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
              <button onClick={() => setIsNewItemModal(false)} className="px-4 py-2 font-medium text-gray-600 hover:text-gray-900 transition-colors">Cancelar</button>
              <button onClick={handleSaveNewItem} className="btn-primary">Salvar Item</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ MODAL INFORMAÇÕES DO ITEM E RELATÓRIO ═══ */}
      {itemConfigId !== null && activeItemConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setItemConfigId(null)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-icat-green/10 rounded-xl">
                  <Package className="w-8 h-8 text-icat-green" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-900">{activeItemConfig.name}</h2>
                    <span className="text-[10px] font-bold uppercase bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{activeItemConfig.category}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{activeItemConfig.description || 'Sem descrição'}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleDeleteItem(activeItemConfig.id)} className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors" title="Excluir Item">
                  <Trash2 className="w-5 h-5" />
                </button>
                <button onClick={() => setItemConfigId(null)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="md:col-span-1 space-y-6">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-center">
                  <p className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-1">Estoque Atual</p>
                  <p className="text-4xl font-black text-blue-900">{activeItemConfig.qty} <span className="text-lg font-medium">un.</span></p>
                  <p className="text-xs text-blue-600 mt-2">Alerta de Baixa: {activeItemConfig.limitWarning} un.</p>
                </div>

                {activeItemConfig.packageItems.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      Conteúdo do Pacote
                    </h3>
                    <ul className="space-y-2">
                      {activeItemConfig.packageItems.map((pi, idx) => (
                        <li key={idx} className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-icat-green"></div> {pi}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Histórico Específico</h3>
                {activeItemMovements.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhuma movimentação registrada para este item.</p>
                ) : (
                  <div className="space-y-3">
                    {activeItemMovements.map(m => (
                      <div key={m.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3">
                          {m.type.includes('Saída') ? (
                            <div className="bg-red-100 p-2 rounded-lg"><ArrowUpFromLine className="w-4 h-4 text-red-600" /></div>
                          ) : (
                            <div className="bg-green-100 p-2 rounded-lg"><ArrowDownToLine className="w-4 h-4 text-green-600" /></div>
                          )}
                          <div>
                            <p className="text-sm font-bold text-gray-900">{m.person}</p>
                            <p className="text-xs text-gray-500">{m.date}</p>
                          </div>
                        </div>
                        <div className={`font-black ${m.type.includes('Saída') ? 'text-red-500' : 'text-green-500'}`}>
                          {m.type.includes('Saída') ? '-' : '+'}{m.qtyChange}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ NOTIFICAÇÃO ALERTA DE ESTOQUE BAIXO ═══ */}
      {lowStockAlert && (
        <div className="fixed bottom-6 right-6 z-[100] bg-white rounded-xl shadow-2xl border-l-4 border-red-500 p-4 max-w-sm animate-in slide-in-from-bottom-4 flex gap-4 items-start">
          <div className="bg-red-50 p-2 rounded-full flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">Estoque Baixo!</h4>
            <p className="text-sm text-gray-600 mt-1">O item <strong className="text-gray-900">{lowStockAlert.itemName}</strong> chegou em {lowStockAlert.qty} unidades. Sugerimos providenciar novas aquisições.</p>
            <button onClick={() => setLowStockAlert(null)} className="mt-3 text-sm font-bold text-red-500 hover:text-red-700">Entendido</button>
          </div>
        </div>
      )}

    </div>
  );
}
