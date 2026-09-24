const fs = require('fs');
const file = 'src/app/(dashboard)/admin/pesquisas/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove setEditandoId is not defined error by actually declaring it
if (!content.includes('const [editandoId, setEditandoId] = useState<number | null>(null);')) {
    content = content.replace(
        /const \[isModalOpen, setIsModalOpen\] = useState\(false\);/,
        `const [isModalOpen, setIsModalOpen] = useState(false);\n  const [editandoId, setEditandoId] = useState<number | null>(null);`
    );
}

// 2. Fix the click handler to use setNovaPesquisa instead of individual setters which don't exist
const badClickHandler = `onClick={(e) => {
    // ignore clicks on the action buttons area
    if (e.target.closest('button')) return;
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
    setOpcoes([...p.opcoes]);
    setIsModalOpen(true);
  }}`;

const goodClickHandler = `onClick={(e) => {
    if (e.target.closest('button')) return;
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
    setIsModalOpen(true);
  }}`;

content = content.replace(badClickHandler, goodClickHandler);

// 3. Fix handleSavePesquisa to use updatePesquisa if editandoId is present
// We need to import updatePesquisa first
if (!content.includes('updatePesquisa')) {
    content = content.replace(/addPesquisa, deletePesquisa/, 'addPesquisa, deletePesquisa, updatePesquisa');
}

const badSave = `addPesquisa({
        nome: novaPesquisa.nome, tipo: novaPesquisa.tipo,
        status: 'Ativa', induzida: novaPesquisa.induzida,
        multiSelect: novaPesquisa.multiSelect,
        metaDiaria: novaPesquisa.metaDiaria,
        exigeMorador: novaPesquisa.exigeMorador,
        idadeMinima: novaPesquisa.idadeMinima,
        opcoes: novasOpcoes.filter(o => o.nome.trim()).map(o => ({ nome: o.nome.trim(), partido: o.partido.trim() || undefined, votos: 0, foto: o.foto })),
        entrevistadores: entrevSelecionados,
      metaDiaria, metaEntrevistas });`;

// Actually the previous patch might have resulted in messy `metaDiaria, metaEntrevistas })`
content = content.replace(/addPesquisa\(\{[\s\S]*?entrevistadores: entrevSelecionados,\s*(?:metaDiaria,\s*metaEntrevistas\s*)?\}\);/, `const payload = {
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
      }`);

// Fix missing setMetaEntrevistas logic when adding a new survey
content = content.replace(
    /setIsModalOpen\(true\)\}/,
    `setEditandoId(null); setNovaPesquisa({ nome: '', tipo: 'Intenção de Voto', induzida: true, multiSelect: false, metaDiaria: 50, metaEntrevistas: 1000, exigeMorador: false, idadeMinima: 16 }); setNovasOpcoes([{nome: '', partido: ''}, {nome: '', partido: ''}]); setEntrevSelecionados([]); setIsModalOpen(true);}`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed edit state crash!');
