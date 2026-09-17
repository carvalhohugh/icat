'use client';
import { Header } from '@/components/Header';
import { Briefcase, Building2, MapPin, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function OportunidadesPublicPage() {
  const [oportunidades, setOportunidades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/oportunidades/sync')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.vagas) {
          setOportunidades(data.vagas);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      {/* Banner */}
      <div className="bg-icat-green py-20 text-center text-white px-4">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Mural de Oportunidades</h1>
        <p className="text-green-100 text-lg max-w-2xl mx-auto">
          Vagas de emprego e jovem aprendiz na região de Catalão, atualizadas diariamente através do SINE e parceiros do ICAT.
        </p>
      </div>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full space-y-6">
        
        {loading ? (
          <div className="text-center py-20 text-gray-500">Buscando oportunidades do dia...</div>
        ) : (
          <div className="space-y-4">
            {oportunidades.map((vaga, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all hover:border-icat-green">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{vaga.titulo}</h3>
                    <span className="bg-green-100 text-green-700 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full">{vaga.tipo}</span>
                  </div>
                  <p className="text-gray-600 flex items-center gap-1.5"><Building2 className="w-4 h-4 text-gray-400" /> {vaga.empresa}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-4">
                    <span className="text-sm font-medium text-gray-500 flex items-center gap-1"><MapPin className="w-4 h-4 text-icat-yellow" /> {vaga.local}</span>
                    <span className="text-sm font-medium text-gray-500 flex items-center gap-1"><AlertCircle className="w-4 h-4 text-icat-blue" /> Requisitos: {vaga.requisitos}</span>
                  </div>
                </div>
                <div className="shrink-0 flex flex-col justify-center">
                  <a href="/login" className="bg-gray-100 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-icat-blue hover:text-white transition-colors text-center w-full md:w-auto">
                    Entrar para Ver Match
                  </a>
                </div>
              </div>
            ))}
            
            {oportunidades.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhuma vaga encontrada hoje</h3>
                <p className="text-gray-500">As oportunidades são sincronizadas diariamente. Volte amanhã!</p>
              </div>
            )}
          </div>
        )}
        
      </main>
    </div>
  );
}
