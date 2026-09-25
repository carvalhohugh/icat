const fs = require('fs');
const file = 'src/app/(dashboard)/admin/pesquisas/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix handleSavePesquisa
const oldSaveLogic = `  const handleSavePesquisa = () => {
    if (!novaPesquisa.nome || novasOpcoes.filter(o => o.nome.trim()).length < 2) return;
    const payload = {
      nome: novaPesquisa.nome, tipo: novaPesquisa.tipo,
      status: 'Ativa', induzida: novaPesquisa.induzida,
      metaEntrevistas: novaPesquisa.metaEntrevistas,
      exigeMorador: novaPesquisa.exigeMorador,
      idadeMinima: novaPesquisa.idadeMinima,
      opcoes: novasOpcoes.filter(o => o.nome.trim()).map(o => ({ nome: o.nome.trim(), partido: o.partido.trim() || undefined, votos: 0, foto: o.foto })),
      entrevistadores: entrevSelecionados,
    };
    if (editandoId) {
      updatePesquisa(editandoId, payload);
    } else {
      addPesquisa(payload as Omit<Pesquisa, 'id' | 'respostas'>);
    }
    setEditandoId(null);
    setNovaPesquisa({ nome: '', tipo: 'Intenção de Voto', induzida: true, multiSelect: false, metaDiaria: 50, metaEntrevistas: 1000, exigeMorador: false, idadeMinima: 16 });
    setNovasOpcoes([{nome: '', partido: ''}, {nome: '', partido: ''}]);
    setEntrevSelecionados([]);
    setIsModalOpen(false);
  };`;

const newSaveLogic = `  const handleSavePesquisa = () => {
    if (!novaPesquisa.nome || novasPerguntas.length === 0) return;
    const payload = {
      nome: novaPesquisa.nome, tipo: novaPesquisa.tipo,
      status: 'Ativa', induzida: true,
      metaEntrevistas: novaPesquisa.metaEntrevistas,
      exigeMorador: novaPesquisa.exigeMorador,
      idadeMinima: novaPesquisa.idadeMinima,
      perguntas: novasPerguntas.map(p => ({
        id: p.id,
        titulo: p.titulo.trim(),
        tipo: p.tipo,
        multiSelect: p.multiSelect,
        opcoes: p.opcoes.filter(o => o.nome.trim()).map(o => ({ id: o.id, nome: o.nome.trim(), partido: o.partido.trim() || undefined, votos: 0 }))
      })),
      entrevistadores: entrevSelecionados,
    };
    if (editandoId) {
      updatePesquisa(editandoId, payload);
    } else {
      addPesquisa(payload as Omit<Pesquisa, 'id' | 'respostas'>);
    }
    setEditandoId(null);
    setNovaPesquisa({ nome: '', tipo: 'Intenção de Voto', metaDiaria: 50, metaEntrevistas: 1000, exigeMorador: false, idadeMinima: 16 });
    setNovasPerguntas([{id: 'p1', titulo: '', tipo: 'Induzida', multiSelect: false, opcoes: [{id: 'o1', nome: '', partido: ''}, {id: 'o2', nome: '', partido: ''}]}]);
    setEntrevSelecionados([]);
    setIsModalOpen(false);
  };`;
  
content = content.replace(/const handleSavePesquisa = \(\) => \{[\s\S]*?setIsModalOpen\(false\);\s*\};/, newSaveLogic);

// 2. Fix the Modal UI that uses "novasOpcoes"
const oldModalUI = `<div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700">Opções de Resposta</label>
                    <button
                      className="text-xs flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-3 py-1.5 rounded-lg transition-colors"
                      onClick={async (e) => {
                        const btn = e.currentTarget;
                        if(btn) btn.innerHTML = 'Buscando...';
                        const { mockAiGenerator } = await import('@/lib/ai-generator');
                        const aiOptions = await mockAiGenerator.generateSurveyOptions(novaPesquisa.nome);
                        setNovasOpcoes(aiOptions);
                        if(btn) btn.innerHTML = '<svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg> Sugerir Opções com IA';
                      }}
                      id="btn-ai-pesquisa"
                    >
                      <svg className="w-3 h-3 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg> Sugerir Opções com IA
                    </button>
                  </div>
                  <div className="space-y-2">
                    {novasOpcoes.map((op, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className={\`w-4 h-4 rounded-full flex-shrink-0 \${CORES[i % CORES.length]}\`}></span>
                        <input type="text" value={op.nome} onChange={e => { const arr = [...novasOpcoes]; arr[i].nome = e.target.value; setNovasOpcoes(arr); }} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none text-sm" placeholder={\`Opção \${i + 1}\`} />
                        <input type="text" value={op.partido} onChange={e => { const arr = [...novasOpcoes]; arr[i].partido = e.target.value; setNovasOpcoes(arr); }} className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none text-sm" placeholder="Partido" />
                        {novasOpcoes.length > 2 && <button onClick={() => setNovasOpcoes(novasOpcoes.filter((_, j) => j !== i))} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setNovasOpcoes([...novasOpcoes, {nome: '', partido: ''}])} className="mt-2 text-sm text-icat-blue font-semibold hover:underline flex items-center gap-1"><Plus className="w-4 h-4" /> Adicionar Opção</button>
                </div>`;

