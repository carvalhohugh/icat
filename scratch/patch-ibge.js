const fs = require('fs');
const file = 'src/app/entrevistador/pesquisas/[id]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add states for IBGE API data
content = content.replace(
  /const \[local, setLocal\] = useState\(\{ estado: '', cidade: '', bairro: '' \}\);/,
  `const [local, setLocal] = useState({ estado: '', cidade: '', bairro: '' });
  const [estados, setEstados] = useState<any[]>([]);
  const [cidades, setCidades] = useState<any[]>([]);
  const [bairrosSalvos, setBairrosSalvos] = useState<string[]>(['Centro', 'Castelo Branco', 'Santa Cruz', 'Nossa Senhora de Fátima']); // Mock inicial de bairros
  const [novoBairroModo, setNovoBairroModo] = useState(false);`
);

// Add useEffect to load Estados
content = content.replace(
  /useEffect\(\(\) => \{/,
  `useEffect(() => {
      fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
        .then(res => res.json())
        .then(data => setEstados(data))
        .catch(console.error);
    }, []);\n\n  useEffect(() => {`
);

// Add useEffect to load Cidades when Estado changes
content = content.replace(
  /useEffect\(\(\) => \{\s*fetch\('https:\/\/servicodados\.ibge\.gov\.br\/api\/v1\/localidades\/estados\?orderBy=nome'\)/,
  `useEffect(() => {
      if (local.estado) {
        fetch(\`https://servicodados.ibge.gov.br/api/v1/localidades/estados/\${local.estado}/municipios\`)
          .then(res => res.json())
          .then(data => setCidades(data))
          .catch(console.error);
      } else {
        setCidades([]);
      }
    }, [local.estado]);

    useEffect(() => {
      fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')`
);

// Replace the static select options for Estado and Cidade with the API mapping
content = content.replace(
  /<select value=\{local\.estado\}.*?<\/select>/s,
  `<select value={local.estado} onChange={e => setLocal({...local, estado: e.target.value, cidade: '', bairro: ''})} className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:border-icat-green outline-none bg-white">
                  <option value="">Selecione...</option>
                  {estados.map(uf => (
                    <option key={uf.id} value={uf.sigla}>{uf.nome} ({uf.sigla})</option>
                  ))}
                </select>`
);

content = content.replace(
  /<select value=\{local\.cidade\}.*?<\/select>/s,
  `<select value={local.cidade} onChange={e => setLocal({...local, cidade: e.target.value, bairro: ''})} className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:border-icat-green outline-none bg-white" disabled={!local.estado}>
                  <option value="">Selecione...</option>
                  {cidades.map(c => (
                    <option key={c.id} value={c.nome}>{c.nome}</option>
                  ))}
                </select>`
);

// Replace the bairro input with a select + Add button
content = content.replace(
  /<div>\s*<label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Bairro \/ Região<\/label>\s*<input type="text".*?\/>\s*<\/div>/s,
  `<div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Bairro / Região</label>
                {novoBairroModo ? (
                  <div className="flex gap-2">
                    <input type="text" placeholder="Digite o nome do novo bairro..." value={local.bairro} onChange={e => setLocal({...local, bairro: e.target.value})} className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:border-icat-green outline-none bg-white" autoFocus />
                    <button type="button" onClick={() => { if(local.bairro) setBairrosSalvos([...bairrosSalvos, local.bairro]); setNovoBairroModo(false); }} className="px-4 py-3 bg-icat-green text-white font-bold rounded-xl whitespace-nowrap">Salvar</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <select value={local.bairro} onChange={e => setLocal({...local, bairro: e.target.value})} className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:border-icat-green outline-none bg-white" disabled={!local.cidade}>
                      <option value="">Selecione...</option>
                      {bairrosSalvos.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                    <button type="button" onClick={() => { setNovoBairroModo(true); setLocal({...local, bairro: ''}); }} className="px-4 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl whitespace-nowrap hover:bg-gray-300" disabled={!local.cidade}>+ Bairro</button>
                  </div>
                )}
              </div>`
);

fs.writeFileSync(file, content, 'utf8');
console.log('IBGE integration patched!');
