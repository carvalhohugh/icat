import Link from 'next/link';
import { Users, Calendar, ArrowRight } from 'lucide-react';

export default function ProfessorDashboard() {
  // Dados MOCKADOS temporariamente até ligarmos ao banco
  const turmas = [
    {
      id: '12345',
      name: 'Ballet Infantil - Turma A',
      schedule: 'Segundas e Quartas, 14h às 16h',
      studentsCount: 24,
      course: 'Ballet Clássico'
    },
    {
      id: '67890',
      name: 'Escolinha de Futebol - Sub-12',
      schedule: 'Terças e Quintas, 18h às 20h',
      studentsCount: 30,
      course: 'Escolinha de Futebol'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portal do Professor</h1>
          <p className="text-gray-500">Selecione uma turma para realizar a chamada ou ver detalhes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {turmas.map((turma) => (
          <div key={turma.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-bold text-icat-green uppercase tracking-wider bg-green-50 px-2 py-1 rounded-full">
                    {turma.course}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mt-2">{turma.name}</h3>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-icat-blue" />
                  {turma.schedule}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2 text-icat-blue" />
                  {turma.studentsCount} Alunos Matriculados
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <Link 
                  href={`/professor/turma/${turma.id}`}
                  className="flex items-center justify-between text-icat-blue font-semibold hover:text-icat-blue-dark group"
                >
                  <span>Abrir Diário da Turma</span>
                  <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
