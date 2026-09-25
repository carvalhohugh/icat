const fs = require('fs');
const file = 'src/app/(dashboard)/admin/pesquisas/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const oldHandle = `  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const btn = document.getElementById('btn-ai-upload');
    if (btn) btn.innerHTML = 'Analisando documento (IA)...';
    setTimeout(() => {
      setNovaPesquisa(prev => ({ ...prev, nome: \`Pesquisa Extraída: \${file.name.replace(/\.[^/.]+$/, "")}\` }));
      setNovasPerguntas([{ id: 'p1', titulo: 'Pergunta Extraída', tipo: 'Induzida', multiSelect: false, opcoes: [{ id: 'o1', nome: 'Opção A (Extraída)', partido: '' }, { id: 'o2', nome: 'Opção B (Extraída)', partido: '' }, { id: 'o3', nome: 'Opção C (Extraída)', partido: '' }] }]);
      if (btn) btn.innerHTML = '<svg class="w-4 h-4 mr-1 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg> Importar Word/PDF (IA)';
      alert('Documento analisado com sucesso pela IA! A pergunta e opções foram preenchidas.');
    }, 2000);
  };`;

const newHandle = `  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const btn = document.getElementById('btn-ai-upload');
    const originalHtml = btn ? btn.innerHTML : '';
    if (btn) btn.innerHTML = 'Extraindo...';
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/extract', { method: 'POST', body: formData });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Erro na extração');
      
      if (data.perguntas && data.perguntas.length > 0) {
         setNovaPesquisa(prev => ({ ...prev, nome: \`Pesquisa: \${file.name.replace(/\\.[^/.]+$/, "")}\` }));
         setNovasPerguntas(data.perguntas);
         alert('Documento organizado em ' + data.perguntas.length + ' perguntas!');
      } else {
         alert('Nenhuma pergunta identificada no documento.');
      }
    } catch (err: any) {
      console.error(err);
      alert('Erro: ' + err.message);
    } finally {
      if (btn) btn.innerHTML = originalHtml;
      e.target.value = '';
    }
  };

  const handlePasteText = async () => {
     const text = prompt('Cole o texto das perguntas e opções aqui:');
     if (!text) return;

     const btn = document.getElementById('btn-paste-text');
     const originalHtml = btn ? btn.innerHTML : '';
     if (btn) btn.innerHTML = 'Extraindo...';

     try {
       const formData = new FormData();
       formData.append('text', text);
       
       const res = await fetch('/api/extract', { method: 'POST', body: formData });
       const data = await res.json();
       
       if (!res.ok) throw new Error(data.error || 'Erro na extração');
       
       if (data.perguntas && data.perguntas.length > 0) {
          setNovaPesquisa(prev => ({ ...prev, nome: \`Pesquisa Importada via Texto\` }));
          setNovasPerguntas(data.perguntas);
          alert('Texto organizado em ' + data.perguntas.length + ' perguntas!');
       } else {
          alert('Nenhuma pergunta identificada no texto.');
       }
     } catch (err: any) {
       console.error(err);
       alert('Erro: ' + err.message);
     } finally {
       if (btn) btn.innerHTML = originalHtml;
     }
  };`;

c = c.replace(oldHandle, newHandle);

const oldUI = `<label id="btn-ai-upload" className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-800 transition-colors bg-indigo-50 px-2 py-1 rounded-md cursor-pointer"><Wand2 className="w-3 h-3" /> Importar Word/PDF (IA)<input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileUpload} /></label>`;

const newUI = `<div className="flex gap-2"><button id="btn-paste-text" onClick={handlePasteText} className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-800 transition-colors bg-indigo-50 px-2 py-1 rounded-md cursor-pointer"><ClipboardList className="w-3 h-3" /> Colar Texto</button><label id="btn-ai-upload" className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-800 transition-colors bg-indigo-50 px-2 py-1 rounded-md cursor-pointer"><Wand2 className="w-3 h-3" /> Importar Word/PDF<input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileUpload} /></label></div>`;

c = c.replace(oldUI, newUI);

fs.writeFileSync(file, c);
