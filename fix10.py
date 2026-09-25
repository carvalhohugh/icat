import re
with open('src/app/(dashboard)/admin/pesquisas/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

edit_old = """    setNome(p.nome);
    setTipo(p.tipo);
    setStatus(p.status);
    setInduzida(p.induzida);
    setMultiSelect(p.multiSelect || false);
    setExigeMorador(p.exigeMorador || false);
    setIdadeMinima(p.idadeMinima?.toString() || '');
    setMetaDiaria(p.metaDiaria || 50);
    setMetaEntrevistas(p.metaEntrevistas || 1000);
    setOpcoes([...p.opcoes]);"""

edit_new = """    setNovaPesquisa({
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

content = content.replace(edit_old, edit_new)

with open('src/app/(dashboard)/admin/pesquisas/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
