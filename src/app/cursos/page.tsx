import Link from 'next/link';
import { ArrowRight, Users, CheckCircle } from 'lucide-react';
import { Header } from '@/components/Header';

export default function CursosPublico() {
  const cursos = [
    { 
      id: 1, 
      title: 'Ballet Infantil', 
      desc: 'Iniciação à dança focada na coordenação motora, expressão e disciplina para crianças.',
      cost: 0, 
      vacancies: 30, 
      age: '6 a 10 anos',
      img: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?q=80&w=600&auto=format&fit=crop'
    },
    { 
      id: 2, 
      title: 'Escolinha de Futebol', 
      desc: 'Treinamento tático e físico promovendo o trabalho em equipe, saúde e inclusão social.',
      cost: 50, 
      vacancies: 45, 
      age: '10 a 14 anos',
      img: 'https://images.unsplash.com/photo-1518605368461-1e1c9e1d5fd5?q=80&w=600&auto=format&fit=crop'
    },
    { 
      id: 3, 
      title: 'Informática Básica', 
      desc: 'Inclusão digital, pacote office e noções básicas de internet e mercado de trabalho.',
      cost: 0, 
      vacancies: 20, 
      age: '14 a 18 anos',
      img: 'https://images.unsplash.com/photo-1571260899304-425dea57a274?q=80&w=600&auto=format&fit=crop'
    },
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cursos.map((curso) => (
            <div key={curso.id} className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden flex flex-col">
              <div className="h-48 w-full bg-gray-200 relative">
                <img src={curso.img} alt={curso.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm flex items-center gap-1">
                  <Users className="w-4 h-4 text-icat-blue" /> {curso.vacancies} Vagas
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 leading-tight">{curso.title}</h2>
                </div>
                
                <p className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-md w-fit mb-4">
                  Público: {curso.age}
                </p>
                
                <p className="text-gray-600 leading-relaxed flex-1 mb-6">
                  {curso.desc}
                </p>
                
                <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
                  <span className="text-lg font-black text-gray-900">
                    {curso.cost === 0 ? (
                      <span className="text-icat-green flex items-center gap-1">
                        <CheckCircle className="w-5 h-5" /> Gratuito
                      </span>
                    ) : (
                      `R$ ${curso.cost.toFixed(2)}/mês`
                    )}
                  </span>
                  
                  <Link href="/cadastro/aluno" className="btn-primary flex items-center gap-1">
                    Matricular <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

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
