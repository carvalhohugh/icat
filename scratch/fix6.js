const fs = require('fs');
const file = 'src/app/(dashboard)/admin/pesquisas/page.tsx';
let c = fs.readFileSync(file, 'utf8');
c = c.replace(/import \{ getPesquisas, addPesquisa, deletePesquisa, type Pesquisa \} from '@\/lib\/pesquisas-store';/, "import { getPesquisas, addPesquisa, deletePesquisa, updatePesquisa, type Pesquisa } from '@/lib/pesquisas-store';");
fs.writeFileSync(file, c);
