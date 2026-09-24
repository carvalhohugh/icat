const fs = require('fs');
const file = 'src/lib/pesquisas-store.ts';
let content = fs.readFileSync(file, 'utf8');

// Ensure metaEntrevistas exists in Pesquisa type
if (!content.includes('metaEntrevistas?: number;')) {
    content = content.replace(
        /metaDiaria\?: number;/,
        `metaDiaria?: number;
  metaEntrevistas?: number;`
    );
}

// Ensure addPesquisa and updatePesquisa handle metaEntrevistas
if (!content.includes('metaEntrevistas: p.metaEntrevistas')) {
    content = content.replace(
        /meta_diaria: p\.metaDiaria, opcoes: p\.opcoes/,
        'meta_diaria: p.metaDiaria, meta_entrevistas: p.metaEntrevistas, opcoes: p.opcoes'
    );
}

if (!content.includes('meta_entrevistas: data.metaEntrevistas')) {
    content = content.replace(
        /multi_select: data\.multiSelect, opcoes: data\.opcoes/,
        'multi_select: data.multiSelect, meta_entrevistas: data.metaEntrevistas, opcoes: data.opcoes'
    );
}

fs.writeFileSync(file, content, 'utf8');
console.log('pesquisas-store patched for metaEntrevistas');
