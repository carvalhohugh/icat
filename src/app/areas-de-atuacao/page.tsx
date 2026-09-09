import { Header } from '@/components/Header';

export default function AreasDeAtuacao() {
  const areas = [
    {
      num: '01',
      title: 'Assistência Social',
      desc: 'Atendimento, orientação e apoio a famílias e pessoas em situação de vulnerabilidade.',
      color: 'bg-icat-green/10 text-icat-green',
      hover: 'group-hover:text-icat-green',
    },
    {
      num: '02',
      title: 'Educação e Formação',
      desc: 'Cursos livres, oficinas de capacitação profissional, reforço escolar e formação cidadã em ambiente comunitário.',
      color: 'bg-icat-blue/10 text-icat-blue',
      hover: 'group-hover:text-icat-blue',
    },
    {
      num: '03',
      title: 'Esporte e Inclusão',
      desc: 'Iniciação esportiva comunitária (Futebol, Jiu-Jítsu), convivência, disciplina e inclusão social absoluta.',
      color: 'bg-icat-yellow/20 text-icat-yellow',
      hover: 'group-hover:text-icat-yellow',
    },
    {
      num: '04',
      title: 'Cultura e Arte',
      desc: 'Música, teatro, ballet e oficinas que valorizam a expressão corporal, criatividade e cultura na região.',
      color: 'bg-icat-blue/10 text-icat-blue',
      hover: 'group-hover:text-icat-blue',
    },
    {
      num: '05',
      title: 'Cidadania e Direitos',
      desc: 'Informação, participação social, orientação jurídica e defesa de direitos no território de Catalão.',
      color: 'bg-icat-green/10 text-icat-green',
      hover: 'group-hover:text-icat-green',
    },
    {
      num: '06',
      title: 'Saúde e Bem-Estar',
      desc: 'Campanhas educativas de orientação, prevenção, Defesa Pessoal para Mulheres e promoção do bem-estar.',
      color: 'bg-icat-yellow/20 text-icat-yellow',
      hover: 'group-hover:text-icat-yellow',
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        
        <div className="mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">Áreas de atuação</h1>
          <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
            Cada área responde a necessidades concretas do nosso território e se conecta à missão do Instituto Catalano (ICAT).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area) => (
            <div key={area.num} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all border border-gray-100 group cursor-pointer flex flex-col">
              <span className={`text-4xl font-black mb-6 w-16 h-16 flex items-center justify-center rounded-2xl ${area.color}`}>
                {area.num}
              </span>
              <h2 className={`text-2xl font-bold text-gray-900 mb-4 transition-colors ${area.hover}`}>
                {area.title}
              </h2>
              <p className="text-gray-600 leading-relaxed flex-1">
                {area.desc}
              </p>
            </div>
          ))}
        </div>

      </main>

      <footer className="bg-white py-12 border-t border-gray-100 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-gray-500 font-medium mb-2">INSTITUTO CATALANO — ICAT</p>
          <p className="text-sm text-gray-400">© 2026. Catalão, Goiás. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
