'use client';
import { useState, useEffect } from 'react';
import { Save, Globe, Building, MessageCircle, Shield, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ConfiguracoesAdmin() {
  const [activeTab, setActiveTab] = useState('instituicao');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    razao: 'Instituto Catalano - ICAT',
    cnpj: '00.000.000/0001-00',
    endereco: 'Rua das Margaridas, 123 - Centro, Catalão - GO, 75701-000',
    pix: 'CNPJ: 00.000.000/0001-00',
    whatsapp: '5564999119610',
    contato: '(64) 3441-0000 | (64) 99999-0000',
    email: 'contato@institutocatalano.com.br',
    carteirinhaBg: '',
    instagram: '@icat_catalao',
    facebook: '',
    youtube: ''
  });

  useEffect(() => {
    async function loadConfig() {
      const { data, error } = await supabase.from('configuracoes_instituicao').select('valor').eq('chave', 'global').single();
      if (data && data.valor) {
        setFormData((prev) => ({ ...prev, ...data.valor }));
      }
      setIsLoading(false);
    }
    loadConfig();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await supabase.from('configuracoes_instituicao').upsert({ chave: 'global', valor: formData });
    setIsSaving(false);
    if (!error) {
      alert('Configurações salvas no Supabase com sucesso!');
    } else {
      alert('Aviso: Como o Supabase pode não estar com as chaves reais ainda, os dados não subiram. Configure o .env.local!');
      // Fallback local for now just so the app doesn't break if they haven't put the keys yet
      localStorage.setItem('icat_config_instituicao', JSON.stringify(formData));
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações do Sistema</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie os dados públicos, chaves PIX e informações da instituição.</p>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="btn-primary flex items-center disabled:opacity-50">
          <Save className="w-5 h-5 mr-2" />
          {isSaving ? 'Salvando Nuvem...' : 'Salvar Configurações'}
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
          
          <div className="pt-4 border-t border-gray-200 mt-4 mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3">Gestão do Sistema</span>
          </div>
          
          <button 
            onClick={() => setActiveTab('usuarios')}
            className={`w-full flex items-center p-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'usuarios' ? 'bg-white border border-gray-200 text-icat-blue shadow-sm' : 'hover:bg-gray-50 text-gray-700'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> 
            Usuários do Sistema
          </button>
          <button 
            onClick={() => setActiveTab('logs')}
            className={`w-full flex items-center p-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'logs' ? 'bg-white border border-gray-200 text-icat-blue shadow-sm' : 'hover:bg-gray-50 text-gray-700'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> 
            Logs do Sistema
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
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
                  <input type="text" value={formData.endereco} onChange={(e) => setFormData({...formData, endereco: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contato P/ Relatório (Fixo)</label>
                  <input type="text" value={formData.contato} onChange={(e) => setFormData({...formData, contato: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Institucional</label>
                  <input type="text" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                </div>
                <div className="col-span-2 border-t border-gray-100 pt-4 mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Imagem de Fundo Padrão (Carteirinha PVC)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => setFormData({...formData, carteirinhaBg: ev.target?.result as string});
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  {formData.carteirinhaBg && <div className="mt-2 text-xs text-green-600 font-bold">✓ Imagem carregada (Salve as configurações para aplicar).</div>}
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
          {activeTab === 'usuarios' && (
            <>
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 flex justify-between items-center">
                <span>Usuários do Sistema</span>
                <button onClick={() => alert('Em desenvolvimento. Na V2 abrirá modal de cadastro de novo usuário.')} className="text-sm bg-icat-blue hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-lg transition-colors flex items-center gap-1">
                  + Novo Usuário
                </button>
              </h2>
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Total de Contas</p>
                  <p className="text-2xl font-black text-icat-blue">145</p>
                </div>
                <div className="w-64">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Filtrar por Perfil</label>
                  <select className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-blue outline-none text-sm">
                    <option value="todos">Todos os Perfis</option>
                    <option value="admin">Administrador</option>
                    <option value="alunos">Alunos</option>
                    <option value="funcionarios">Funcionários</option>
                    <option value="beneficiarios">Beneficiários</option>
                    <option value="professores">Professores</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 uppercase">
                      <th className="p-3 font-semibold">Nome</th>
                      <th className="p-3 font-semibold">E-mail / Usuário</th>
                      <th className="p-3 font-semibold">Perfil</th>
                      <th className="p-3 font-semibold text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { nome: 'Hugo Carvalho', email: 'hugo@institutocatalano.com.br', usuario: 'hugo.admin', perfil: 'Administrador' },
                      { nome: 'Maria Silva', email: 'maria@gmail.com', usuario: 'maria.silva', perfil: 'Beneficiários' },
                      { nome: 'João Pedro', email: 'joao.prof@institutocatalano.com.br', usuario: 'joao.prof', perfil: 'Professores' },
                    ].map((u, i) => (
                      <tr key={i} className={`hover:bg-blue-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="p-3 font-medium text-gray-900">{u.nome}</td>
                        <td className="p-3 text-gray-600">
                          <div>{u.email}</div>
                          <div className="text-xs text-gray-400">@{u.usuario}</div>
                        </td>
                        <td className="p-3">
                          <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs font-semibold">{u.perfil}</span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button onClick={() => alert('Em desenvolvimento.')} className="text-icat-blue hover:underline text-xs font-bold" title="Editar">Editar</button>
                          <button onClick={() => alert('Em desenvolvimento.')} className="text-yellow-600 hover:underline text-xs font-bold" title="Bloquear Conta">Bloquear</button>
                          <button onClick={() => alert('Em desenvolvimento.')} className="text-green-600 hover:underline text-xs font-bold" title="Resetar Senha para 123456">Resetar Senha</button>
                          <button onClick={() => alert('Em desenvolvimento.')} className="text-red-600 hover:underline text-xs font-bold" title="Excluir Definitivamente">Excluir</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'logs' && (
            <>
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 flex justify-between items-center">
                <span>Logs do Sistema</span>
                <button onClick={() => alert('O relatório completo de logs será baixado no formato CSV na V2.')} className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1.5 px-3 rounded-lg transition-colors flex items-center gap-1">
                  Exportar Relatório
                </button>
              </h2>
              <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 uppercase">
                      <th className="p-3 font-semibold">Data/Hora</th>
                      <th className="p-3 font-semibold">Usuário</th>
                      <th className="p-3 font-semibold">Ação Realizada</th>
                      <th className="p-3 font-semibold">Módulo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { data: '14/09/2026 14:32', user: 'hugo.admin', acao: 'Excluiu o item "Tomate" do pacote Cesta Básica', modulo: 'Estoque' },
                      { data: '14/09/2026 14:15', user: 'maria.fin', acao: 'Aprovou Emenda Parlamentar #123', modulo: 'Financeiro' },
                      { data: '14/09/2026 10:05', user: 'joao.prof', acao: 'Registrou presença turma "Futebol Sub-12"', modulo: 'Diários' },
                      { data: '13/09/2026 16:40', user: 'hugo.admin', acao: 'Alterou permissões do perfil Secretaria', modulo: 'Configurações' },
                    ].map((l, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors bg-white">
                        <td className="p-3 text-gray-500 whitespace-nowrap">{l.data}</td>
                        <td className="p-3 font-medium text-gray-900">@{l.user}</td>
                        <td className="p-3 text-gray-700">{l.acao}</td>
                        <td className="p-3">
                          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-semibold">{l.modulo}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
