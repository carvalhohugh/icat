const fs = require('fs');
const file = 'src/app/(dashboard)/admin/pesquisas/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /\/\/\s*ignore clicks on the action buttons area[\s\S]*?setIsModalOpen\(true\);/;
const replacement = `if ((e.target as HTMLElement).closest('button')) return;
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
    setEntrevSelecionados([...p.entrevistadores]);
    setIsModalOpen(true);`;

content = content.replace(regex, replacement);
fs.writeFileSync(file, content, 'utf8');
