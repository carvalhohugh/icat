import Link from 'next/link';
import { ChevronLeft, Target, Sun, Heart, CheckCircle2 } from 'lucide-react';

export default function QuemSomos() {
  const valores = [
    { title: 'Dignidade Humana', desc: 'Colocar as pessoas e o respeito à vida no centro das ações.' },
    { title: 'Cidadania', desc: 'Promover direitos, participação social e acesso a oportunidades.' },
    { title: 'Inclusão', desc: 'Criar oportunidades para pessoas e grupos em diferentes situações sociais.' },
    { title: 'Transparência', desc: 'Manter uma gestão responsável, ética e aberta à sociedade.' },
    { title: 'Legalidade e Ética', desc: 'Atuar em conformidade com a legislação e com os princípios da boa governança.' },
    { title: 'Eficiência', desc: 'Buscar resultados sociais concretos utilizando os recursos de forma responsável.' },
    { title: 'Solidariedade', desc: 'Fortalecer vínculos entre pessoas, famílias e comunidades.' },
    { title: 'Desenvolvimento Comunitário', desc: 'Estimular iniciativas capazes de melhorar os territórios em Catalão.' },
    { title: 'Diversidade e Respeito', desc: 'Valorizar as diferenças, a convivência e o respeito entre pessoas.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center text-gray-500 hover:text-icat-green font-medium">
            <ChevronLeft className="w-5 h-5 mr-1" /> Voltar ao Início
          </Link>
          <img src="/logo.png" alt="ICAT" className="h-10 grayscale opacity-50" />
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full space-y-24">
        
        {/* Intro */}
        <section>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
            Uma associação civil que existe para gerar oportunidades
          </h1>
          <div className="prose prose-lg text-gray-600">
            <p className="mb-6">
              O <strong>Instituto Catalano (ICAT)</strong> é uma associação privada sem fins lucrativos, sediada no Sudeste Goiano (Catalão), que desenvolve ações de interesse social, assistencial, educacional, cultural, esportivo e comunitário.
            </p>
            <p>
              Trabalhamos para fortalecer pessoas, famílias e territórios, ampliando o acesso a direitos, informação, convivência e oportunidades. Nossa atuação nasce do encontro com a comunidade e se organiza em programas, oficinas, campanhas e ações realizadas em parceria com moradores, empresas privadas e poder público.
            </p>
          </div>
        </section>

        {/* Missão e Visão */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-icat-blue" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Missão</h2>
            <p className="text-gray-600 leading-relaxed">
              Promover cidadania, dignidade e inclusão social por meio de ações socioassistenciais, educacionais, culturais, esportivas e comunitárias que fortaleçam pessoas, famílias e territórios, ampliando oportunidades e contribuindo para uma sociedade mais justa, participativa e solidária em Catalão e região.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="bg-yellow-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <Sun className="w-7 h-7 text-icat-yellow" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Visão</h2>
            <p className="text-gray-600 leading-relaxed">
              Ser reconhecido como uma organização social de referência na promoção da cidadania, da inclusão e do desenvolvimento comunitário, contribuindo para que pessoas em diferentes fases da vida tenham acesso a oportunidades, direitos e condições para transformar suas próprias histórias.
            </p>
          </div>
        </section>

        {/* Valores */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-green-50 p-3 rounded-full">
              <Heart className="w-6 h-6 text-icat-green" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Princípios que orientam cada decisão</h2>
          </div>
          
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {valores.map((v, i) => (
                <li key={i} className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-icat-green flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900">{v.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mt-1">{v.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

      </main>

      <footer className="bg-white py-12 border-t border-gray-100 text-center mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-gray-500 font-medium mb-2">INSTITUTO CATALANO — ICAT</p>
          <p className="text-sm text-gray-400">© 2026. Associação privada sem fins lucrativos. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
