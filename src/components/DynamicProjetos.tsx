'use client';
import { useEffect, useState } from 'react';

export function DynamicProjetos() {
  const [projetos, setProjetos] = useState<any[]>([
    { id: 1, title: 'Cesta Solidária', desc: 'Entrega mensal de cestas básicas para famílias em situação de extrema vulnerabilidade, cadastradas e acompanhadas por nossa equipe de assistência social.' },
    { id: 2, title: 'Atleta do Futuro', desc: 'Escolinha de esportes focado em crianças e adolescentes, promovendo disciplina, trabalho em equipe e saúde física, além de tirá-los das ruas no contraturno escolar.' },
    { id: 3, title: 'Qualifica Jovem', desc: 'Cursos de qualificação profissional básica para jovens em busca do primeiro emprego.' },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('icat_projetos');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) {
        setProjetos(parsed.slice(0, 6));
      }
    }
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projetos.map((proj) => (
        <div key={proj.id} className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-all">
          <h3 className="text-xl font-bold text-gray-900 mb-3">{proj.title}</h3>
          <p className="text-gray-600 mb-4">{proj.desc}</p>
        </div>
      ))}
    </div>
  );
}
