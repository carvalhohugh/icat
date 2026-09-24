const fs = require('fs');
const file = 'src/app/entrevistador/pesquisas/[id]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add states for location and gender
content = content.replace(
  /const \[outroNome, setOutroNome\] = useState\(''\);/,
  `const [outroNome, setOutroNome] = useState('');
  const [genero, setGenero] = useState('');
  const [local, setLocal] = useState({ estado: '', cidade: '', bairro: '' });
  const [showLocalPopup, setShowLocalPopup] = useState(true); // Always show on open`
);

// 2. Add genero and local to submitResposta
content = content.replace(
  /idade,\s*opcaoIdxs:/,
  `idade, genero, estado: local.estado, cidade: local.cidade, bairro: local.bairro, opcaoIdxs:`
);

content = content.replace(
  /entrevistadorId: entrevistador\?\.id,\s*fonte: 'entrevistador',\s*lat,\s*lng,\s*\}\);/,
  `entrevistadorId: entrevistador?.id, fonte: 'entrevistador', lat, lng }, 
  outroNome ? [outroNome] : []);`
);

// 3. Reset needs to clear genero
content = content.replace(
  /setOutroNome\(''\);/,
  `setOutroNome(''); setGenero('');`
);

// 4. Inject Genero UI into Step 0
content = content.replace(
  /<div>\s*<label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Telefone<\/label>/,
  `<div>
     <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Gênero</label>
     <select value={genero} onChange={e => setGenero(e.target.value)} className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:border-icat-green outline-none text-sm font-medium bg-white">
       <option value="">Selecione...</option>
       <option value="M">Masculino</option>
       <option value="F">Feminino</option>
       <option value="Outro">Outro</option>
     </select>
   </div>
   <div>
     <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Telefone</label>`
);

// 5. Build the Location Popup UI and inject at the top of the return block
content = content.replace(
  /return \(\s*<div className="min-h-screen bg-gray-50 pb-20">/g,
  `return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {showLocalPopup && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-900 text-lg">📍 Localização da Entrevista</h3>
              <p className="text-sm text-gray-500 mt-1">Defina onde você está realizando esta coleta.</p>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Estado (UF)</label>
                <select value={local.estado} onChange={e => setLocal({...local, estado: e.target.value})} className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:border-icat-green outline-none bg-white">
                  <option value="">Selecione...</option>
                  <option value="GO">Goiás (GO)</option>
                  <option value="MG">Minas Gerais (MG)</option>
                  <option value="SP">São Paulo (SP)</option>
                  <option value="DF">Distrito Federal (DF)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Cidade / Município</label>
                <select value={local.cidade} onChange={e => setLocal({...local, cidade: e.target.value})} className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:border-icat-green outline-none bg-white" disabled={!local.estado}>
                  <option value="">Selecione...</option>
                  <option value="Catalão">Catalão</option>
                  <option value="Ouvidor">Ouvidor</option>
                  <option value="Três Ranchos">Três Ranchos</option>
                  <option value="Goiânia">Goiânia</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Bairro / Região</label>
                <input type="text" placeholder="Ex: Centro, Castelo Branco..." value={local.bairro} onChange={e => setLocal({...local, bairro: e.target.value})} className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:border-icat-green outline-none bg-white" disabled={!local.cidade} />
              </div>
            </div>
            <div className="p-5 border-t border-gray-100">
              <button 
                onClick={() => {
                  if(!local.estado || !local.cidade || !local.bairro) return alert('Preencha todos os campos de localização.');
                  setShowLocalPopup(false);
                }}
                className="w-full py-4 bg-icat-green text-white font-bold rounded-xl shadow-lg shadow-icat-green/30"
              >
                Confirmar Localização
              </button>
            </div>
          </div>
        </div>
      )}
`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Entrevistador view patched com Popup e Genero!');
