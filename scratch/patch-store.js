const fs = require('fs');
const file = 'src/lib/pesquisas-store.ts';
let content = fs.readFileSync(file, 'utf8');

// Add genero, estado, cidade, bairro to Resposta
content = content.replace(
  /idade\?: number;/,
  `idade?: number;
  genero?: string;
  estado?: string;
  cidade?: string;
  bairro?: string;`
);

// Add novasOpcoesNomes to addResposta signature
content = content.replace(
  /export function addResposta\(pesquisaId: number, resposta: Omit<Resposta, 'id' \| 'data'>\) \{/,
  `export function addResposta(pesquisaId: number, resposta: Omit<Resposta, 'id' | 'data'>, novasOpcoesNomes?: string[]) {`
);

// Process novasOpcoesNomes
content = content.replace(
  /novaResposta\.opcaoIdxs\.forEach\(opcaoIdx => \{/,
  `if (novasOpcoesNomes && novasOpcoesNomes.length > 0) {
    novasOpcoesNomes.forEach(nome => {
      const cleanName = nome.trim();
      if (!cleanName) return;
      
      const existingIdx = pesquisa.opcoes.findIndex(o => o.nome.toLowerCase() === cleanName.toLowerCase());
      if (existingIdx !== -1) {
        if (!novaResposta.opcaoIdxs.includes(existingIdx)) {
          novaResposta.opcaoIdxs.push(existingIdx);
        }
      } else {
        const novoIdx = pesquisa.opcoes.length;
        pesquisa.opcoes.push({ nome: cleanName, votos: 0 });
        novaResposta.opcaoIdxs.push(novoIdx);
      }
    });
  }

  novaResposta.opcaoIdxs.forEach(opcaoIdx => {`
);

// Sync to Supabase
content = content.replace(
  /idade: resposta\.idade\n\s*\}\]\)/,
  `idade: resposta.idade,
    genero: resposta.genero,
    estado: resposta.estado,
    cidade: resposta.cidade,
    bairro: resposta.bairro
  }])`
);

fs.writeFileSync(file, content, 'utf8');
console.log('pesquisas-store patched!');
