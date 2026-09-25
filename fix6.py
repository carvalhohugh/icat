import re
with open('src/app/(dashboard)/admin/pesquisas/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

demo_old = """                            const contagem = {} as Record<number, number>;
                            votosNaFaixa.forEach(r => {
                              r.opcaoIdxs.forEach(idx => contagem[idx] = (contagem[idx] || 0) + 1);
                            });
                            
                            // Acha vencedor
                            const vencedorIdx = Object.keys(contagem).reduce((a, b) => contagem[Number(a)] > contagem[Number(b)] ? a : b, Object.keys(contagem)[0]);
                            const vencedorNome = pesquisaResultado.opcoes[Number(vencedorIdx)]?.nome || 'N/A';
                            const perc = ((contagem[Number(vencedorIdx)] / votosNaFaixa.length) * 100).toFixed(1);"""

demo_new = """                            const contagem = {} as Record<string, number>;
                            votosNaFaixa.forEach(r => {
                              r.respostas?.[0]?.opcaoIds?.forEach((id: string) => contagem[id] = (contagem[id] || 0) + 1);
                            });
                            
                            // Acha vencedor
                            const keys = Object.keys(contagem);
                            const vencedorId = keys.length > 0 ? keys.reduce((a, b) => contagem[a] > contagem[b] ? a : b, keys[0]) : null;
                            const vencedorNome = (vencedorId && pesquisaResultado.perguntas?.[0]?.opcoes.find(o => o.id === vencedorId)?.nome) || 'N/A';
                            const perc = vencedorId ? ((contagem[vencedorId] / votosNaFaixa.length) * 100).toFixed(1) : '0.0';"""

content = content.replace(demo_old, demo_new)

with open('src/app/(dashboard)/admin/pesquisas/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
