'use client';
import { useState } from 'react';
import { Save, Globe, Building, MessageCircle } from 'lucide-react';

export default function ConfiguracoesAdmin() {
  const [activeTab, setActiveTab] = useState('instituicao');

  const [formData, setFormData] = useState({
    razao: 'Instituto Catalano - ICAT',
    cnpj: '00.000.000/0001-00',
    pix: 'CNPJ: 00.000.000/0001-00',
    whatsapp: '5564999119610',
    instagram: '@icat_catalao'
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações do Sistema</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie os dados públicos, chaves PIX e informações da instituição.</p>
        </div>
        <button className="btn-primary flex items-center">
          <Save className="w-5 h-5 mr-2" />
          Salvar Configurações
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Menu Lateral de Configurações */}
        <div className="col-span-1 md:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('instituicao')}
            className={`w-full flex items-center p-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'instituicao' ? 'bg-white border border-gray-200 text-icat-green shadow-sm' : 'hover:bg-gray-50 text-gray-700'}`}
          >
            <Building className="w-5 h-5 mr-3" /> Instituição
          </button>
          <button 
            onClick={() => setActiveTab('pix')}
            className={`w-full flex items-center p-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'pix' ? 'bg-white border border-gray-200 text-icat-green shadow-sm' : 'hover:bg-gray-50 text-gray-700'}`}
          >
            <Globe className="w-5 h-5 mr-3" /> PIX & Doações
          </button>
          <button 
            onClick={() => setActiveTab('redes')}
            className={`w-full flex items-center p-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'redes' ? 'bg-white border border-gray-200 text-icat-green shadow-sm' : 'hover:bg-gray-50 text-gray-700'}`}
          >
            <MessageCircle className="w-5 h-5 mr-3" /> Redes Sociais
          </button>
        </div>

        {/* Formulário */}
        <div className="col-span-1 md:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          
          {activeTab === 'instituicao' && (
            <>
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Dados da Instituição (ICAT)</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Razão Social</label>
                  <input type="text" value={formData.razao} onChange={(e) => setFormData({...formData, razao: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                  <input type="text" value={formData.cnpj} onChange={(e) => setFormData({...formData, cnpj: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone Principal (WhatsApp)</label>
                  <input type="text" value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                </div>
              </div>
            </>
          )}

          {activeTab === 'pix' && (
            <>
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Configuração de Doações (PIX)</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chave PIX Principal</label>
                  <input type="text" value={formData.pix} onChange={(e) => setFormData({...formData, pix: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                  <p className="text-xs text-gray-500 mt-1">Esta chave será usada para gerar os QR Codes no site público.</p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'redes' && (
            <>
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Redes Sociais</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram (@)</label>
                  <input type="text" value={formData.instagram} onChange={(e) => setFormData({...formData, instagram: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
