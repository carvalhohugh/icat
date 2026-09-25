with open('src/app/(dashboard)/admin/pesquisas/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("setNovaPesquisa({ nome: '', tipo: 'Intenção de Voto', induzida: true, multiSelect: false, metaDiaria: 50, metaEntrevistas: 1000, exigeMorador: false, idadeMinima: 16 });", "setNovaPesquisa({ nome: '', tipo: 'Intenção de Voto', metaDiaria: 50, metaEntrevistas: 1000, exigeMorador: false, idadeMinima: 16 });")
content = content.replace("setNovasOpcoes([{nome: '', partido: ''}, {nome: '', partido: ''}]);", "setNovasPerguntas([{id: 'p1', titulo: '', tipo: 'Induzida', multiSelect: false, opcoes: [{id: 'o1', nome: '', partido: ''}, {id: 'o2', nome: '', partido: ''}]}]);")

with open('src/app/(dashboard)/admin/pesquisas/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
