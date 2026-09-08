'use client';
import { useState } from 'react';
import { Search, Download, ClipboardList, Filter } from 'lucide-react';

export default function DiariosAdmin() {
  const [filtroTurma, setFiltroTurma] = useState('');
  const [filtroProfessor, setFiltroProfessor] = useState('');

  const registros = [
    { id: 1, data: '07/09/2026', turma: 'Escolinha de Futebol', professor: 'Carlos Silva', presentes: 20, ausentes: 2, percentual: 91 },
    { id: 2, data: '06/09/2026', turma: 'Jiu-Jítsu', professor: 'Carlos Silva', presentes: 13, ausentes: 2, percentual: 87 },
    { id: 3, data: '05/09/2026', turma: 'Ballet Infantil', professor: 'Amanda Oliveira', presentes: 22, ausentes: 3, percentual: 88 },
    { id: 4, data: '05/09/2026', turma: 'Escolinha de Futebol', professor: 'Carlos Silva', presentes: 19, ausentes: 3, percentual: 86 },
    { id: 5, data: '04/09/2026', turma: 'Informática Básica', professor: 'João Pedro', presentes: 7, ausentes: 1, percentual: 88 },
  ];

  const filtrados = registros.filter(r => {
    if (filtroTurma && r.turma !== filtroTurma) return false;
    if (filtroProfessor && r.professor !== filtroProfessor) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Diários de Presença</h1>
          <p className="text-gray-500 text-sm mt-1">Acompanhe a frequência de todas as turmas e professores.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Download className="w-5 h-5" /> Exportar Relatório
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-wrap gap-4 items-center">
        <Filter className="w-5 h-5 text-gray-400" />
        <select value={filtroTurma} onChange={e => setFiltroTurma(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none text-sm">
          <option value="">Todas as Turmas</option>
          <option>Escolinha de Futebol</option>
          <option>Jiu-Jítsu</option>
          <option>Ballet Infantil</option>
          <option>Informática Básica</option>
        </select>
        <select value={filtroProfessor} onChange={e => setFiltroProfessor(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none text-sm">
          <option value="">Todos os Professores</option>
          <option>Carlos Silva</option>
          <option>Amanda Oliveira</option>
          <option>João Pedro</option>
        </select>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-gray-500 uppercase bg-gray-50">
              <th className="p-4 font-semibold">Data</th>
              <th className="p-4 font-semibold">Turma</th>
              <th className="p-4 font-semibold">Professor</th>
              <th className="p-4 font-semibold text-center">Presentes</th>
              <th className="p-4 font-semibold text-center">Ausentes</th>
              <th className="p-4 font-semibold text-center">% Presença</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtrados.map(r => (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-600 text-sm">{r.data}</td>
                <td className="p-4 font-medium text-gray-900 text-sm">{r.turma}</td>
                <td className="p-4 text-gray-600 text-sm">{r.professor}</td>
                <td className="p-4 text-center"><span className="bg-green-50 text-icat-green px-2 py-1 rounded-full text-xs font-bold">{r.presentes}</span></td>
                <td className="p-4 text-center"><span className="bg-red-50 text-red-500 px-2 py-1 rounded-full text-xs font-bold">{r.ausentes}</span></td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${r.percentual >= 90 ? 'bg-icat-green' : r.percentual >= 80 ? 'bg-yellow-400' : 'bg-red-400'}`} style={{width: `${r.percentual}%`}}></div>
                    </div>
                    <span className="text-xs font-bold text-gray-700">{r.percentual}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
