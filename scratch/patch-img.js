const fs = require('fs');
const files = [
  'src/app/entrevistador/pesquisas/[id]/page.tsx',
  'src/app/pesquisa/[id]/page.tsx',
  'src/app/(dashboard)/admin/pesquisas/page.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /<div className=\{\`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shrink-0 (\$\{.*?\})\`\}>\s*\{o\.nome\.substring\(0, 2\)\.toUpperCase\(\)\}\s*<\/div>/g,
    `{o.foto ? ( <img src={o.foto} alt={o.nome} className="w-12 h-12 rounded-full object-cover shrink-0" /> ) : ( <div className={\`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shrink-0 $1\`}> {o.nome.substring(0, 2).toUpperCase()} </div> )}`
  );
  
  // also check for w-8 h-8 (in admin view)
  content = content.replace(
    /<div className=\{\`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 (\$\{.*?\})\`\}>\s*\{o\.nome\.substring\(0, 2\)\.toUpperCase\(\)\}\s*<\/div>/g,
    `{o.foto ? ( <img src={o.foto} alt={o.nome} className="w-8 h-8 rounded-full object-cover shrink-0" /> ) : ( <div className={\`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 $1\`}> {o.nome.substring(0, 2).toUpperCase()} </div> )}`
  );

  fs.writeFileSync(file, content, 'utf8');
});
console.log('Images patched');
