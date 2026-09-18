'use client';
import { Header } from '@/components/Header';
import { DynamicCursos } from '@/components/DynamicCursos';

export default function CursosPublico() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        
        <div className="mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">Cursos e Modalidades</h1>
          <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
            Conheça as atividades oferecidas pelo ICAT e faça sua pré-matrícula online. Sujeito a análise de vagas e critérios sociais.
          </p>
        </div>

        <DynamicCursos />

      </main>

      <footer className="bg-white py-12 border-t border-gray-100 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-gray-500 font-medium mb-2">INSTITUTO CATALANO — ICAT</p>
          <p className="text-sm text-gray-400">© 2026. Catalão, Goiás. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
