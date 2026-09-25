with open('src/app/(dashboard)/admin/pesquisas/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "{p.opcoes.slice(0, 3).map((o, i) => (",
    "{(p.perguntas?.[0]?.opcoes || p.opcoes || []).slice(0, 3).map((o, i) => ("
)

content = content.replace(
    "{p.opcoes.length > 3 && <div className=\"text-xs text-gray-400 pl-3.5 pt-1\">+{p.opcoes.length - 3} opções...</div>}",
    "{(p.perguntas?.[0]?.opcoes || p.opcoes || []).length > 3 && <div className=\"text-xs text-gray-400 pl-3.5 pt-1\">+{(p.perguntas?.[0]?.opcoes || p.opcoes || []).length - 3} opções...</div>}"
)

content = content.replace(
    "{p.opcoes.reduce((s, o) => s + o.votos, 0)}",
    "{p.respostas?.length || 0}"
)

with open('src/app/(dashboard)/admin/pesquisas/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
