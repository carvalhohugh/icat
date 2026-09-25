import re
with open('src/app/(dashboard)/admin/pesquisas/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace setNovasOpcoes(aiOptions)
content = content.replace(
    "setNovasOpcoes(aiOptions);",
    "setNovasPerguntas([{id: `p${Date.now()}`, titulo: novaPesquisa.nome, tipo: 'Induzida', multiSelect: false, opcoes: aiOptions.map((o: any) => ({id: `o${Date.now()}_${Math.random()}`, nome: o.nome, partido: o.partido || ''}))}]);"
)

# Are there any other setNovasOpcoes? Let me wipe them all if there are others.
content = re.sub(
    r'<div className="space-y-2">\s*\{novasOpcoes\.map\(.*?Adicionar Opção</button>\s*</div>',
    '', content, flags=re.DOTALL
)

with open('src/app/(dashboard)/admin/pesquisas/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
