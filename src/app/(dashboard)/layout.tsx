import Link from 'next/link';
import { Users, BookOpen, Settings, LogOut, Package, Heart, LayoutDashboard } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-icat-gray-light">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <img src="/logo.png" alt="ICAT" className="h-8 w-auto object-contain" />
          <span className="ml-2 text-xs font-semibold bg-icat-yellow text-icat-gray-dark px-2 py-1 rounded-full">Painel</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            <Link href="/admin" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-icat-gray-light hover:text-icat-green group">
              <LayoutDashboard className="mr-3 h-5 w-5 text-gray-400 group-hover:text-icat-green" />
              Dashboard
            </Link>
            <Link href="/admin/projetos" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-icat-gray-light hover:text-icat-green group">
              <BookOpen className="mr-3 h-5 w-5 text-gray-400 group-hover:text-icat-green" />
              Projetos
            </Link>
            <Link href="/admin/cursos" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-icat-gray-light hover:text-icat-green group">
              <Users className="mr-3 h-5 w-5 text-gray-400 group-hover:text-icat-green" />
              Cursos e Turmas
            </Link>
            <Link href="/admin/beneficiarios" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-icat-gray-light hover:text-icat-green group">
              <Heart className="mr-3 h-5 w-5 text-gray-400 group-hover:text-icat-green" />
              Assistência Social
            </Link>
            <Link href="/admin/estoque" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-icat-gray-light hover:text-icat-green group">
              <Package className="mr-3 h-5 w-5 text-gray-400 group-hover:text-icat-green" />
              Benefícios
            </Link>
            <Link href="/admin/configuracoes" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-icat-gray-light hover:text-icat-green group">
              <Settings className="mr-3 h-5 w-5 text-gray-400 group-hover:text-icat-green" />
              Configurações
            </Link>
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <button className="flex w-full items-center px-3 py-2 text-gray-700 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors">
            <LogOut className="mr-3 h-5 w-5 text-gray-400" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Mobile / User Profile */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="md:hidden">
            <img src="/logo.png" alt="ICAT" className="h-8 w-auto object-contain" />
          </div>
          <div className="flex-1"></div>
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 rounded-full bg-icat-blue text-white flex items-center justify-center font-bold">
              A
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">Admin</span>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
