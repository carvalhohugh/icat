const fs = require('fs');
const file = 'src/app/(dashboard)/admin/pesquisas/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const injection = `
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
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

`;

// Remove the old handleFileUpload entirely!
c = c.replace(/const handleFileUpload = async[\s\S]*?\}, 2000\);\n  \};/g, "");

// Inject the new functions right before handleSavePesquisa
c = c.replace(/const handleSavePesquisa =/g, injection + "\nconst handleSavePesquisa =");

fs.writeFileSync(file, c);
