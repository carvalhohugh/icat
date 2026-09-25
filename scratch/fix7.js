const fs = require('fs');
const file = 'src/app/(dashboard)/admin/pesquisas/page.tsx';
let c = fs.readFileSync(file, 'utf8');
c = c.replace(/opcoes: \[\s*\{ nome: c1\.nome, partido: c1\.partido, votos: 0 \},\s*\{ nome: c2\.nome, partido: c2\.partido, votos: 0 \},\s*\{ nome: 'Branco\/Nulo', partido: '', votos: 0 \},\s*\{ nome: 'Não Sabe', partido: '', votos: 0 \}\s*\]/, 
"perguntas: [{ id: 'p1', titulo: 'Se as eleições fossem hoje, em quem você votaria no 2º turno?', tipo: 'Induzida', multiSelect: false, opcoes: [{ id: 'o1', nome: c1.nome, partido: c1.partido, votos: 0 }, { id: 'o2', nome: c2.nome, partido: c2.partido, votos: 0 }, { id: 'o3', nome: 'Branco/Nulo', partido: '', votos: 0 }, { id: 'o4', nome: 'Não Sabe', partido: '', votos: 0 }]}]");
fs.writeFileSync(file, c);
