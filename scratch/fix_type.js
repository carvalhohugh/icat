const fs = require('fs');
const file = 'src/app/(dashboard)/admin/pesquisas/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/opcoes: \{id: string, nome: string, partido: string\}\[\]/g, "opcoes: {id: string, nome: string, partido: string, foto?: string}[]");

fs.writeFileSync(file, c);
