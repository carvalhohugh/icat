import Link from 'next/link';
import { QrCode, ClipboardList, ChevronLeft } from 'lucide-react';

export default function TurmaView({ params }: { params: { id: string } }) {
  // Mock Data
  const turmaName = params.id === '12345' ? 'Ballet Infantil - Turma A' : 'Turma selecionada';
  
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="mb-6">
        <Link href="/professor" className="text-sm font-medium text-gray-500 hover:text-icat-blue flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar para minhas turmas
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{turmaName}</h1>
        <p className="text-gray-500 mb-8">Gestão de Presença e Diário de Classe</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-col items-center justify-center text-center hover:bg-gray-100 transition-colors">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <QrCode className="h-8 w-8 text-icat-blue" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Chamada por QR Code</h3>
            <p className="text-sm text-gray-600 mb-6">
              Exiba o código na tela para os alunos escanearem. Ideal para turmas com alunos portando celulares.
            </p>
            <Link 
              href={`/professor/turma/${params.id}/chamada?method=qrcode`}
              className="btn-primary w-full max-w-xs"
            >
              Gerar QR Code
            </Link>
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-col items-center justify-center text-center hover:bg-gray-100 transition-colors">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <ClipboardList className="h-8 w-8 text-icat-green" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Chamada Manual</h3>
            <p className="text-sm text-gray-600 mb-6">
              Marque os alunos presentes diretamente na lista do sistema.
            </p>
            <Link 
              href={`/professor/turma/${params.id}/chamada?method=manual`}
              className="btn-secondary w-full max-w-xs"
            >
              Abrir Lista
            </Link>
          </div>

        </div>
      </div>
      
      {/* Últimas Aulas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Últimos Diários Fechados</h2>
        <div className="text-sm text-gray-500 py-4 text-center border border-dashed border-gray-200 rounded-lg">
          Nenhuma aula recente registrada.
        </div>
      </div>
    </div>
  );
}
