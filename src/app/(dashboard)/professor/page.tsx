'use client';
import Link from 'next/link';
import { BookOpen, Users, ClipboardList, Clock } from 'lucide-react';

export default function ProfessorDashboard() {
  const turmas = [
    { id: 1, name: 'Escolinha de Futebol', horario: 'Seg/Qua/Sex - 14h às 16h', alunos: 22, vagas: 30 },
    { id: 2, name: 'Jiu-Jítsu', horario: 'Ter/Qui - 17h às 18h30', alunos: 15, vagas: 30 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Portal do Professor</h1>
        <p className="text-gray-500 text-sm mt-1">Bem-vindo, Professor Carlos. Gerencie suas turmas e presenças.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {turmas.map(t => (
          <div key={t.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{t.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><Clock className="w-4 h-4" /> {t.horario}</p>
                </div>
                <span className="bg-blue-50 text-icat-blue px-3 py-1 rounded-full text-xs font-bold">{t.alunos}/{t.vagas}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                <Users className="w-4 h-4 text-gray-400" /> {t.alunos} alunos matriculados
              </div>

              <div className="flex gap-3">
                <Link href={`/professor/turma/${t.id}/chamada`} className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm py-2.5">
                  <ClipboardList className="w-4 h-4" /> Diário de Presença
                </Link>
                <Link href={`/professor/turma/${t.id}`} className="flex-1 flex items-center justify-center gap-2 text-sm py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                  <BookOpen className="w-4 h-4" /> Ver Alunos
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
