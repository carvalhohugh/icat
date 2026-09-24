const fs = require('fs');
const file = 'src/app/(dashboard)/admin/pesquisas/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Inject the stats summary cards inside the resultados tab
const targetString = '<PrintHeader title={`Relatório: ${pesquisaResultado.nome}`} />';

const statsHtml = `
                  <PrintHeader title={\`Relatório: \${pesquisaResultado.nome}\`} />
                  
                  {/* Dashboard de Gestão Geral da Pesquisa */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 print:hidden">
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center gap-4">
                      <div className="bg-blue-500 text-white p-3 rounded-lg"><Users className="w-6 h-6" /></div>
                      <div>
                        <p className="text-sm font-bold text-blue-600 uppercase tracking-wide">Equipe Ativa</p>
                        <p className="text-2xl font-black text-gray-900">{pesquisaResultado.entrevistadores.length} <span className="text-sm font-medium text-gray-500">entrevistadores</span></p>
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-4">
                      <div className="bg-green-500 text-white p-3 rounded-lg"><CheckSquare className="w-6 h-6" /></div>
                      <div>
                        <p className="text-sm font-bold text-green-600 uppercase tracking-wide">Total Coletado</p>
                        <p className="text-2xl font-black text-gray-900">{totalVotos} <span className="text-sm font-medium text-gray-500">entrevistas</span></p>
                      </div>
                    </div>
                    <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-center gap-4">
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
                  </div>
`;

content = content.replace(targetString, statsHtml);

// We need to import Users, CheckSquare, TrendingUp from lucide-react if not present
if(!content.includes('Users')) {
    content = content.replace(/import \{ (.*?) \} from 'lucide-react';/, "import { $1, Users, CheckSquare, TrendingUp } from 'lucide-react';");
}

fs.writeFileSync(file, content, 'utf8');
console.log('Stats cards injected!');
