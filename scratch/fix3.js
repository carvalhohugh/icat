const fs = require('fs');
const file = 'src/app/(dashboard)/admin/pesquisas/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const bad = `if (e.target.closest('button')) return;
    setEditandoId(p.id);
    setNome(p.nome);
    setTipo(p.tipo);
    setStatus(p.status);
    setInduzida(p.induzida);
    setMultiSelect(p.multiSelect || false);
    setExigeMorador(p.exigeMorador || false);
    setIdadeMinima(p.idadeMinima?.toString() || '');
    setMetaDiaria(p.metaDiaria || 50);
    setMetaEntrevistas(p.metaEntrevistas || 1000);
    setOpcoes([...p.opcoes]);`;

const good = `if ((e.target as HTMLElement).closest('button')) return;
    setEditandoId(p.id);
    setNovaPesquisa({
      nome: p.nome,
      tipo: p.tipo,
      induzida: p.induzida,
      multiSelect: p.multiSelect || false,
      metaDiaria: p.metaDiaria || 50,
      metaEntrevistas: p.metaEntrevistas || 1000,
      exigeMorador: p.exigeMorador || false,
      idadeMinima: p.idadeMinima || 16
    });
    setNovasOpcoes(p.opcoes.map(o => ({ nome: o.nome, partido: o.partido || '', foto: o.foto || '' })));
    setEntrevSelecionados([...p.entrevistadores]);`;

content = content.replace(bad, good);

fs.writeFileSync(file, content, 'utf8');
