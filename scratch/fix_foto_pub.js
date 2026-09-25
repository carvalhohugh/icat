const fs = require('fs');
const file = 'src/app/pesquisa/[id]/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/\{icone \|\| <span className="text-2xl font-black">\{op\.nome\.charAt\(0\)\}<\/span>\}/g, 
"{op.foto ? <img src={op.foto} alt={op.nome} className=\"w-full h-full object-cover\" /> : icone || <span className=\"text-2xl font-black\">{op.nome.charAt(0)}</span>}");

fs.writeFileSync(file, c);
