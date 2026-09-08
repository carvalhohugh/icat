import Link from 'next/link';
import { ChevronLeft, MapPin, Clock } from 'lucide-react';

const ofertas = [
  {
    id: 1,
    empresa: 'Farmácia Preço Baixo',
    desconto: '15% OFF',
    desc: 'Desconto em medicamentos e produtos de higiene para portadores da carteirinha ICAT.',
    regras: 'Válido de segunda a sexta. Apresentar carteirinha na hora da compra.',
    categoria: 'Saúde',
  },
  {
    id: 2,
    empresa: 'Supermercado Bretas',
    desconto: '10% OFF',
    desc: 'Desconto especial em compras acima de R$100 para famílias cadastradas no ICAT.',
    regras: 'Válido aos sábados. Limitado a 1 compra por semana por família.',
    categoria: 'Alimentação',
  },
  {
    id: 3,
    empresa: 'Auto Escola Catalão',
    desconto: '20% OFF',
    desc: 'Desconto na primeira habilitação para jovens atendidos pelo ICAT.',
    regras: 'Válido para maiores de 18 anos com vínculo ativo no ICAT.',
    categoria: 'Serviços',
  },
];

export default function ClubePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center text-gray-500 hover:text-icat-green font-medium text-sm">
            <ChevronLeft className="w-5 h-5 mr-1" /> Voltar ao site
          </Link>
          <img src="/logo.png" alt="ICAT" className="h-8 opacity-60 grayscale" />
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-icat-green to-green-800 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <img src="/clube-logo.jpg" alt="Clube ICAT" className="w-24 h-24 mx-auto mb-6 rounded-2xl shadow-lg border-4 border-white/20" />
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Clube de Vantagens ICAT</h1>
            <p className="text-green-100 text-lg max-w-2xl mx-auto">
              Descontos exclusivos em empresas parceiras para alunos, famílias atendidas e doadores do Instituto Catalano. Apresente sua carteirinha e aproveite!
            </p>
          </div>
        </section>

        {/* Ofertas */}
        <section className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Ofertas Disponíveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ofertas.map(o => (
              <div key={o.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                <div className="bg-icat-green/5 p-6 border-b border-gray-100">
                  <span className="inline-block bg-icat-yellow text-gray-900 text-xs font-bold px-3 py-1 rounded-full mb-3">
                    {o.categoria}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900">{o.empresa}</h3>
                  <p className="text-3xl font-black text-icat-green mt-2">{o.desconto}</p>
                </div>
                <div className="p-6 space-y-3">
                  <p className="text-gray-600 text-sm">{o.desc}</p>
                  <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-500">
                    <strong className="text-gray-700">Regras:</strong> {o.regras}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400 pt-2">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Catalão-GO</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Válido até Dez/2026</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white border-t border-gray-100 py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quer fazer parte?</h2>
            <p className="text-gray-600 mb-8">Matricule-se em um dos nossos cursos ou faça uma doação para receber sua carteirinha do Clube de Vantagens ICAT.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/matricula" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-icat-green hover:bg-green-700 transition-colors">
                Matricule-se Agora
              </Link>
              <Link href="/doacoes" className="inline-flex items-center justify-center px-8 py-3 border-2 border-icat-green text-base font-medium rounded-lg text-icat-green bg-white hover:bg-green-50 transition-colors">
                Fazer uma Doação
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white py-8 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-400">© 2026 Instituto Catalano - ICAT. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
