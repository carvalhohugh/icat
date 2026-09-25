import re

with open('src/app/(dashboard)/admin/pesquisas/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the states
content = re.sub(
    r"const \[novaPesquisa, setNovaPesquisa\] = useState\(\{.*?\}\);",
    "const [novaPesquisa, setNovaPesquisa] = useState({ nome: '', tipo: 'Intenção de Voto', metaDiaria: 50, metaEntrevistas: 1000, exigeMorador: false, idadeMinima: 16 });",
    content, flags=re.DOTALL
)

content = re.sub(
    r"const \[novasOpcoes, setNovasOpcoes\] = useState.*?\]\);",
    "const [novasPerguntas, setNovasPerguntas] = useState<{id: string, titulo: string, tipo: 'Espontânea' | 'Induzida', multiSelect: boolean, opcoes: {id: string, nome: string, partido: string}[]}[]>([{id: 'p1', titulo: '', tipo: 'Induzida', multiSelect: false, opcoes: [{id: 'o1', nome: '', partido: ''}, {id: 'o2', nome: '', partido: ''}]}]);",
    content, flags=re.DOTALL
)

# And clear the old setters
content = re.sub(
    r"setNovaPesquisa\(\{.*?nome: '',.*?\}\);",
    "setNovaPesquisa({ nome: '', tipo: 'Intenção de Voto', metaDiaria: 50, metaEntrevistas: 1000, exigeMorador: false, idadeMinima: 16 });",
    content, flags=re.DOTALL
)
content = re.sub(
    r"setNovasOpcoes\(\[.*?\]\);",
    "setNovasPerguntas([{id: 'p1', titulo: '', tipo: 'Induzida', multiSelect: false, opcoes: [{id: 'o1', nome: '', partido: ''}, {id: 'o2', nome: '', partido: ''}]}]);",
    content, flags=re.DOTALL
)

with open('src/app/(dashboard)/admin/pesquisas/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
