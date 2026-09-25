const fs = require('fs');
const file = 'src/app/pesquisa/[id]/page.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace("if (pesquisa.exigeMorador && isMorador === 'nao') { alert('Pesquisa encerrada: Necessário ser morador do município.'); reset(); return; } ", "");
fs.writeFileSync(file, content, 'utf8');
