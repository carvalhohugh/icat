'use client';
import { useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { CalendarDays, Clock, MapPin, Users, Building2, Image as ImageIcon, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function EventoDetalhes() {
  const { id } = useParams();
  
  // Mock data - In production this would be fetched from Supabase using the ID
  const evento = {
    id: 1,
    title: 'Ação Social de Inverno',
    date: '2026-06-20',
    time: '08:00',
    location: 'Praça Central, Catalão-GO',
    speakers: [{ name: 'Dr. Marcos', role: 'Palestrante Principal', photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop' }],
    participants: '300+',
    sponsors: 'Supermercado ABC, Farmácia Central',
    status: 'Realizado',
    cover: 'https://images.unsplash.com/photo-1593113580332-ceb4b8a4f944?q=80&w=2070&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1593113580332-ceb4b8a4f944?q=80&w=2070&auto=format&fit=crop',
    desc: 'Uma grande ação social promovida pelo Instituto Catalano focada em arrecadar e distribuir agasalhos, cobertores e refeições quentes para a população em situação de vulnerabilidade.',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1593113580332-ceb4b8a4f944?q=80&w=500&auto=format&fit=crop', type: 'image', title: 'Distribuição de agasalhos' },
      { url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=500&auto=format&fit=crop', type: 'image', title: 'Voluntários em ação' },
      { url: 'https://images.unsplash.com/photo-1559027615-cd4628ce02df?q=80&w=500&auto=format&fit=crop', type: 'image', title: 'Comunidade reunida' },
      { url: 'https://images.unsplash.com/photo-1518398046578-8cca57782e17?q=80&w=500&auto=format&fit=crop', type: 'image', title: 'Doações recebidas' },
    ]
  };

  const [selectedMedia, setSelectedMedia] = useState<any>(null);

  // If not found
  if (id !== '1') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <ImageIcon className="w-16 h-16 text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Evento não encontrado</h1>
          <p className="text-gray-500 mb-6">Este evento não existe ou foi removido.</p>
          <Link href="/" className="btn-primary">Voltar ao Início</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      {/* Banner Principal */}
      <div className="w-full h-[40vh] md:h-[50vh] relative bg-slate-900">
        <img src={evento.banner} alt={evento.title} className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="max-w-6xl mx-auto">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${evento.status === 'Realizado' ? 'bg-icat-green text-white' : 'bg-icat-blue text-white'}`}>
              {evento.status}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">{evento.title}</h1>
            <div className="flex flex-wrap gap-4 text-white/90 text-sm md:text-base font-medium">
              <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4"/> {evento.date.split('-').reverse().join('/')}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> {evento.time}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4"/> {evento.location}</span>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-12 w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-12">
          {/* Descrição */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sobre o Evento</h2>
            <p className="text-gray-600 leading-relaxed text-lg">{evento.desc}</p>
          </section>

          {/* Galeria de Fotos e Vídeos */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ImageIcon className="text-icat-green w-6 h-6" /> Galeria de Mídia
            </h2>
            
            {evento.gallery.length === 0 ? (
              <p className="text-gray-500 bg-white p-6 rounded-2xl border border-gray-100 text-center">Nenhuma mídia foi adicionada a esta galeria ainda.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {evento.gallery.map((media, i) => (
                  <div 
                    key={i} 
                    className="aspect-square rounded-2xl overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-md transition-all"
                    onClick={() => setSelectedMedia(media)}
                  >
                    {media.type === 'image' ? (
                      <img src={media.url} alt={media.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <video src={media.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      {media.type === 'video' && <PlayCircle className="w-8 h-8 text-white mb-2" />}
                      <span className="text-white font-medium text-sm line-clamp-2">{media.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar Detalhes */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm text-icat-green">Detalhes e Patrocínio</h3>
            
            <ul className="space-y-4">
              <li className="flex gap-3">
                <Users className="w-5 h-5 text-icat-blue shrink-0" />
                <div>
                  <span className="block text-xs font-semibold text-gray-500 uppercase">Público Estimado</span>
                  <span className="text-gray-900 font-medium">{evento.participants} pessoas</span>
                </div>
              </li>
              <li className="flex gap-3">
                <Building2 className="w-5 h-5 text-icat-yellow shrink-0" />
                <div>
                  <span className="block text-xs font-semibold text-gray-500 uppercase">Empresas Patrocinadoras</span>
                  <span className="text-gray-900 font-medium">{evento.sponsors}</span>
                </div>
              </li>
              <li className="flex gap-3">
                <Users className="w-5 h-5 text-orange-500 shrink-0" />
                <div className="w-full">
                  <span className="block text-xs font-semibold text-gray-500 uppercase mb-3">Palestrantes / Convidados</span>
                  <div className="space-y-3">
                    {evento.speakers.map((s: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3">
                        {s.photo ? (
                          <img src={s.photo} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"><Users className="w-5 h-5 text-gray-400"/></div>
                        )}
                        <div>
                          <p className="font-bold text-sm text-gray-900 leading-tight">{s.name}</p>
                          <p className="text-xs text-gray-500 leading-tight">{s.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </li>
            </ul>
          </div>
          
          {evento.status === 'Agendado' || evento.status === 'Realizado' ? (
            <div className="bg-gradient-to-br from-icat-green to-emerald-600 p-6 rounded-3xl shadow-lg border border-green-700 text-white">
              <h3 className="font-bold text-xl mb-2">Inscrição no Evento</h3>
              <p className="text-green-100 text-sm mb-6">Garanta sua vaga participando gratuitamente.</p>
              
              <form className="space-y-4" onSubmit={e => { e.preventDefault(); alert('Inscrição realizada com sucesso!'); }}>
                <div>
                  <label className="block text-sm font-medium text-green-100 mb-1">Nome Completo</label>
                  <input type="text" required className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white outline-none text-white placeholder-green-200" placeholder="Seu nome" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-100 mb-1">CPF</label>
                  <input type="text" required className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white outline-none text-white placeholder-green-200" placeholder="000.000.000-00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-100 mb-1">WhatsApp</label>
                  <input type="text" required className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white outline-none text-white placeholder-green-200" placeholder="(64) 90000-0000" />
                </div>
                <button type="submit" className="w-full bg-white text-icat-green font-bold py-3 rounded-lg hover:bg-green-50 transition-colors mt-2">
                  Confirmar Inscrição
                </button>
              </form>
            </div>
          ) : null}
        </div>

      </main>

      {/* Lightbox / Modal View */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedMedia(null)}>
          <button className="absolute top-6 right-6 text-white hover:text-icat-green font-bold text-xl">&times; Fechar</button>
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center" onClick={e => e.stopPropagation()}>
            {selectedMedia.type === 'image' ? (
              <img src={selectedMedia.url} className="max-w-full max-h-[80vh] object-contain rounded-lg" alt={selectedMedia.title} />
            ) : (
              <video src={selectedMedia.url} controls autoPlay className="max-w-full max-h-[80vh] object-contain rounded-lg" />
            )}
            <p className="text-white mt-4 font-medium text-lg">{selectedMedia.title}</p>
          </div>
        </div>
      )}
    </div>
  );
}
