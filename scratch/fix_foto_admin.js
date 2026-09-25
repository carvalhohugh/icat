const fs = require('fs');
const file = 'src/app/(dashboard)/admin/pesquisas/page.tsx';
let c = fs.readFileSync(file, 'utf8');

// Update state initialization
c = c.replace(/opcoes: \[\{id: 'o1', nome: '', partido: ''\}, \{id: 'o2', nome: '', partido: ''\}\]/g, 
"opcoes: [{id: 'o1', nome: '', partido: '', foto: ''}, {id: 'o2', nome: '', partido: '', foto: ''}]");

c = c.replace(/opcoes: \[\{id: `o\$\{Date\.now\(\)\}1`, nome: '', partido: ''\}, \{id: `o\$\{Date\.now\(\)\}2`, nome: '', partido: ''\}\]/g, 
"opcoes: [{id: `o${Date.now()}1`, nome: '', partido: '', foto: ''}, {id: `o${Date.now()}2`, nome: '', partido: '', foto: ''}]");

// Update handleSavePesquisa
c = c.replace(/opcoes: p\.opcoes\.filter\(o => o\.nome\.trim\(\)\)\.map\(o => \(\{ id: o\.id, nome: o\.nome\.trim\(\), partido: o\.partido\.trim\(\) \|\| undefined, votos: 0 \}\)\)/g, 
"opcoes: p.opcoes.filter(o => o.nome.trim()).map(o => ({ id: o.id, nome: o.nome.trim(), partido: o.partido?.trim() || undefined, foto: o.foto?.trim() || undefined, votos: 0 }))");

// Update loading existing logic
c = c.replace(/opcoes: perg\.opcoes\.map\(o => \(\{ id: o\.id, nome: o\.nome, partido: o\.partido \|\| '' \}\)\)/g,
"opcoes: perg.opcoes.map(o => ({ id: o.id, nome: o.nome, partido: o.partido || '', foto: o.foto || '' }))");

// Update UI
const oldUI = `                            <input type="text" value={op.partido} onChange={e => { const arr = [...novasPerguntas]; arr[pIdx].opcoes[oIdx].partido = e.target.value; setNovasPerguntas(arr); }} className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none text-sm" placeholder="Partido" />
                            {perg.opcoes.length > 2 && <button onClick={() => { const arr = [...novasPerguntas]; arr[pIdx].opcoes = arr[pIdx].opcoes.filter((_, j) => j !== oIdx); setNovasPerguntas(arr); }} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>}`;

const newUI = `                            <input type="text" value={op.partido} onChange={e => { const arr = [...novasPerguntas]; arr[pIdx].opcoes[oIdx].partido = e.target.value; setNovasPerguntas(arr); }} className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none text-sm" placeholder="Partido" />
                            <input type="text" value={op.foto || ''} onChange={e => { const arr = [...novasPerguntas]; arr[pIdx].opcoes[oIdx].foto = e.target.value; setNovasPerguntas(arr); }} className="w-32 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none text-sm" placeholder="URL da Foto" />
                            {perg.opcoes.length > 2 && <button onClick={() => { const arr = [...novasPerguntas]; arr[pIdx].opcoes = arr[pIdx].opcoes.filter((_, j) => j !== oIdx); setNovasPerguntas(arr); }} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>}`;

c = c.replace(oldUI, newUI);

// Update Add Opcao button
c = c.replace(/arr\[pIdx\]\.opcoes\.push\(\{id: \`o\$\{Date\.now\(\)\}\`, nome: '', partido: ''\}\)/g, 
"arr[pIdx].opcoes.push({id: `o${Date.now()}`, nome: '', partido: '', foto: ''})");

fs.writeFileSync(file, c);
