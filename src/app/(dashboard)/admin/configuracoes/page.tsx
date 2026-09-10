'use client';
import { useState } from 'react';
import { Save, Globe, Building, MessageCircle, Shield, Check } from 'lucide-react';

export default function ConfiguracoesAdmin() {
  const [activeTab, setActiveTab] = useState('instituicao');

  const [formData, setFormData] = useState({
    razao: 'Instituto Catalano - ICAT',
    cnpj: '00.000.000/0001-00',
    pix: 'CNPJ: 00.000.000/0001-00',
    whatsapp: '5564999119610',
    instagram: '@icat_catalao',
    facebook: '',
    youtube: ''
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
          <button 
            onClick={() => setActiveTab('perfis')}
            className={`w-full flex items-center p-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'perfis' ? 'bg-white border border-gray-200 text-icat-green shadow-sm' : 'hover:bg-gray-50 text-gray-700'}`}
          >
            <Shield className="w-5 h-5 mr-3" /> Perfis e Acessos
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
                <div className="col-span-2 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <svg className="w-4 h-4 text-pink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    Instagram (@)
                  </label>
                  <input type="text" value={formData.instagram} onChange={(e) => setFormData({...formData, instagram: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                </div>
                <div className="col-span-2 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    Facebook
                  </label>
                  <input type="text" value={formData.facebook || ''} onChange={(e) => setFormData({...formData, facebook: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="https://facebook.com/..." />
                </div>
                <div className="col-span-2 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                    YouTube
                  </label>
                  <input type="text" value={formData.youtube || ''} onChange={(e) => setFormData({...formData, youtube: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="https://youtube.com/..." />
                </div>
              </div>
            </>
          )}

          {activeTab === 'perfis' && (
            <>
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Perfis e Permissões de Acesso</h2>
              <p className="text-sm text-gray-500 mb-6">Controle quais menus e funcionalidades cada tipo de usuário pode visualizar no painel.</p>
              
              <div className="space-y-6">
                {[
                  { title: 'Administrador Geral', desc: 'Acesso total e irrestrito ao sistema.', defaultEnabled: true, locked: true },
                  { title: 'Secretaria', desc: 'Acesso às turmas, alunos e gestão de matrículas.', defaultEnabled: true },
                  { title: 'Professor / Instrutor', desc: 'Acesso apenas a turmas, alunos e diários de presença.', defaultEnabled: true },
                  { title: 'Financeiro', desc: 'Acesso ao fluxo de caixa, emendas, doações e relatórios.', defaultEnabled: true },
                  { title: 'Assistência Social', desc: 'Acesso ao controle de estoque, benefícios e beneficiários.', defaultEnabled: true },
                  { title: 'Entrevistador', desc: 'Acesso exclusivo ao App Mobile de coleta de pesquisas urbanas (sem acesso ao painel admin).', defaultEnabled: false, locked: true },
                ].map((perfil, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-gray-900">{perfil.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{perfil.desc}</p>
                      </div>
                      {perfil.locked ? (
                         <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded font-semibold">Bloqueado (Sistema)</span>
                      ) : (
                         <button className="text-sm font-semibold text-icat-blue hover:underline">Editar Permissões</button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {['Dashboard', 'Cursos e Turmas', 'Alunos', 'Financeiro', 'Beneficiários', 'Estoque', 'Configurações'].map((menu, j) => (
                          <label key={j} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${perfil.locked || perfil.defaultEnabled ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-200 text-gray-600'}`}>
                             <input type="checkbox" className="hidden" checked={perfil.locked || perfil.defaultEnabled} readOnly />
                             <Check className="w-3 h-3" /> {menu}
                          </label>
                       ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
