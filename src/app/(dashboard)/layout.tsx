'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, BookOpen, Settings, LogOut, Package, Heart, LayoutDashboard, Bell, Menu, X, Check, AlertTriangle, Info, Building, DollarSign } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState('admin');

  useEffect(() => {
    const role = localStorage.getItem('mockRole');
    if (role) setCurrentRole(role);
  }, []);
  
  // Mock de notificações
  const notifications = [
    { id: 1, type: 'alert', text: '5 alunos aguardam aprovação de matrícula', time: 'Há 10 min' },
    { id: 2, type: 'info', text: 'Novo cadastro de beneficiário: João Silva', time: 'Há 1 hora' },
    { id: 3, type: 'success', text: 'Doação recebida: R$ 150,00', time: 'Há 2 horas' },
    { id: 4, type: 'warning', text: 'Estoque de Cestas Básicas está baixo (Restam 4)', time: 'Há 1 dia' },
  ];

  return (
    <div className="flex h-screen bg-icat-gray-light overflow-hidden">
      
      {/* 1. SIDEBAR DESKTOP */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col z-20">
        <div className="h-20 flex items-center justify-center border-b border-gray-200">
          <Link href="/admin">
            <img src="/logo.png" alt="ICAT" className="h-14 w-auto object-contain" />
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {['admin', 'professor', 'financeiro', 'assistencia'].includes(currentRole) && (
              <Link href="/admin" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-icat-gray-light hover:text-icat-green group">
                <LayoutDashboard className="mr-3 h-5 w-5 text-gray-400 group-hover:text-icat-green" />
                Dashboard
              </Link>
            )}
            {['admin', 'professor'].includes(currentRole) && (
              <>
                <Link href="/admin/projetos" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-icat-gray-light hover:text-icat-green group">
                  <BookOpen className="mr-3 h-5 w-5 text-gray-400 group-hover:text-icat-green" />
                  Projetos
                </Link>
                <Link href="/admin/cursos" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-icat-gray-light hover:text-icat-green group">
                  <BookOpen className="mr-3 h-5 w-5 text-gray-400 group-hover:text-icat-green" />
                  Cursos e Turmas
                </Link>
                <Link href="/admin/diarios" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-icat-gray-light hover:text-icat-green group">
                  <BookOpen className="mr-3 h-5 w-5 text-gray-400 group-hover:text-icat-green" />
                  Diários de Presença
                </Link>
              </>
            )}
            {['admin', 'professor', 'assistencia'].includes(currentRole) && (
              <Link href="/admin/alunos" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-icat-gray-light hover:text-icat-green group">
                <Users className="mr-3 h-5 w-5 text-gray-400 group-hover:text-icat-green" />
                Alunos e Matrículas
              </Link>
            )}
            {['admin'].includes(currentRole) && (
              <Link href="/admin/funcionarios" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-icat-gray-light hover:text-icat-green group">
                <Users className="mr-3 h-5 w-5 text-gray-400 group-hover:text-icat-green" />
                Equipe e Funcionários
              </Link>
            )}
            {['admin', 'assistencia'].includes(currentRole) && (
              <>
                <Link href="/admin/beneficiarios" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-icat-gray-light hover:text-icat-green group">
                  <Heart className="mr-3 h-5 w-5 text-gray-400 group-hover:text-icat-green" />
                  Assistência Social
                </Link>
                <Link href="/admin/estoque" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-icat-gray-light hover:text-icat-green group">
                  <Package className="mr-3 h-5 w-5 text-gray-400 group-hover:text-icat-green" />
                  Benefícios e Estoque
                </Link>
              </>
            )}
            {['admin', 'financeiro'].includes(currentRole) && (
              <>
                <Link href="/admin/financeiro" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-icat-gray-light hover:text-icat-green group">
                  <DollarSign className="mr-3 h-5 w-5 text-gray-400 group-hover:text-icat-green" />
                  Financeiro
                </Link>
                <Link href="/admin/empresas-parceiras" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-icat-gray-light hover:text-icat-green group">
                  <Building className="mr-3 h-5 w-5 text-gray-400 group-hover:text-icat-green" />
                  Parceiros Oficiais
                </Link>
                <Link href="/admin/clube" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-icat-gray-light hover:text-icat-green group">
                  <Heart className="mr-3 h-5 w-5 text-gray-400 group-hover:text-icat-green" />
                  Clube de Vantagens
                </Link>
              </>
            )}
            {['admin'].includes(currentRole) && (
              <Link href="/admin/configuracoes" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-icat-gray-light hover:text-icat-green group">
                <Settings className="mr-3 h-5 w-5 text-gray-400 group-hover:text-icat-green" />
                Configurações
              </Link>
            )}
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <Link href="/login" className="flex w-full items-center px-3 py-2 text-gray-700 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors">
            <LogOut className="mr-3 h-5 w-5 text-gray-400" />
            Sair
          </Link>
        </div>
      </aside>

      {/* 2. SIDEBAR MOBILE (MODAL/DRAWER) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Overlay fundo escuro */}
          <div 
            className="fixed inset-0 bg-gray-900/80 transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Menu Deslizante */}
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="sr-only">Fechar sidebar</span>
                <X className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            
            <div className="flex shrink-0 items-center px-4 justify-center">
              <img src="/logo.png" alt="ICAT" className="h-12 w-auto object-contain" />
            </div>
            
            <div className="mt-8 h-0 flex-1 overflow-y-auto">
              <nav className="space-y-1 px-2">
                {['admin', 'professor', 'financeiro', 'assistencia'].includes(currentRole) && (
                  <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-icat-gray-light hover:text-icat-green">
                    <LayoutDashboard className="mr-3 h-5 w-5 text-gray-400" /> Dashboard
                  </Link>
                )}
                {['admin', 'professor'].includes(currentRole) && (
                  <>
                    <Link href="/admin/projetos" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-icat-gray-light hover:text-icat-green">
                      <BookOpen className="mr-3 h-5 w-5 text-gray-400" /> Projetos
                    </Link>
                    <Link href="/admin/cursos" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-icat-gray-light hover:text-icat-green">
                      <BookOpen className="mr-3 h-5 w-5 text-gray-400" /> Cursos e Turmas
                    </Link>
                    <Link href="/admin/diarios" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-icat-gray-light hover:text-icat-green">
                      <BookOpen className="mr-3 h-5 w-5 text-gray-400" /> Diários de Presença
                    </Link>
                  </>
                )}
                {['admin', 'professor', 'assistencia'].includes(currentRole) && (
                  <Link href="/admin/alunos" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-icat-gray-light hover:text-icat-green">
                    <Users className="mr-3 h-5 w-5 text-gray-400" /> Alunos e Matrículas
                  </Link>
                )}
                {['admin'].includes(currentRole) && (
                  <Link href="/admin/funcionarios" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-icat-gray-light hover:text-icat-green">
                    <Users className="mr-3 h-5 w-5 text-gray-400" /> Equipe e Funcionários
                  </Link>
                )}
                {['admin', 'assistencia'].includes(currentRole) && (
                  <>
                    <Link href="/admin/beneficiarios" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-icat-gray-light hover:text-icat-green">
                      <Heart className="mr-3 h-5 w-5 text-gray-400" /> Assistência Social
                    </Link>
                    <Link href="/admin/estoque" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-icat-gray-light hover:text-icat-green">
                      <Package className="mr-3 h-5 w-5 text-gray-400" /> Benefícios e Estoque
                    </Link>
                  </>
                )}
                {['admin', 'financeiro'].includes(currentRole) && (
                  <>
                    <Link href="/admin/financeiro" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-icat-gray-light hover:text-icat-green">
                      <DollarSign className="mr-3 h-5 w-5 text-gray-400" /> Financeiro
                    </Link>
                    <Link href="/admin/empresas-parceiras" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-icat-gray-light hover:text-icat-green">
                      <Building className="mr-3 h-5 w-5 text-gray-400" /> Parceiros Oficiais
                    </Link>
                    <Link href="/admin/clube" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-icat-gray-light hover:text-icat-green">
                      <Heart className="mr-3 h-5 w-5 text-gray-400" /> Clube de Vantagens
                    </Link>
                  </>
                )}
                {['admin'].includes(currentRole) && (
                  <Link href="/admin/configuracoes" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-icat-gray-light hover:text-icat-green">
                    <Settings className="mr-3 h-5 w-5 text-gray-400" /> Configurações
                  </Link>
                )}
              </nav>
            </div>
            <div className="p-4 border-t border-gray-200">
              <Link href="/login" className="flex w-full items-center px-3 py-2 text-gray-700 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors">
                <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                Sair
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN CONTENT (HEADER & PAGE) */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex items-center">
            {/* Hamburger (apenas no Mobile) */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 mr-2"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="md:hidden">
              <img src="/logo.png" alt="ICAT" className="h-10 w-auto object-contain" />
            </div>
          </div>

          <div className="flex items-center space-x-6 relative">
            
            {/* Seletor Rápido de Telas (Mock Admin) */}
            <select 
              className="hidden sm:block text-xs font-bold text-gray-700 bg-gray-100 border-none rounded-full px-4 py-2 cursor-pointer outline-none focus:ring-2 focus:ring-icat-blue"
              onChange={(e) => { if(e.target.value) window.location.href = e.target.value; }}
            >
              <option value="">Simular Visão: Administrador</option>
              <option value="/admin/financeiro">Simular: Equipe Financeiro</option>
              <option value="/admin/diarios">Simular: Professor</option>
              <option value="/beneficiario">Simular: Aluno / Beneficiário</option>
            </select>

            {/* Botão de Notificação */}
            <button 
              className="relative p-2 text-gray-400 hover:text-icat-blue transition-colors rounded-full hover:bg-gray-50"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            >
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <Bell className="h-6 w-6" />
            </button>

            {/* Modal de Notificações (Dropdown) */}
            {isNotificationsOpen && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setIsNotificationsOpen(false)}
                ></div>
                <div className="absolute right-12 top-14 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-40 transform transition-all">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-900">Notificações</h3>
                    <span className="text-xs text-icat-blue font-medium cursor-pointer hover:underline">Marcar lidas</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            {notif.type === 'alert' && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                            {notif.type === 'info' && <Info className="w-4 h-4 text-blue-500" />}
                            {notif.type === 'success' && <Check className="w-4 h-4 text-green-500" />}
                            {notif.type === 'warning' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                          </div>
                          <div className="ml-3 w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 leading-snug">{notif.text}</p>
                            <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100 text-center bg-gray-50">
                    <a href="#" className="text-xs font-semibold text-icat-blue hover:text-icat-blue-dark">Ver todas</a>
                  </div>
                </div>
              </>
            )}

            {/* Perfil */}
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="h-9 w-9 rounded-full bg-gradient-to-r from-icat-blue to-icat-green text-white flex items-center justify-center font-bold shadow-sm">
                A
              </div>
              <div className="hidden sm:block">
                <span className="text-sm font-bold text-gray-700 block group-hover:text-icat-blue transition-colors">Super Admin</span>
                <span className="text-xs text-gray-500">Gestão Geral</span>
              </div>
            </div>

          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-icat-gray-light p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>

    </div>
  );
}
