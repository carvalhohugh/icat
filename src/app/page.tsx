import Link from 'next/link';
import { Heart, Users, BookOpen, HandHeart } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar Placeholder */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <img src="/logo.png" alt="Instituto Catalano - ICAT" className="h-12 w-auto object-contain" />
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-icat-gray-dark hover:text-icat-green font-medium">Início</Link>
              <Link href="/sobre" className="text-icat-gray-dark hover:text-icat-green font-medium">O Instituto</Link>
              <Link href="/projetos" className="text-icat-gray-dark hover:text-icat-green font-medium">Projetos</Link>
              <Link href="/cursos" className="text-icat-gray-dark hover:text-icat-green font-medium">Cursos</Link>
              <Link href="/doacoes" className="text-icat-gray-dark hover:text-icat-green font-medium">Doações</Link>
            </nav>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/aluno" className="text-icat-blue hover:text-icat-blue-dark font-medium">
                Área do Aluno
              </Link>
              <Link href="/admin" className="btn-primary">
                Acessar Portal
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-icat-blue text-white overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-icat-blue to-icat-green/80"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col items-start">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 max-w-3xl">
            Transformando vidas através da educação, do esporte, da cultura e da solidariedade.
          </h1>
          <p className="text-lg md:text-xl text-blue-50 mb-10 max-w-2xl leading-relaxed">
            O Instituto Catalano atua para criar oportunidades, fortalecer famílias e promover desenvolvimento social em nossa comunidade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/projetos" className="btn-primary flex justify-center items-center gap-2">
              <BookOpen size={20} /> Conheça nossos projetos
            </Link>
            <Link href="/cursos" className="btn-secondary bg-white text-icat-blue hover:bg-gray-100 flex justify-center items-center gap-2">
              <Users size={20} /> Quero participar
            </Link>
            <Link href="/doacoes" className="btn-accent flex justify-center items-center gap-2">
              <Heart size={20} /> Quero doar
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats or Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-2xl bg-icat-gray-light">
              <div className="bg-icat-green/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-icat-green" size={32} />
              </div>
              <h3 className="text-xl font-bold text-icat-gray-dark mb-2">Comunidade</h3>
              <p className="text-gray-600">Milhares de famílias beneficiadas através de nossos programas sociais.</p>
            </div>
            <div className="p-6 rounded-2xl bg-icat-gray-light">
              <div className="bg-icat-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="text-icat-blue" size={32} />
              </div>
              <h3 className="text-xl font-bold text-icat-gray-dark mb-2">Educação e Esporte</h3>
              <p className="text-gray-600">Cursos e escolinhas promovendo o desenvolvimento de crianças e jovens.</p>
            </div>
            <div className="p-6 rounded-2xl bg-icat-gray-light">
              <div className="bg-icat-yellow/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <HandHeart className="text-icat-yellow" size={32} />
              </div>
              <h3 className="text-xl font-bold text-icat-gray-dark mb-2">Solidariedade</h3>
              <p className="text-gray-600">Rede de voluntários e parceiros unidos pela transformação social.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/5564999119610" 
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform z-50 flex items-center justify-center"
        aria-label="Fale conosco no WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
        </svg>
      </a>
    </div>
  );
}