const newModalUI = `<div className="space-y-6">
                  {novasPerguntas.map((perg, pIdx) => (
                    <div key={perg.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Título da Pergunta {pIdx + 1}</label>
                            <input type="text" value={perg.titulo} onChange={e => { const arr = [...novasPerguntas]; arr[pIdx].titulo = e.target.value; setNovasPerguntas(arr); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none font-medium" placeholder="Ex: Em quem você votaria?" />
                          </div>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                              <input type="radio" checked={perg.tipo === 'Induzida'} onChange={() => { const arr = [...novasPerguntas]; arr[pIdx].tipo = 'Induzida'; setNovasPerguntas(arr); }} className="w-4 h-4 text-icat-green" />
                              Induzida (Mostrar Opções)
                            </label>
                            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                              <input type="radio" checked={perg.tipo === 'Espontânea'} onChange={() => { const arr = [...novasPerguntas]; arr[pIdx].tipo = 'Espontânea'; setNovasPerguntas(arr); }} className="w-4 h-4 text-icat-green" />
                              Espontânea (Campo Livre)
                            </label>
                            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer ml-auto">
                              <input type="checkbox" checked={perg.multiSelect} onChange={(e) => { const arr = [...novasPerguntas]; arr[pIdx].multiSelect = e.target.checked; setNovasPerguntas(arr); }} className="w-4 h-4 rounded text-icat-green focus:ring-icat-green" />
                              Permitir Multi-Seleção
                            </label>
                          </div>
                        </div>
                        {novasPerguntas.length > 1 && (
                          <button onClick={() => setNovasPerguntas(novasPerguntas.filter((_, j) => j !== pIdx))} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-5 h-5" /></button>
                        )}
                      </div>

                      <div className="pl-4 border-l-2 border-gray-200 space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Opções de Resposta</label>
                        {perg.opcoes.map((op, oIdx) => (
                          <div key={op.id} className="flex items-center gap-2">
                            <span className={\`w-3 h-3 rounded-full flex-shrink-0 \${CORES[oIdx % CORES.length]}\`}></span>
                            <input type="text" value={op.nome} onChange={e => { const arr = [...novasPerguntas]; arr[pIdx].opcoes[oIdx].nome = e.target.value; setNovasPerguntas(arr); }} className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none text-sm" placeholder={\`Opção \${oIdx + 1}\`} />
                            <input type="text" value={op.partido} onChange={e => { const arr = [...novasPerguntas]; arr[pIdx].opcoes[oIdx].partido = e.target.value; setNovasPerguntas(arr); }} className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none text-sm" placeholder="Partido" />
                            {perg.opcoes.length > 2 && <button onClick={() => { const arr = [...novasPerguntas]; arr[pIdx].opcoes = arr[pIdx].opcoes.filter((_, j) => j !== oIdx); setNovasPerguntas(arr); }} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>}
                          </div>
                        ))}
                        <button onClick={() => { const arr = [...novasPerguntas]; arr[pIdx].opcoes.push({id: \`o\${Date.now()}\`, nome: '', partido: ''}); setNovasPerguntas(arr); }} className="mt-2 text-xs text-icat-blue font-semibold hover:underline flex items-center gap-1"><Plus className="w-3 h-3" /> Adicionar Opção</button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setNovasPerguntas([...novasPerguntas, {id: \`p\${Date.now()}\`, titulo: '', tipo: 'Induzida', multiSelect: false, opcoes: [{id: \`o\${Date.now()}1\`, nome: '', partido: ''}, {id: \`o\${Date.now()}2\`, nome: '', partido: ''}]}])} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-semibold hover:border-icat-green hover:text-icat-green transition-colors flex items-center justify-center gap-2"><Plus className="w-5 h-5" /> Adicionar Nova Pergunta (Google Forms)</button>
                </div>`;

content = content.replace(/<div className="space-y-4">[\s\S]*?<button onClick=\{\(\) => setNovasOpcoes[\s\S]*?<\/div>/, newModalUI);

// 3. Fix the "slice" bug on dashboard rendering by replacing the exact line from the error:
content = content.replace(/\{p\.opcoes\.slice\(0, 3\)\.map/g, '{(p.perguntas?.[0]?.opcoes || p.opcoes || []).slice(0, 3).map');
content = content.replace(/p\.opcoes\.length > 3/g, '(p.perguntas?.[0]?.opcoes || p.opcoes || []).length > 3');
content = content.replace(/p\.opcoes\.length - 3/g, '(p.perguntas?.[0]?.opcoes || p.opcoes || []).length - 3');

fs.writeFileSync(file, content, 'utf8');
