const fs = require('fs');
const file = 'src/app/(dashboard)/admin/pesquisas/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix missing imports
if(!content.includes('CheckSquare')) {
    content = content.replace(/import \{ (.*?) \} from 'lucide-react';/, "import { $1, CheckSquare, TrendingUp, Target } from 'lucide-react';");
}

// 2. Add metaEntrevistas to State (search for 'metaDiaria')
if (!content.includes('const [metaEntrevistas, setMetaEntrevistas] = useState(')) {
    content = content.replace(
        /const \[metaDiaria, setMetaDiaria\] = useState\(50\);/,
        `const [metaDiaria, setMetaDiaria] = useState(50);
  const [metaEntrevistas, setMetaEntrevistas] = useState(1000);`
    );
}

// 3. Make card clickable for editing
content = content.replace(
  /<div key=\{p\.id\} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col hover:shadow-md transition-shadow relative">/g,
  `<div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col hover:shadow-md transition-shadow relative cursor-pointer" onClick={(e) => {
    // ignore clicks on the action buttons area
    if (e.target.closest('button')) return;
    setEditandoId(p.id);
    setNome(p.nome);
    setTipo(p.tipo);
    setStatus(p.status);
    setInduzida(p.induzida);
    setMultiSelect(p.multiSelect || false);
    setExigeMorador(p.exigeMorador || false);
    setIdadeMinima(p.idadeMinima?.toString() || '');
    setMetaDiaria(p.metaDiaria || 50);
    setMetaEntrevistas(p.metaEntrevistas || 1000);
    setOpcoes([...p.opcoes]);
    setIsModalOpen(true);
  }}>`
);

// 4. In Nova Pesquisa Modal, add Meta Entrevistas input
if (!content.includes('>Total Planejado de Entrevistas<')) {
    content = content.replace(
        /<div>\s*<label className="block text-sm font-bold text-gray-700 mb-1">Meta Diária por Entrevistador<\/label>/,
        `<div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Total Planejado de Entrevistas (Meta Global)</label>
                    <input type="number" value={metaEntrevistas} onChange={e => setMetaEntrevistas(Number(e.target.value))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-icat-green outline-none text-sm font-medium" min="1" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Meta Diária por Entrevistador</label>`
    );
}

// 5. Submit modal logic (save/edit) -> include metaEntrevistas
content = content.replace(
    /metaDiaria\s*\}\)/g,
    'metaDiaria, metaEntrevistas })'
);

// 6. Update the Dashboard cards in Resultados Tab to calculate Goal Per Interviewer
if (!content.includes('Meta por Entrevistador')) {
    const dashboardCardsOld = `                    <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-center gap-4">
                      <div className="bg-orange-500 text-white p-3 rounded-lg"><TrendingUp className="w-6 h-6" /></div>
                      <div>
                        <p className="text-sm font-bold text-orange-600 uppercase tracking-wide">Média Diária</p>
                        <p className="text-2xl font-black text-gray-900">
                          {pesquisaResultado.respostas.length > 0 ? 
                            (() => {
                              const dates = pesquisaResultado.respostas.map(r => r.data.split(' ')[0]);
                              const uniqueDays = new Set(dates).size;
                              return Math.round(totalVotos / (uniqueDays || 1));
                            })()
                            : 0} 
                          <span className="text-sm font-medium text-gray-500"> / dia</span>
                        </p>
                      </div>
                    </div>`;

    const dashboardCardsNew = `                    <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-center gap-4">
                      <div className="bg-orange-500 text-white p-3 rounded-lg"><TrendingUp className="w-6 h-6" /></div>
                      <div>
                        <p className="text-sm font-bold text-orange-600 uppercase tracking-wide">Média Diária</p>
                        <p className="text-2xl font-black text-gray-900">
                          {pesquisaResultado.respostas.length > 0 ? 
                            (() => {
                              const dates = pesquisaResultado.respostas.map(r => r.data.split(' ')[0]);
                              const uniqueDays = new Set(dates).size;
                              return Math.round(totalVotos / (uniqueDays || 1));
                            })()
                            : 0} 
                          <span className="text-sm font-medium text-gray-500"> / dia</span>
                        </p>
                      </div>
                    </div>
                    <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl flex items-center gap-4">
                      <div className="bg-purple-500 text-white p-3 rounded-lg"><Target className="w-6 h-6" /></div>
                      <div>
                        <p className="text-sm font-bold text-purple-600 uppercase tracking-wide">Meta por Entrevistador</p>
                        <p className="text-2xl font-black text-gray-900">
                          {pesquisaResultado.entrevistadores.length > 0 ? Math.round((pesquisaResultado.metaEntrevistas || 1000) / pesquisaResultado.entrevistadores.length) : (pesquisaResultado.metaEntrevistas || 1000)}
                          <span className="text-sm font-medium text-gray-500"> por pessoa</span>
                        </p>
                      </div>
                    </div>`;
    content = content.replace(dashboardCardsOld, dashboardCardsNew);
}

fs.writeFileSync(file, content, 'utf8');
console.log('admin/pesquisas/page.tsx patched successfully!');
