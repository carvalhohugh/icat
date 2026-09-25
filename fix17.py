import re
with open('src/app/(dashboard)/admin/pesquisas/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

new_save = """const handleSavePesquisa = () => {
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

content = re.sub(
    r"const handleSavePesquisa = \(\) => \{.*?setIsModalOpen\(false\);\n\s*\};",
    new_save,
    content, flags=re.DOTALL
)

with open('src/app/(dashboard)/admin/pesquisas/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
