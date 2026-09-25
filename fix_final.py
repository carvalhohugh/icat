import re
import os

with open('src/app/(dashboard)/admin/pesquisas/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. State change
content = content.replace(
    "const [novaPesquisa, setNovaPesquisa] = useState({ nome: '', tipo: 'Intenção de Voto', induzida: true, multiSelect: false, metaDiaria: 50, metaEntrevistas: 1000, exigeMorador: false, idadeMinima: 16 });",
    "const [novaPesquisa, setNovaPesquisa] = useState({ nome: '', tipo: 'Intenção de Voto', metaDiaria: 50, metaEntrevistas: 1000, exigeMorador: false, idadeMinima: 16 });"
)
content = content.replace(
    "const [novasOpcoes, setNovasOpcoes] = useState<{nome: string; partido: string; foto?: string}[]>([{nome: '', partido: ''}, {nome: '', partido: ''}]);",
    "const [novasPerguntas, setNovasPerguntas] = useState<{id: string, titulo: string, tipo: 'Espontânea' | 'Induzida', multiSelect: boolean, opcoes: {id: string, nome: string, partido: string}[]}[]>([{id: 'p1', titulo: '', tipo: 'Induzida', multiSelect: false, opcoes: [{id: 'o1', nome: '', partido: ''}, {id: 'o2', nome: '', partido: ''}]}]);"
)

# 2. handleSavePesquisa
old_save = """  const handleSavePesquisa = () => {
    if (!novaPesquisa.nome || novasOpcoes.filter(o => o.nome.trim()).length < 2) return;
    const payload = {
      nome: novaPesquisa.nome, tipo: novaPesquisa.tipo,
      status: 'Ativa', induzida: novaPesquisa.induzida,
      multiSelect: novaPesquisa.multiSelect,
      metaDiaria: novaPesquisa.metaDiaria,
      metaEntrevistas: novaPesquisa.metaEntrevistas,
      exigeMorador: novaPesquisa.exigeMorador,
      idadeMinima: novaPesquisa.idadeMinima,
      opcoes: novasOpcoes.filter(o => o.nome.trim()).map(o => ({ nome: o.nome.trim(), partido: o.partido.trim() || undefined, votos: 0, foto: o.foto })),
      entrevistadores: entrevSelecionados,
    };
    if (editandoId) {
      updatePesquisa(editandoId, payload);
    } else {
      addPesquisa(payload);
    }
    setEditandoId(null);
    setNovaPesquisa({ nome: '', tipo: 'Intenção de Voto', induzida: true, multiSelect: false, metaDiaria: 50, metaEntrevistas: 1000, exigeMorador: false, idadeMinima: 16 });
    setNovasOpcoes([{nome: '', partido: ''}, {nome: '', partido: ''}]);
    setEntrevSelecionados([]);
    setIsModalOpen(false);
  };"""

new_save = """  const handleSavePesquisa = () => {
    if (!novaPesquisa.nome) return;
    const payload = {
      nome: novaPesquisa.nome, tipo: novaPesquisa.tipo,
      status: 'Ativa', 
      metaDiaria: novaPesquisa.metaDiaria,
      metaEntrevistas: novaPesquisa.metaEntrevistas,
      exigeMorador: novaPesquisa.exigeMorador,
      idadeMinima: novaPesquisa.idadeMinima,
      perguntas: novasPerguntas.map(p => ({
        ...p,
        opcoes: p.opcoes.filter(o => o.nome.trim()).map(o => ({ id: o.id || `o${Date.now()}_${Math.random()}`, nome: o.nome.trim(), partido: o.partido.trim() || undefined, votos: 0 }))
      })),
      entrevistadores: entrevSelecionados,
    };
    if (editandoId) {
      import('@/lib/pesquisas-store').then(mod => { mod.updatePesquisa(editandoId, payload as any); setPesquisas(mod.getPesquisas()); });
    } else {
      import('@/lib/pesquisas-store').then(mod => { mod.addPesquisa(payload as any); setPesquisas(mod.getPesquisas()); });
    }
    setEditandoId(null);
    setNovaPesquisa({ nome: '', tipo: 'Intenção de Voto', metaDiaria: 50, metaEntrevistas: 1000, exigeMorador: false, idadeMinima: 16 });
    setNovasPerguntas([{id: 'p1', titulo: '', tipo: 'Induzida', multiSelect: false, opcoes: [{id: 'o1', nome: '', partido: ''}]}]);
    setEntrevSelecionados([]);
    setIsModalOpen(false);
  };"""
content = content.replace(old_save, new_save)

# 3. Handle File Upload (IA)
old_ia = """setNovaPesquisa(prev => ({ ...prev, nome: `Pesquisa Extraída: ${file.name.replace(/\.[^/.]+$/, "")}` }));
      setNovasOpcoes([
        { nome: 'Opção A (Extraída)', partido: '' },
        { nome: 'Opção B (Extraída)', partido: '' },
        { nome: 'Opção C (Extraída)', partido: '' },
      ]);"""

new_ia = """setNovaPesquisa(prev => ({ ...prev, nome: `Pesquisa Extraída: ${file.name.replace(/\.[^/.]+$/, "")}` }));
      setNovasPerguntas([{id: `p${Date.now()}`, titulo: 'Pergunta Extraída 1', tipo: 'Induzida', multiSelect: false, opcoes: [{id: 'o1', nome: 'Opção A', partido: ''}, {id: 'o2', nome: 'Opção B', partido: ''}]}]);"""
content = content.replace(old_ia, new_ia)

# 4. setNovaPesquisa callers
content = content.replace(
    "setNovaPesquisa({ nome: '', tipo: 'Intenção de Voto', induzida: true, multiSelect: false, metaDiaria: 50, metaEntrevistas: 1000, exigeMorador: false, idadeMinima: 16 });",
    "setNovaPesquisa({ nome: '', tipo: 'Intenção de Voto', metaDiaria: 50, metaEntrevistas: 1000, exigeMorador: false, idadeMinima: 16 });"
)
content = content.replace(
    "setNovasOpcoes([{nome: '', partido: ''}, {nome: '', partido: ''}]);",
    "setNovasPerguntas([{id: 'p1', titulo: '', tipo: 'Induzida', multiSelect: false, opcoes: [{id: 'o1', nome: '', partido: ''}, {id: 'o2', nome: '', partido: ''}]}]);"
)

# Edit click
old_edit = """    setNovaPesquisa({
      nome: p.nome,
      tipo: p.tipo,
      induzida: p.induzida,
      multiSelect: p.multiSelect || false,
      metaDiaria: p.metaDiaria || 50,
      metaEntrevistas: p.metaEntrevistas || 1000,
      exigeMorador: p.exigeMorador || false,
      idadeMinima: p.idadeMinima || 16
    });
    setNovasOpcoes(p.opcoes.map(o => ({ nome: o.nome, partido: o.partido || '', foto: o.foto || '' })));"""

new_edit = """    setNovaPesquisa({
      nome: p.nome,
      tipo: p.tipo,
      metaDiaria: p.metaDiaria || 50,
      metaEntrevistas: p.metaEntrevistas || 1000,
      exigeMorador: p.exigeMorador || false,
      idadeMinima: p.idadeMinima || 16
    });
    if (p.perguntas && p.perguntas.length > 0) {
      setNovasPerguntas(p.perguntas.map(perg => ({
        id: perg.id, titulo: perg.titulo, tipo: perg.tipo, multiSelect: perg.multiSelect,
        opcoes: perg.opcoes.map(o => ({ id: o.id, nome: o.nome, partido: o.partido || '' }))
      })));
    } else if (p.opcoes) {
      setNovasPerguntas([{
        id: 'legacy', titulo: p.nome, tipo: p.induzida ? 'Induzida' : 'Espontânea', multiSelect: p.multiSelect || false,
        opcoes: p.opcoes.map(o => ({ id: o.id || Math.random().toString(), nome: o.nome, partido: o.partido || '' }))
      }]);
    }"""
content = content.replace(old_edit, new_edit)

# Modal UI Replacement
# Find from <div className="grid grid-cols-3 gap-4"> up to setNovasOpcoes(aiOptions)
modal_old_regex = r'<div className="grid grid-cols-3 gap-4">.*?<div className="space-y-2">\s*\{novasOpcoes\.map\(.*?Adicionar Opção</button>\s*</div>\s*</div>'
modal_new = """<div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select value={novaPesquisa.tipo} onChange={e => setNovaPesquisa({ ...novaPesquisa, tipo: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none">
                    <option>Intenção de Voto</option><option>Opinião</option><option>Enquete</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Diária</label>
                  <input type="number" min="1" value={novaPesquisa.metaDiaria} onChange={e => setNovaPesquisa({ ...novaPesquisa, metaDiaria: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-gray-900">Perguntas ({novasPerguntas.length})</h3>
                  <button type="button" onClick={() => setNovasPerguntas([...novasPerguntas, {id: `p${Date.now()}`, titulo: '', tipo: 'Induzida', multiSelect: false, opcoes: [{id: `o${Date.now()}_1`, nome: '', partido: ''}]}])} className="text-sm font-medium text-icat-blue hover:underline flex items-center gap-1"><Plus className="w-4 h-4" /> Nova Pergunta</button>
                </div>
                
                {novasPerguntas.map((perg, pIdx) => (
                  <div key={perg.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 space-y-3">
                        <input type="text" value={perg.titulo} onChange={e => { const arr = [...novasPerguntas]; arr[pIdx].titulo = e.target.value; setNovasPerguntas(arr); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none text-sm font-medium" placeholder="Ex: Em quem você votaria?" />
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={perg.multiSelect} onChange={e => { const arr = [...novasPerguntas]; arr[pIdx].multiSelect = e.target.checked; setNovasPerguntas(arr); }} className="rounded" />
                            Múltipla escolha
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <select value={perg.tipo} onChange={e => { const arr = [...novasPerguntas]; arr[pIdx].tipo = e.target.value as any; setNovasPerguntas(arr); }} className="border-gray-300 rounded px-2 py-1 outline-none">
                              <option value="Induzida">Induzida</option>
                              <option value="Espontânea">Espontânea</option>
                            </select>
                          </label>
                        </div>
                      </div>
                      {novasPerguntas.length > 1 && (
                        <button type="button" onClick={() => setNovasPerguntas(novasPerguntas.filter((_, i) => i !== pIdx))} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 className="w-4 h-4" /></button>
                      )}
                    </div>
                    
                    <div className="pl-4 border-l-2 border-gray-200 space-y-2">
                      <label className="block text-xs font-medium text-gray-500">Opções:</label>
                      {perg.opcoes.map((op, oIdx) => (
                        <div key={op.id} className="flex items-center gap-2">
                          <input type="text" value={op.nome} onChange={e => { const arr = [...novasPerguntas]; arr[pIdx].opcoes[oIdx].nome = e.target.value; setNovasPerguntas(arr); }} className="flex-1 px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-icat-green outline-none text-sm" placeholder={`Opção ${oIdx + 1}`} />
                          <input type="text" value={op.partido} onChange={e => { const arr = [...novasPerguntas]; arr[pIdx].opcoes[oIdx].partido = e.target.value; setNovasPerguntas(arr); }} className="w-20 px-2 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-icat-green outline-none text-sm" placeholder="Partido" />
                          {perg.opcoes.length > 1 && <button type="button" onClick={() => { const arr = [...novasPerguntas]; arr[pIdx].opcoes = arr[pIdx].opcoes.filter((_, i) => i !== oIdx); setNovasPerguntas(arr); }} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>}
                        </div>
                      ))}
                      <button type="button" onClick={() => { const arr = [...novasPerguntas]; arr[pIdx].opcoes.push({id: `o${Date.now()}_${Math.random()}`, nome: '', partido: ''}); setNovasPerguntas(arr); }} className="text-icat-green text-xs font-medium hover:underline flex items-center gap-1 mt-1"><Plus className="w-3 h-3" /> Opção</button>
                    </div>
                    <div className="pt-2 text-right">
                      <button type="button" onClick={async () => {
                        if(!novaPesquisa.nome) return alert('Digite o Nome da Pesquisa primeiro para a IA buscar as opções!');
                        const { mockAiGenerator } = await import('@/lib/ai-generator');
                        const aiOptions = await mockAiGenerator.generateSurveyOptions(novaPesquisa.nome);
                        const arr = [...novasPerguntas];
                        arr[pIdx].opcoes = aiOptions.map((o:any) => ({id: `o${Date.now()}_${Math.random()}`, nome: o.nome, partido: o.partido || ''}));
                        setNovasPerguntas(arr);
                      }} className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-800 transition-colors bg-indigo-50 px-2 py-1 rounded-md inline-flex"><Wand2 className="w-3 h-3" /> Sugerir Opções IA</button>
                    </div>
                  </div>
                ))}
              </div>"""

content = re.sub(modal_old_regex, modal_new.replace('\\', '\\\\'), content, flags=re.DOTALL)

# P.opcoes handling
content = content.replace("p.opcoes.slice", "(p.perguntas?.[0]?.opcoes || p.opcoes || []).slice")
content = content.replace("p.opcoes.length", "(p.perguntas?.[0]?.opcoes || p.opcoes || []).length")

# Resultados total
content = content.replace("const totalVotos = pesquisaResultado?.opcoes.reduce((s, o) => s + o.votos, 0) || 0;", "const totalVotos = pesquisaResultado?.respostas?.length || 0;")
content = content.replace("const topOpcao = pesquisaResultado && totalVotos > 0 ? pesquisaResultado.opcoes.reduce((prev, current) => (prev.votos > current.votos) ? prev : current) : null;", "")

# Results UI
results_old_regex = r'<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">.*?Nenhum voto computado para candidatos ainda\.</p>\s*\);\s*\}\)\(\)\}\s*</div>\s*</div>'

results_new = """<div className="space-y-8 mb-8">
                  {pesquisaResultado.perguntas?.map((perg, pIdx) => {
                    const totalRespostas = perg.opcoes.reduce((s, o) => s + o.votos, 0);
                    const opcoesOrdenadas = [...perg.opcoes].sort((a, b) => b.votos - a.votos);
                    
                    return (
                      <div key={perg.id} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-4 border-b pb-2">Pergunta {pIdx + 1}: {perg.titulo}</h4>
                          {opcoesOrdenadas.map((o, i) => {
                            const perc = totalRespostas > 0 ? ((o.votos / totalRespostas) * 100).toFixed(1) : '0.0';
                            return (
                              <div key={i} className="relative">
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="font-medium text-gray-800">{o.nome} {o.partido && <span className="text-gray-400 text-xs font-normal">({o.partido})</span>}</span>
                                  <span className="font-bold text-gray-900">{perc}% <span className="text-gray-400 font-normal ml-1">({o.votos})</span></span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                  <div className={`h-2.5 rounded-full ${CORES[i % CORES.length]}`} style={{ width: `${perc}%` }}></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        {perg.tipo === 'Induzida' && (
                          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 flex flex-col justify-center items-center text-center">
                            <BarChart3 className="w-12 h-12 text-icat-green mb-3 opacity-20" />
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Líder: {perg.titulo.substring(0, 20)}...</h4>
                            {(() => {
                              const validVotes = perg.opcoes.filter(o => o.nome.toLowerCase() !== 'branco/nulo' && o.nome.toLowerCase() !== 'não sabe' && o.nome.toLowerCase() !== 'indeciso').reduce((sum, o) => sum + o.votos, 0);
                              const topOpc = opcoesOrdenadas[0];
                              const isTopOpcaoValid = topOpc && topOpc.nome.toLowerCase() !== 'branco/nulo' && topOpc.nome.toLowerCase() !== 'não sabe' && topOpc.nome.toLowerCase() !== 'indeciso';
                              
                              return topOpc && topOpc.votos > 0 && isTopOpcaoValid ? (
                                <>
                                  <p className="text-2xl font-black text-gray-900 mb-1">{topOpc.nome}</p>
                                  <div className="flex flex-col gap-1 items-center">
                                    <span className="text-icat-green font-bold bg-green-50 px-3 py-1 rounded-full text-sm inline-block">
                                      {((topOpc.votos / totalRespostas) * 100).toFixed(1)}% (Total)
                                    </span>
                                    {validVotes > 0 && (
                                      <span className="text-blue-700 font-bold bg-blue-50 px-3 py-1 rounded-full text-sm inline-block">
                                        {((topOpc.votos / validVotes) * 100).toFixed(1)}% dos Votos Válidos
                                      </span>
                                    )}
                                  </div>
                                </>
                              ) : (
                                <p className="text-gray-400 text-sm">Nenhum voto computado ainda.</p>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>"""
content = re.sub(results_old_regex, results_new.replace('\\', '\\\\'), content, flags=re.DOTALL)

# Demographics Fix
demo_old = """                            const contagem = {} as Record<number, number>;
                            votosNaFaixa.forEach(r => {
                              r.opcaoIdxs.forEach(idx => contagem[idx] = (contagem[idx] || 0) + 1);
                            });
                            
                            // Acha vencedor
                            const vencedorIdx = Object.keys(contagem).reduce((a, b) => contagem[Number(a)] > contagem[Number(b)] ? a : b, Object.keys(contagem)[0]);
                            const vencedorNome = pesquisaResultado.opcoes[Number(vencedorIdx)]?.nome || 'N/A';
                            const perc = ((contagem[Number(vencedorIdx)] / votosNaFaixa.length) * 100).toFixed(1);"""

demo_new = """                            const contagem = {} as Record<string, number>;
                            votosNaFaixa.forEach(r => {
                              r.respostas?.[0]?.opcaoIds?.forEach((id: string) => contagem[id] = (contagem[id] || 0) + 1);
                            });
                            
                            // Acha vencedor
                            const keys = Object.keys(contagem);
                            const vencedorId = keys.length > 0 ? keys.reduce((a, b) => contagem[a] > contagem[b] ? a : b, keys[0]) : null;
                            const vencedorNome = (vencedorId && pesquisaResultado.perguntas?.[0]?.opcoes.find(o => o.id === vencedorId)?.nome) || 'N/A';
                            const perc = vencedorId ? ((contagem[vencedorId] / votosNaFaixa.length) * 100).toFixed(1) : '0.0';"""

content = content.replace(demo_old, demo_new)

# Simular 2o turno
content = re.sub(
    r"pesquisaResultado\.opcoes\.length\s*>\s*2",
    "(pesquisaResultado.perguntas?.[0]?.opcoes?.length || 0) > 2",
    content
)

content = re.sub(
    r"const candidatos = \[\.\.\.pesquisaResultado\.opcoes\]",
    "const candidatos = [...(pesquisaResultado.perguntas?.[0]?.opcoes || [])]",
    content
)

simulacao_old = r"""opcoes:\s*\[\s*\{\s*nome:\s*c1\.nome,\s*partido:\s*c1\.partido,\s*votos:\s*0\s*\},.*?entrevistadores:\s*pesquisaResultado\.entrevistadores\s*\}\);"""

simulacao_new = """perguntas: [{
                              id: `p${Date.now()}`,
                              titulo: 'Se as eleições fossem hoje, em quem você votaria no 2º turno?',
                              tipo: 'Induzida',
                              multiSelect: false,
                              opcoes: [
                                { id: 'o1', nome: c1.nome, partido: c1.partido, votos: 0 },
                                { id: 'o2', nome: c2.nome, partido: c2.partido, votos: 0 },
                                { id: 'o3', nome: 'Branco/Nulo', partido: '', votos: 0 },
                                { id: 'o4', nome: 'Não Sabe', partido: '', votos: 0 }
                              ]
                            }],
                            entrevistadores: pesquisaResultado.entrevistadores
                          } as any);"""
content = re.sub(simulacao_old, simulacao_new.replace('\\', '\\\\'), content, flags=re.DOTALL)

with open('src/app/(dashboard)/admin/pesquisas/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
