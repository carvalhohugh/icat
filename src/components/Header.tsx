'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <img src="/logo.png" alt="Instituto Catalano - ICAT" className="h-14 w-auto object-contain" />
            </Link>
          </div>
          <nav className="hidden lg:flex space-x-8">
            <Link href="/quem-somos" className="text-gray-600 hover:text-icat-green font-medium text-sm tracking-wide">QUEM SOMOS</Link>
            <Link href="/areas-de-atuacao" className="text-gray-600 hover:text-icat-green font-medium text-sm tracking-wide">ÁREAS DE ATUAÇÃO</Link>
            <Link href="/cursos" className="text-gray-600 hover:text-icat-green font-medium text-sm tracking-wide">CURSOS</Link>
            <Link href="/#projetos" className="text-gray-600 hover:text-icat-green font-medium text-sm tracking-wide">PROJETOS</Link>
            <Link href="/clube-de-vantagens" className="text-gray-600 hover:text-icat-yellow font-medium text-sm tracking-wide">CLUBE</Link>
            <Link href="/#enquetes" className="text-icat-blue hover:text-blue-700 font-bold text-sm tracking-wide">ENQUETES</Link>
          </nav>
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/login" className="text-gray-500 hover:text-icat-blue text-sm font-medium">Acesso Restrito</Link>
            <Link href="/doacoes" className="btn-primary rounded-full px-6 shadow-sm hover:shadow-md transition-all text-sm font-bold">
              Quero Apoiar
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl z-50">
          <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
            <Link onClick={() => setIsOpen(false)} href="/quem-somos" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-icat-green hover:bg-gray-50">QUEM SOMOS</Link>
            <Link onClick={() => setIsOpen(false)} href="/areas-de-atuacao" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-icat-green hover:bg-gray-50">ÁREAS DE ATUAÇÃO</Link>
            <Link onClick={() => setIsOpen(false)} href="/cursos" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-icat-green hover:bg-gray-50">CURSOS</Link>
            <Link onClick={() => setIsOpen(false)} href="/#projetos" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-icat-green hover:bg-gray-50">PROJETOS</Link>
            <Link onClick={() => setIsOpen(false)} href="/clube-de-vantagens" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-icat-yellow hover:bg-gray-50">CLUBE</Link>
            <Link onClick={() => setIsOpen(false)} href="/#enquetes" className="block px-3 py-2 rounded-md text-base font-bold text-icat-blue hover:text-blue-700 hover:bg-blue-50">ENQUETES</Link>
            <div className="border-t border-gray-100 my-2 pt-2 flex flex-col gap-2">
              <Link onClick={() => setIsOpen(false)} href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-icat-blue hover:bg-gray-50">Acesso Restrito</Link>
              <Link onClick={() => setIsOpen(false)} href="/doacoes" className="block px-3 py-2 rounded-md text-base font-bold text-white bg-icat-green hover:bg-green-700 text-center">Quero Apoiar</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
