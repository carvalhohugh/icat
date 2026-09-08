'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, CheckCircle2, QrCode, ChevronRight, X as XCircle } from 'lucide-react';

export default function ChamadaPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const method = searchParams.get('method') || 'manual';
  const [token] = useState('icat-test-qr-12345');
  const [timeLeft, setTimeLeft] = useState(300);

  // Generate class days (Mon/Wed/Fri) until end of year
  const generateClassDays = () => {
    const days: string[] = [];
    const now = new Date();
    const endOfYear = new Date(now.getFullYear(), 11, 31);
    const start = new Date(now.getFullYear(), 0, 1);
    const d = new Date(start);
    while (d <= endOfYear) {
      const dow = d.getDay();
      if (dow === 1 || dow === 3 || dow === 5) { // Seg, Qua, Sex
        days.push(d.toLocaleDateString('pt-BR'));
      }
      d.setDate(d.getDate() + 1);
    }
    return days;
  };

  const classDays = generateClassDays();
  const today = new Date().toLocaleDateString('pt-BR');
  const todayIdx = classDays.indexOf(today);
  const [selectedDay, setSelectedDay] = useState(today);
  const [dayOffset, setDayOffset] = useState(Math.max(0, todayIdx - 3));

  const visibleDays = classDays.slice(dayOffset, dayOffset + 7);

  useEffect(() => {
    if (method === 'qrcode' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, method]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const alunosMock = [
    { id: 1, name: 'Ana Souza' },
    { id: 2, name: 'João Guilherme' },
    { id: 3, name: 'Maria Eduarda' },
    { id: 4, name: 'Pedro Henrique' },
  ];

  // Attendance record: { [day]: { [alunoId]: boolean } }
  const [attendance, setAttendance] = useState<Record<string, Record<number, boolean>>>({
    [today]: { 2: true },
    [classDays[todayIdx > 0 ? todayIdx - 1 : 0]]: { 1: true, 2: true, 3: true },
  });

  const togglePresenca = (alunoId: number) => {
    setAttendance(prev => {
      const dayRecord = prev[selectedDay] || {};
      return { ...prev, [selectedDay]: { ...dayRecord, [alunoId]: !dayRecord[alunoId] } };
    });
  };

  const getPresent = (day: string) => {
    const rec = attendance[day] || {};
    return Object.values(rec).filter(Boolean).length;
  };
  const getAbsent = (day: string) => {
    const rec = attendance[day] || {};
    return alunosMock.length - Object.values(rec).filter(Boolean).length;
  };

  const isAlunoPresent = (alunoId: number) => {
    return !!(attendance[selectedDay] && attendance[selectedDay][alunoId]);
  };

  const isPast = (dayStr: string) => {
    const parts = dayStr.split('/');
    const d = new Date(+parts[2], +parts[1] - 1, +parts[0]);
    return d < new Date(new Date().toDateString());
  };

  const [showToast, setShowToast] = useState(false);
  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 relative">
      {showToast && (
        <div className="fixed top-20 right-6 bg-icat-green text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-bounce">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">Chamada salva com sucesso!</span>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <Link href={`/professor/turma/${params.id}`} className="text-sm font-medium text-gray-500 hover:text-icat-blue flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar para turma
        </Link>
        <div className="text-sm font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
          Diário: {selectedDay}
        </div>
      </div>

      {/* Calendar Day Strip */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setDayOffset(Math.max(0, dayOffset - 7))} 
            disabled={dayOffset === 0}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 text-gray-500"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex-1 grid grid-cols-7 gap-2">
            {visibleDays.map(day => {
              const parts = day.split('/');
              const dayName = new Date(+parts[2], +parts[1] - 1, +parts[0]).toLocaleDateString('pt-BR', { weekday: 'short' });
              const isToday = day === today;
              const isSelected = day === selectedDay;
              const past = isPast(day);
              const present = getPresent(day);
              const absent = getAbsent(day);

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`flex flex-col items-center p-2 rounded-xl transition-all text-xs
                    ${isSelected ? 'bg-icat-green text-white shadow-md ring-2 ring-icat-green/30' : 
                      isToday ? 'bg-blue-50 text-icat-blue border border-blue-200' : 
                      past ? 'bg-gray-50 text-gray-500 hover:bg-gray-100' : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-100'}
                  `}
                >
                  <span className="font-bold uppercase text-[10px]">{dayName}</span>
                  <span className="text-lg font-black my-0.5">{parts[0]}/{parts[1]}</span>
                  {past || isToday ? (
                    <div className="flex gap-1 text-[10px] font-bold">
                      <span className={isSelected ? 'text-green-200' : 'text-green-500'}>{present}P</span>
                      <span className={isSelected ? 'text-red-200' : 'text-red-400'}>{absent}F</span>
                    </div>
                  ) : (
                    <span className="text-[10px]">—</span>
                  )}
                </button>
              );
            })}
          </div>

          <button 
            onClick={() => setDayOffset(Math.min(classDays.length - 7, dayOffset + 7))} 
            disabled={dayOffset >= classDays.length - 7}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 text-gray-500"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {method === 'qrcode' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center flex flex-col items-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Escaneie o QR Code</h2>
          <p className="text-gray-500 mb-8">Alunos devem utilizar o aplicativo ou a Área do Aluno para registrar presença.</p>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-6">
            <QRCodeSVG 
              value={`https://icat.org.br/aluno/presenca?token=${token}`}
              size={280}
              level="H"
              includeMargin={true}
              fgColor="#1F2937"
            />
          </div>
          <div className="flex items-center justify-center space-x-2 text-xl font-bold text-gray-900 mb-8">
            <span>Expira em:</span>
            <span className={`px-3 py-1 rounded-lg ${timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-800'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="w-full max-w-sm space-y-4">
            <button className="btn-secondary w-full" onClick={() => setTimeLeft(300)}>
              Gerar Novo QR Code
            </button>
            <Link href={`/professor/turma/${params.id}/chamada?method=manual`} className="block w-full text-center text-icat-blue font-medium hover:underline">
              Alternar para Chamada Manual
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Chamada — {selectedDay}</h2>
              <p className="text-sm text-gray-500">
                {getPresent(selectedDay)} presentes · {getAbsent(selectedDay)} ausentes
              </p>
            </div>
            <Link href={`/professor/turma/${params.id}/chamada?method=qrcode`} className="mt-4 sm:mt-0 flex items-center text-sm font-medium text-icat-blue bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors">
              <QrCode className="h-4 w-4 mr-2" />
              Usar QR Code
            </Link>
          </div>
          
          <ul className="divide-y divide-gray-100">
            {alunosMock.map((aluno, idx) => (
              <li 
                key={aluno.id} 
                className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${idx % 2 === 0 ? 'bg-white hover:bg-blue-50/50' : 'bg-blue-50/30 hover:bg-blue-50/60'}`}
                onClick={() => togglePresenca(aluno.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                    {aluno.name.charAt(0)}
                  </div>
                  <span className="font-medium text-gray-900">{aluno.name}</span>
                </div>
                <div>
                  {isAlunoPresent(aluno.id) ? (
                    <CheckCircle2 className="h-8 w-8 text-icat-green" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-300" />
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <button className="btn-primary w-full md:w-auto" onClick={handleSave}>
              Salvar Chamada
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
