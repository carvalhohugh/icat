'use client';
import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, CalendarDays, Clock, MapPin, Users, Image as ImageIcon, Video, Building2, CheckCircle, Link as LinkIcon, Check, Eye, FileText } from 'lucide-react';

export default function EventosAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventos, setEventos] = useState([
    {
      id: 1,
      title: 'Ação Social de Inverno',
      date: '2026-06-20',
      time: '08:00',
      location: 'Praça Central',
      speakers: [{ name: 'Dr. Marcos', role: 'Palestrante Principal', photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop' }],
      participants: '300+',
      sponsors: 'Supermercado ABC, Farmácia Central',
      status: 'Realizado',
      cover: '',
      banner: '',
      gallery: [],
      views: 1245,
      registrations: 312
    }
  ]);

  const [formData, setFormData] = useState({
    title: '', date: '', time: '', location: '', participants: '', sponsors: '', status: 'Agendado', cover: '', banner: ''
  });
  const [formSpeakers, setFormSpeakers] = useState<{name: string, role: string, photo: string}[]>([{name: '', role: '', photo: ''}]);

  const [copiedEventId, setCopiedEventId] = useState<number | null>(null);

  const handleCopyLink = (id: number) => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/evento/${id}` : `https://institutocatalano.com.br/evento/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedEventId(id);
    setTimeout(() => setCopiedEventId(null), 2000);
  };

  const [galleryMode, setGalleryMode] = useState<{isOpen: boolean, eventId: number | null}>({ isOpen: false, eventId: null });
  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState<{url: string, type: 'image'|'video', title: string}[]>([]);

  const handleSave = () => {
    if (!formData.title) return;
    const nextId = eventos.length > 0 ? Math.max(...eventos.map(e => e.id)) + 1 : 1;
    const newEvent = { ...formData, speakers: formSpeakers, id: nextId, gallery: [], views: 0, registrations: 0 };
    setEventos([newEvent, ...eventos]);
    setFormData({ title: '', date: '', time: '', location: '', participants: '', sponsors: '', status: 'Agendado', cover: '', banner: '' });
    setFormSpeakers([{name: '', role: '', photo: ''}]);
    setIsModalOpen(false);
  };

  const openGallery = (id: number) => {
    const ev = eventos.find(e => e.id === id);
    if(ev) setSelectedGalleryFiles(ev.gallery);
    setGalleryMode({ isOpen: true, eventId: id });
  };

  const saveGallery = () => {
    setEventos(eventos.map(e => e.id === galleryMode.eventId ? { ...e, gallery: selectedGalleryFiles } : e));
    setGalleryMode({ isOpen: false, eventId: null });
  };

  const handlePhotoUpload = (e: any, field: 'cover' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setFormData({...formData, [field]: ev.target?.result as string});
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e: any, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setSelectedGalleryFiles([...selectedGalleryFiles, { url: ev.target?.result as string, type, title: 'Nova Mídia' }]);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Eventos e Galerias</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie ações sociais, eventos e acervo fotográfico.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Novo Evento
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 bg-gray-50">
          <div className="relative w-full md:w-96">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Buscar evento..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-icat-green outline-none" />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-gray-500 uppercase bg-white">
              <th className="p-4 font-semibold">Evento / Capa</th>
              <th className="p-4 font-semibold">Data e Hora</th>
              <th className="p-4 font-semibold">Palestrantes</th>
              <th className="p-4 font-semibold">Métricas (Participantes)</th>
              <th className="p-4 font-semibold">Patrocinadores</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {eventos.map(ev => (
              <tr key={ev.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {ev.cover ? <img src={ev.cover} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-400 w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{ev.title}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3"/> {ev.location}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-gray-900 font-medium flex items-center gap-1"><CalendarDays className="w-4 h-4 text-gray-400"/> {ev.date.split('-').reverse().join('/')}</p>
                  <p className="text-gray-500 text-sm flex items-center gap-1"><Clock className="w-4 h-4 text-gray-400"/> {ev.time}</p>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1.5 flex-wrap max-w-xs">
                    {ev.speakers && typeof ev.speakers === 'object' ? ev.speakers.map((s: any, idx: number) => (
                      <span key={idx} className="text-xs font-semibold bg-gray-100 text-gray-700 px-2 py-1 rounded-md flex items-center gap-1">
                        {s.photo && <img src={s.photo} className="w-4 h-4 rounded-full object-cover" />}
                        {s.name}
                      </span>
                    )) : <span className="text-gray-500 text-sm">Sem palestrantes</span>}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-900"><Users className="w-4 h-4 inline text-icat-blue mr-1"/> {ev.registrations} <span className="text-gray-400 text-xs">inscritos</span></span>
                    <span className="text-sm font-medium text-gray-900"><Eye className="w-4 h-4 inline text-gray-400 mr-1"/> {ev.views} <span className="text-gray-400 text-xs">views</span></span>
                  </div>
                </td>
                <td className="p-4 text-gray-600 text-sm">{ev.sponsors || '-'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${ev.status === 'Realizado' ? 'bg-green-50 text-icat-green' : 'bg-blue-50 text-icat-blue'}`}>{ev.status}</span>
                </td>
                <td className="p-4 text-right space-x-1">
                  <button onClick={() => alert(`Relatório do Evento:\nVisualizações: ${ev.views}\nInscritos: ${ev.registrations}`)} className="p-2 text-gray-400 hover:text-icat-yellow transition-colors rounded-lg hover:bg-yellow-50" title="Ver Relatório de Desempenho">
                    <FileText className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleCopyLink(ev.id)} className="p-2 text-gray-400 hover:text-icat-green transition-colors rounded-lg hover:bg-green-50" title="Copiar Link Público">
                    {copiedEventId === ev.id ? <Check className="w-4 h-4 text-icat-green" /> : <LinkIcon className="w-4 h-4" />}
                  </button>
                  <button onClick={() => openGallery(ev.id)} className="p-2 text-gray-400 hover:text-icat-green transition-colors rounded-lg hover:bg-green-50" title="Gerenciar Galeria (Mídia)">
                    <ImageIcon className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-icat-blue transition-colors rounded-lg hover:bg-blue-50">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50" onClick={() => setEventos(eventos.filter(x => x.id !== ev.id))}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Criar Evento */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Configurar Evento</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Foto da Capa (Thumbnail)</label>
                    <div className="h-32 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 hover:border-icat-green transition-all relative overflow-hidden group w-48 text-center p-2">
                      {formData.cover ? (
                        <img src={formData.cover} className="w-full h-full object-cover" />
                      ) : (
                        <><ImageIcon className="w-8 h-8 mb-2 group-hover:text-icat-green" /><span className="text-xs font-semibold">Upload Capa<br/>(800x800px)</span></>
                      )}
                      <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handlePhotoUpload(e, 'cover')} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Banner do Evento (Largo)</label>
                    <div className="h-32 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 hover:border-icat-green transition-all relative overflow-hidden group w-full text-center p-2">
                      {formData.banner ? (
                        <img src={formData.banner} className="w-full h-full object-cover" />
                      ) : (
                        <><ImageIcon className="w-8 h-8 mb-2 group-hover:text-icat-green" /><span className="text-xs font-semibold">Upload Banner<br/>(1920x1080px)</span></>
                      )}
                      <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handlePhotoUpload(e, 'banner')} />
                    </div>
                  </div>
                </div>

                <div className="flex-[2] grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título do Evento</label>
                    <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                    <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
                    <input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Local</label>
                    <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="Ex: Praça Central, Sede do ICAT..." />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Palestrantes / Convidados</label>
                    <div className="space-y-3">
                      {formSpeakers.map((speaker, i) => (
                        <div key={i} className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <div className="w-16 h-16 rounded-full bg-gray-200 shrink-0 overflow-hidden relative cursor-pointer border border-gray-300">
                            {speaker.photo ? <img src={speaker.photo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon className="w-6 h-6"/></div>}
                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                              const file = e.target.files?.[0];
                              if(file) {
                                const url = URL.createObjectURL(file);
                                const newS = [...formSpeakers];
                                newS[i].photo = url;
                                setFormSpeakers(newS);
                              }
                            }} />
                          </div>
                          <div className="flex-1 space-y-2">
                            <input type="text" value={speaker.name} onChange={e => { const newS = [...formSpeakers]; newS[i].name = e.target.value; setFormSpeakers(newS); }} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="Nome do Palestrante" />
                            <input type="text" value={speaker.role} onChange={e => { const newS = [...formSpeakers]; newS[i].role = e.target.value; setFormSpeakers(newS); }} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="Cargo ou Título (Ex: Especialista em RH)" />
                          </div>
                          {formSpeakers.length > 1 && (
                            <button onClick={() => setFormSpeakers(formSpeakers.filter((_, idx) => idx !== i))} className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50">
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button onClick={() => setFormSpeakers([...formSpeakers, {name: '', role: '', photo: ''}])} className="text-sm font-semibold text-icat-green flex items-center gap-1 hover:underline"><Plus className="w-4 h-4"/> Adicionar Palestrante</button>
                    </div>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Público Estimado (Participantes)</label>
                    <input type="text" value={formData.participants} onChange={e => setFormData({...formData, participants: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="Ex: 500+" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Building2 className="w-4 h-4"/> Empresas Patrocinadoras</label>
                    <input type="text" value={formData.sponsors} onChange={e => setFormData({...formData, sponsors: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" placeholder="Separadas por vírgula. Ex: Coca-Cola, Farmácia ABC" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none">
                      <option>Agendado</option>
                      <option>Realizado</option>
                      <option>Cancelado</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors">Cancelar</button>
              <button onClick={handleSave} className="btn-primary">Salvar Evento</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Galeria */}
      {galleryMode.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm" onClick={() => setGalleryMode({ isOpen: false, eventId: null })}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col h-[85vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><ImageIcon className="text-icat-green"/> Galeria de Mídia do Evento</h2>
              <button onClick={() => setGalleryMode({ isOpen: false, eventId: null })} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto bg-gray-50">
              <div className="flex gap-4 mb-8">
                <button className="flex-1 bg-white border border-gray-300 rounded-xl py-6 flex flex-col items-center justify-center gap-2 hover:bg-green-50 hover:border-icat-green transition-all relative overflow-hidden group shadow-sm">
                  <ImageIcon className="w-8 h-8 text-icat-green group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-gray-700">Adicionar Foto</span>
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleGalleryUpload(e, 'image')} />
                </button>
                <button className="flex-1 bg-white border border-gray-300 rounded-xl py-6 flex flex-col items-center justify-center gap-2 hover:bg-blue-50 hover:border-icat-blue transition-all relative overflow-hidden group shadow-sm">
                  <Video className="w-8 h-8 text-icat-blue group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-gray-700">Adicionar Vídeo</span>
                  <input type="file" accept="video/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleGalleryUpload(e, 'video')} />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {selectedGalleryFiles.length === 0 && (
                  <div className="col-span-full py-12 text-center text-gray-400">
                    <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Nenhuma foto ou vídeo nesta galeria ainda.</p>
                  </div>
                )}
                {selectedGalleryFiles.map((file, i) => (
                  <div key={i} className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm relative group">
                    <div className="aspect-square rounded-lg bg-gray-100 overflow-hidden mb-2 relative">
                      {file.type === 'image' ? (
                        <img src={file.url} className="w-full h-full object-cover" />
                      ) : (
                        <video src={file.url} className="w-full h-full object-cover" />
                      )}
                      {file.type === 'video' && <div className="absolute inset-0 bg-black/30 flex items-center justify-center"><Video className="text-white w-8 h-8"/></div>}
                      <button 
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setSelectedGalleryFiles(selectedGalleryFiles.filter((_, idx) => idx !== i))}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <input 
                      type="text" 
                      value={file.title} 
                      onChange={(e) => {
                        const newFiles = [...selectedGalleryFiles];
                        newFiles[i].title = e.target.value;
                        setSelectedGalleryFiles(newFiles);
                      }}
                      className="w-full text-xs font-semibold text-gray-700 border-none bg-gray-50 focus:bg-white rounded px-2 py-1 outline-none" 
                      placeholder="Título / Legenda da Mídia"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-white flex justify-end gap-3 shrink-0">
              <button onClick={() => setGalleryMode({ isOpen: false, eventId: null })} className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors">Cancelar</button>
              <button onClick={saveGallery} className="btn-primary flex items-center gap-2"><CheckCircle className="w-4 h-4"/> Salvar Galeria</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
