'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, CheckCircle2, AlertCircle } from 'lucide-react';

const turmasAbertas = [
  { id: 1, name: 'Escolinha de Futebol', age: '6 a 14 anos', horario: 'Seg/Qua/Sex - 14h às 16h', vagas: 30, inscritos: 22, cost: 0 },
  { id: 2, name: 'Ballet Infantil', age: '4 a 10 anos', horario: 'Ter/Qui - 15h às 16h30', vagas: 25, inscritos: 25, cost: 0 },
  { id: 3, name: 'Informática Básica', age: '12 a 17 anos', horario: 'Sáb - 9h às 12h', vagas: 20, inscritos: 8, cost: 0 },
  { id: 4, name: 'Jiu-Jítsu', age: '8 a 16 anos', horario: 'Ter/Qui - 17h às 18h30', vagas: 30, inscritos: 30, cost: 50 },
];

export default function MatriculaPage() {
  const [formData, setFormData] = useState({
    alunoNome: '', alunoBirth: '', responsavel: '', cpfResp: '', whatsapp: '', turmaId: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const getVagasInfo = (turma: typeof turmasAbertas[0]) => {
    const maxComExcedente = Math.floor(turma.vagas * 1.3);
    const vagasDisponiveis = maxComExcedente - turma.inscritos;
    return { maxComExcedente, vagasDisponiveis };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.alunoNome || !formData.turmaId) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md text-center border border-gray-100">
          <CheckCircle2 className="w-16 h-16 text-icat-green mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Inscrição Recebida!</h1>
          <p className="text-gray-600 mb-6">
            A inscrição de <strong>{formData.alunoNome}</strong> foi registrada com sucesso. Nossa equipe entrará em contato pelo WhatsApp para confirmar a matrícula.
          </p>
          <Link href="/" className="text-icat-green font-semibold hover:underline">
            Voltar ao site do ICAT
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center text-gray-500 hover:text-icat-green font-medium text-sm">
            <ChevronLeft className="w-5 h-5 mr-1" /> Voltar ao site
          </Link>
          <img src="/logo.png" alt="ICAT" className="h-8 opacity-60 grayscale" />
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Inscrição para Cursos e Turmas</h1>
          <p className="text-gray-500">Preencha o formulário abaixo para inscrever o aluno em uma das turmas abertas do ICAT.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Etapa 1: Escolha da Turma */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">1. Escolha a Turma</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {turmasAbertas.map(t => {
                const { vagasDisponiveis } = getVagasInfo(t);
                const esgotado = vagasDisponiveis <= 0;
                const excedente = t.inscritos >= t.vagas && !esgotado;
                return (
                  <label 
                    key={t.id} 
                    className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.turmaId === String(t.id) 
                        ? 'border-icat-green bg-green-50' 
                        : esgotado 
                          ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed' 
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input 
                      type="radio" name="turma" value={t.id} 
                      disabled={esgotado}
                      checked={formData.turmaId === String(t.id)}
                      onChange={() => setFormData({...formData, turmaId: String(t.id)})}
                      className="sr-only"
                    />
                    <span className="font-bold text-gray-900">{t.name}</span>
                    <span className="text-xs text-gray-500 mt-1">{t.age} &bull; {t.horario}</span>
                    <span className="text-xs font-bold mt-2">
                      {t.cost === 0 ? <span className="text-icat-green">Gratuito</span> : <span className="text-gray-700">R$ {t.cost.toFixed(2)}/mês</span>}
                    </span>
                    <div className="mt-2 flex items-center gap-1">
                      {esgotado ? (
                        <span className="text-xs font-semibold text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Vagas Esgotadas</span>
                      ) : excedente ? (
                        <span className="text-xs font-semibold text-orange-500">Lista de Espera ({vagasDisponiveis} restantes)</span>
                      ) : (
                        <span className="text-xs font-semibold text-icat-green">{t.vagas - t.inscritos} vagas abertas</span>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Etapa 2: Dados do Aluno */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">2. Dados do Aluno</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo do Aluno</label>
                <input type="text" required value={formData.alunoNome} onChange={e => setFormData({...formData, alunoNome: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                <input type="date" required value={formData.alunoBirth} onChange={e => setFormData({...formData, alunoBirth: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
              </div>
            </div>
          </div>

          {/* Etapa 3: Dados do Responsável */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">3. Dados do Responsável</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo do Responsável</label>
                <input type="text" required value={formData.responsavel} onChange={e => setFormData({...formData, responsavel: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CPF do Responsável</label>
                <input type="text" required value={formData.cpfResp} onChange={e => setFormData({...formData, cpfResp: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="000.000.000-00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp para Contato</label>
                <input type="text" required value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="(64) 90000-0000" />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="p-6 bg-gray-50 flex flex-col items-center">
            <button type="submit" className="btn-primary w-full md:w-auto px-10 py-3 text-base">
              Enviar Inscrição
            </button>
            <p className="text-xs text-gray-400 mt-3 text-center">
              Ao enviar, você concorda com os termos do Instituto Catalano. A matrícula será confirmada por WhatsApp.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
