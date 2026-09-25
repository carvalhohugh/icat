import re
with open('src/app/(dashboard)/admin/pesquisas/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(
    r"opcoes:\s*\[\s*\{\s*nome:\s*c1\.nome,\s*partido:\s*c1\.partido,\s*votos:\s*0\s*\},.*?entrevistadores:\s*pesquisaResultado\.entrevistadores\s*\}\);",
    r'''perguntas: [{
                              id: `p${Date.now()}`,
                              titulo: 'Se as eleições fossem hoje, em quem você votaria no 2º turno?',
                              tipo: 'Induzida',
                              multiSelect: false,
                              opcoes: [
                                { id: 'o1', nome: c1.nome, partido: c1.partido, votos: 0 },
                                { id: 'o2', nome: c2.nome, partido: c2.partido, votos: 0 },
                                { id: 'o3', nome: 'Branco/Nulo', partido: '', votos: 0 },
                                { id: 'o4', nome: 'Não Sabe', partido: '', votos: 0 }
                              ]
                            }],
                            entrevistadores: pesquisaResultado.entrevistadores
                          } as any);''',
    content, flags=re.DOTALL
)

with open('src/app/(dashboard)/admin/pesquisas/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
