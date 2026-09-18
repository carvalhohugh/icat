'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Users, CheckCircle } from 'lucide-react';

export function DynamicCursos() {
  const [cursos, setCursos] = useState<any[]>([
    { 
      id: 1, 
      cursoId: 'ballet',
      title: 'Ballet Infantil', 
      desc: 'Iniciação à dança focada na coordenação motora, expressão e disciplina para crianças.',
      cost: 0, 
      vacancies: 30, 
      age: '6 a 10 anos',
      img: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?q=80&w=600&auto=format&fit=crop'
    },
    { 
      id: 2, 
      cursoId: 'futebol',
      title: 'Escolinha de Futebol', 
      desc: 'Treinamento tático e físico promovendo o trabalho em equipe, saúde e inclusão social.',
      cost: 50, 
      vacancies: 45, 
      age: '10 a 14 anos',
      img: 'https://images.unsplash.com/photo-1518605368461-1e1c9e1d5fd5?q=80&w=600&auto=format&fit=crop'
    },
    { 
      id: 3, 
      cursoId: 'informatica',
      title: 'Informática Básica', 
      desc: 'Inclusão digital, pacote office e noções básicas de internet e mercado de trabalho.',
      cost: 0, 
      vacancies: 20, 
      age: '14 a 18 anos',
      img: 'https://images.unsplash.com/photo-1571260899304-425dea57a274?q=80&w=600&auto=format&fit=crop'
    },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('icat_cursos');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) {
        // Map admin courses to public courses structure
        const mapped = parsed.map((c: any) => ({
          id: c.id,
          cursoId: c.title.toLowerCase().replace(/\s+/g, '-'),
          title: c.title,
          desc: c.desc || 'Descrição em breve...',
          cost: c.cost || 0,
          vacancies: c.max || c.vacancies || 30,
          age: 'Idade livre',
          img: c.img || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop'
        }));
        setCursos(mapped);
      }
    }
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {cursos.map(curso => (
        <div key={curso.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group flex flex-col">
          <div className="h-48 relative overflow-hidden">
            <div className="absolute top-4 left-4 z-10">
              {curso.cost === 0 ? (
                <span className="bg-icat-green text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">Gratuito</span>
              ) : (
                <span className="bg-icat-blue text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">R$ {curso.cost}/mês</span>
              )}
            </div>
            <img src={curso.img} alt={curso.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
          </div>
          <div className="p-8 flex flex-col flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-3">{curso.title}</h3>
            <p className="text-gray-600 mb-6 flex-1 text-sm leading-relaxed">{curso.desc}</p>
            
            <div className="space-y-3 mb-8 bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Users className="w-4 h-4 text-icat-green" /> Faixa: <span className="font-semibold text-gray-900">{curso.age}</span>
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-icat-green" /> <span className="font-semibold text-gray-900">{curso.vacancies}</span> vagas disponíveis
              </p>
            </div>

            <Link 
              href={`/matricula?curso=${curso.cursoId}`}
              className="w-full btn-primary text-center flex justify-center items-center"
            >
              Fazer Pré-Matrícula <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
