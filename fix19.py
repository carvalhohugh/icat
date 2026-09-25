import re
with open('src/app/(dashboard)/admin/pesquisas/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "setNovasOpcoes([\n        { nome: 'Opção A (Extraída)', partido: '' },\n        { nome: 'Opção B (Extraída)', partido: '' },\n        { nome: 'Opção C (Extraída)', partido: '' },\n      ]);",
    "setNovasPerguntas([{ id: 'p1', titulo: 'Pergunta Extraída', tipo: 'Induzida', multiSelect: false, opcoes: [{ id: 'o1', nome: 'Opção A (Extraída)', partido: '' }, { id: 'o2', nome: 'Opção B (Extraída)', partido: '' }, { id: 'o3', nome: 'Opção C (Extraída)', partido: '' }] }]);"
)

with open('src/app/(dashboard)/admin/pesquisas/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
