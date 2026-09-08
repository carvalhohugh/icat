'use client';
import { useState } from 'react';
import { Plus, Search, Package, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

export default function EstoqueAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [beneficios, setBeneficios] = useState([
    { id: 1, name: 'Cesta Básica', category: 'Alimentação', qty: 45 },
    { id: 2, name: 'Kit Material Escolar', category: 'Educação', qty: 120 },
  ]);
  
  const [movimentos, setMovimentos] = useState([
    { id: 1, type: 'Saída (Entrega)', item: 'Cesta Básica', person: 'Maria da Silva', date: '07/09/2026' },
    { id: 2, type: 'Entrada (Doação)', item: 'Cesta Básica (20 un.)', person: 'Supermercado Bretas', date: '06/09/2026' }
  ]);

  const [formData, setFormData] = useState({ tipo: 'Saída', item: 'Cesta Básica', person: '' });

  const handleSave = () => {
    if (!formData.person) return;
    
    const newMov = {
      id: Date.now(),
      type: formData.tipo === 'Saída' ? 'Saída (Entrega)' : 'Entrada (Doação)',
      item: formData.item,
      person: formData.person,
      date: new Date().toLocaleDateString('pt-BR')
    };

    setMovimentos([newMov, ...movimentos]);

    // Update quantity
    setBeneficios(beneficios.map(b => {
      if (b.name === formData.item) {
        return { ...b, qty: formData.tipo === 'Saída' ? b.qty - 1 : b.qty + 1 };
      }
      return b;
    }));

    setFormData({ tipo: 'Saída', item: 'Cesta Básica', person: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estoque de Benefícios</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie os itens para doação e entregas realizadas.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Registrar Entrega
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {beneficios.map(b => (
          <div key={b.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center">
            <div className="bg-icat-green/10 p-3 rounded-xl mr-4">
              <Package className="w-6 h-6 text-icat-green" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">{b.name}</p>
              <h2 className="text-2xl font-bold text-gray-900">{b.qty} un.</h2>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h2 className="font-bold text-gray-900">Últimas Movimentações</h2>
          <div className="relative w-72">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-icat-green outline-none"
            />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-gray-500 uppercase bg-white">
              <th className="p-4 font-semibold">Tipo</th>
              <th className="p-4 font-semibold">Item</th>
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
                <td className="p-4 text-gray-900">{m.item}</td>
                <td className="p-4 text-gray-600">{m.person}</td>
                <td className="p-4 text-gray-500">{m.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Registrar Nova Movimentação</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Movimento</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="tipo" checked={formData.tipo === 'Saída'} onChange={() => setFormData({...formData, tipo: 'Saída'})} className="text-icat-green focus:ring-icat-green" />
                    <span className="text-gray-700">Saída (Entrega a Família)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="tipo" checked={formData.tipo === 'Entrada'} onChange={() => setFormData({...formData, tipo: 'Entrada'})} className="text-icat-green focus:ring-icat-green" />
                    <span className="text-gray-700">Entrada (Recebimento)</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
                <select value={formData.item} onChange={e => setFormData({...formData, item: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none">
                  <option>Cesta Básica</option>
                  <option>Kit Material Escolar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Beneficiário (Responsável) / Doador</label>
                <input type="text" value={formData.person} onChange={e => setFormData({...formData, person: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="Buscar pelo nome..." />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-gray-600 hover:text-gray-900 transition-colors">Cancelar</button>
              <button onClick={handleSave} className="btn-primary">Registrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
