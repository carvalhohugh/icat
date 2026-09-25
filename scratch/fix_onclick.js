const fs = require('fs');
const file = 'src/app/pesquisa/[id]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /onClick=\{\(\) => \{ if \(pesquisa\.idadeMinima[\s\S]*?setStep\(1\); \}\}/;
content = content.replace(regex, 'onClick={() => setStep(1)}');
fs.writeFileSync(file, content, 'utf8');
