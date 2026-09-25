with open('src/app/(dashboard)/admin/pesquisas/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

simulacao_old = """                            addPesquisa({
                              nome: `${pesquisaResultado.nome} — Simulação 2º Turno`,
                              tipo: 'Intenção de Voto',
                              status: 'Ativa',
                              induzida: true,
                              multiSelect: false,
                              metaDiaria: 50,
                              opcoes: [
                                { nome: c1.nome, partido: c1.partido, votos: 0 },
                                { nome: c2.nome, partido: c2.partido, votos: 0 },
                                { nome: 'Branco/Nulo', partido: '', votos: 0 },
                                { nome: 'Não Sabe', partido: '', votos: 0 }
                              ],
                              entrevistadores: pesquisaResultado.entrevistadores
                            });"""

simulacao_new = """                            addPesquisa({
                              nome: `${pesquisaResultado.nome} — Simulação 2º Turno`,
                              tipo: 'Intenção de Voto',
                              status: 'Ativa',
                              metaDiaria: 50,
                              perguntas: [
                                {
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
                                }
                              ],
                              entrevistadores: pesquisaResultado.entrevistadores
                            } as any);"""

content = content.replace(simulacao_old, simulacao_new)

with open('src/app/(dashboard)/admin/pesquisas/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
