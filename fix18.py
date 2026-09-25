import re
with open('src/app/(dashboard)/admin/pesquisas/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "const [novaPesquisa, setNovaPesquisa] = useState({ nome: '', tipo: 'Intenção de Voto', metaDiaria: 50, exigeMorador: false, idadeMinima: 16 });",
    "const [novaPesquisa, setNovaPesquisa] = useState({ nome: '', tipo: 'Intenção de Voto', metaDiaria: 50, metaEntrevistas: 1000, exigeMorador: false, idadeMinima: 16 });"
)
content = content.replace(
    "setNovaPesquisa({ nome: '', tipo: 'Intenção de Voto', metaDiaria: 50, exigeMorador: false, idadeMinima: 16 });",
    "setNovaPesquisa({ nome: '', tipo: 'Intenção de Voto', metaDiaria: 50, metaEntrevistas: 1000, exigeMorador: false, idadeMinima: 16 });"
)

content = content.replace(
    "metaDiaria: p.metaDiaria || 50,\n      exigeMorador: p.exigeMorador || false,",
    "metaDiaria: p.metaDiaria || 50,\n      metaEntrevistas: p.metaEntrevistas || 1000,\n      exigeMorador: p.exigeMorador || false,"
)

with open('src/app/(dashboard)/admin/pesquisas/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
