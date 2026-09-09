import Link from 'next/link';
import { ArrowRight, Target, ShieldCheck, Sun, ArrowUpRight } from 'lucide-react';
import { Header } from '@/components/Header';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-icat-gray-light to-white -z-10"></div>
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-icat-green/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="inline-flex items-center space-x-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-icat-green animate-pulse"></span>
            <span className="text-xs font-semibold text-gray-600 tracking-wider uppercase">Sudeste Goiano, Catalão e Região</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-8 max-w-4xl">
            Cidadania, <span className="text-transparent bg-clip-text bg-gradient-to-r from-icat-green to-icat-blue">educação</span>, cultura, esporte e <span className="text-transparent bg-clip-text bg-gradient-to-r from-icat-yellow to-icat-blue">inclusão</span> construindo novas possibilidades.
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
            Uma associação civil que existe para gerar oportunidades, fortalecer famílias e promover desenvolvimento comunitário em toda a região.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/quem-somos" className="btn-primary rounded-full px-8 py-3.5 text-lg flex justify-center items-center gap-2 group">
              Conheça o Instituto
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/doacoes" className="bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 rounded-full px-8 py-3.5 text-lg font-bold flex justify-center items-center transition-all">
              Quero Apoiar
            </Link>
          </div>
        </div>
      </section>

      {/* Missão Visão Valores */}
      <section id="quem-somos" className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm font-bold text-icat-green uppercase tracking-wider mb-2">Quem Somos</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Uma associação que existe para gerar oportunidades
              </h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                O Instituto Catalano (ICAT) desenvolve ações de interesse social, assistencial, educacional, cultural, esportivo e comunitário. Trabalhamos para fortalecer pessoas, famílias e territórios em Catalão e no Sudeste Goiano.
              </p>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="mt-1 bg-blue-50 p-3 rounded-xl h-fit">
                    <Target className="text-icat-blue w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Nossa Missão</h4>
                    <p className="text-gray-600 leading-relaxed">Promover cidadania, dignidade e inclusão social através de ações que fortaleçam famílias e territórios, ampliando oportunidades.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="mt-1 bg-yellow-50 p-3 rounded-xl h-fit">
                    <Sun className="text-icat-yellow w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Nossa Visão</h4>
                    <p className="text-gray-600 leading-relaxed">Ser referência no Sudeste Goiano na promoção da cidadania e desenvolvimento, garantindo que as pessoas tenham acesso a condições para transformar suas histórias.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop" alt="Crianças estudando e sorrindo" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl max-w-xs border border-gray-100 hidden md:block">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="text-icat-green w-8 h-8" />
                  <span className="font-bold text-gray-900 text-lg">Transparência</span>
                </div>
                <p className="text-sm text-gray-600">Gestão responsável, ética e aberta à sociedade em cada doação.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Áreas de Atuação */}
      <section id="areas" className="py-24 bg-icat-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-sm font-bold text-icat-green uppercase tracking-wider mb-2">Áreas de Atuação</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 max-w-2xl leading-tight">
              Cada área responde a necessidades concretas da nossa região.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
              <span className="text-5xl font-black text-icat-blue/40 group-hover:text-icat-blue transition-colors mb-6 block">01</span>
              <h4 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-icat-blue transition-colors">Assistência Social</h4>
              <p className="text-gray-600 mb-6 leading-relaxed">Atendimento, orientação e apoio a famílias e pessoas em situação de vulnerabilidade com distribuição de cestas básicas e itens essenciais.</p>
              <Link href="/areas-de-atuacao" className="inline-flex items-center font-bold text-icat-blue group-hover:gap-2 transition-all">
                Saiba mais <ArrowUpRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
              <span className="text-5xl font-black text-icat-green/40 group-hover:text-icat-green transition-colors mb-6 block">02</span>
              <h4 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-icat-green transition-colors">Educação e Formação</h4>
              <p className="text-gray-600 mb-6 leading-relaxed">Cursos livres, oficinas de capacitação profissional e reforço escolar em ambiente seguro e comunitário.</p>
              <Link href="/areas-de-atuacao" className="inline-flex items-center font-bold text-icat-green group-hover:gap-2 transition-all">
                Saiba mais <ArrowUpRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
              <span className="text-5xl font-black text-icat-yellow/60 group-hover:text-icat-yellow transition-colors mb-6 block">03</span>
              <h4 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-icat-yellow transition-colors">Esporte e Inclusão</h4>
              <p className="text-gray-600 mb-6 leading-relaxed">Iniciação esportiva (Futebol, Jiu-Jítsu, Ballet) focada em convivência, disciplina e inclusão social absoluta.</p>
              <Link href="/areas-de-atuacao" className="inline-flex items-center font-bold text-icat-yellow group-hover:gap-2 transition-all">
                Saiba mais <ArrowUpRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
              <span className="text-5xl font-black text-icat-blue/40 group-hover:text-icat-blue transition-colors mb-6 block">04</span>
              <h4 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-icat-blue transition-colors">Cultura e Arte</h4>
              <p className="text-gray-600 mb-6 leading-relaxed">Música, teatro, ballet e oficinas que valorizam a expressão corporal, criatividade e cultura na região.</p>
              <Link href="/areas-de-atuacao" className="inline-flex items-center font-bold text-icat-blue group-hover:gap-2 transition-all">
                Saiba mais <ArrowUpRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Card 5 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
              <span className="text-5xl font-black text-icat-green/40 group-hover:text-icat-green transition-colors mb-6 block">05</span>
              <h4 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-icat-green transition-colors">Cidadania e Direitos</h4>
              <p className="text-gray-600 mb-6 leading-relaxed">Informação, participação social, orientação jurídica e defesa de direitos no território de Catalão.</p>
              <Link href="/areas-de-atuacao" className="inline-flex items-center font-bold text-icat-green group-hover:gap-2 transition-all">
                Saiba mais <ArrowUpRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Card 6 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
              <span className="text-5xl font-black text-icat-yellow/60 group-hover:text-icat-yellow transition-colors mb-6 block">06</span>
              <h4 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-icat-yellow transition-colors">Saúde e Bem-Estar</h4>
              <p className="text-gray-600 mb-6 leading-relaxed">Campanhas educativas de orientação, prevenção, Defesa Pessoal para Mulheres e promoção do bem-estar.</p>
              <Link href="/areas-de-atuacao" className="inline-flex items-center font-bold text-icat-yellow group-hover:gap-2 transition-all">
                Saiba mais <ArrowUpRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROJETOS SECTION */}
      <section id="projetos" className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">Nossos Projetos</h2>
            <p className="mt-4 text-lg text-gray-600">
              Iniciativas estruturadas que transformam vidas e comunidades.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-all">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cesta Solidária</h3>
              <p className="text-gray-600 mb-4">Entrega mensal de cestas básicas para famílias em situação de extrema vulnerabilidade, cadastradas e acompanhadas por nossa equipe de assistência social.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-all">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Atleta do Futuro</h3>
              <p className="text-gray-600 mb-4">Escolinha de esportes focado em crianças e adolescentes, promovendo disciplina, trabalho em equipe e saúde física, além de tirá-los das ruas no contraturno escolar.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-all">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Qualifica Jovem</h3>
              <p className="text-gray-600 mb-4">Cursos de qualificação profissional básica (Informática, Atendimento, Rotinas Administrativas) para jovens em busca do primeiro emprego.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. IMPACTO SECTION */}
      <section id="impacto" className="py-24 bg-icat-blue text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1529156069898-49953eb1f5fc?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-icat-yellow uppercase tracking-wider mb-2">Nosso Impacto</h2>
            <h3 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Impacto que pode ser visto,<br/>histórias transformadas.
            </h3>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Nenhum número é estimado. Todos os dados refletem as famílias e pessoas atendidas através dos nossos programas.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            <div>
              <p className="text-5xl md:text-6xl font-black text-white mb-2">187</p>
              <p className="text-blue-200 font-medium tracking-wide uppercase text-sm">Pessoas Atendidas</p>
            </div>
            <div>
              <p className="text-5xl md:text-6xl font-black text-white mb-2">45</p>
              <p className="text-blue-200 font-medium tracking-wide uppercase text-sm">Famílias Beneficiadas</p>
            </div>
            <div>
              <p className="text-5xl md:text-6xl font-black text-white mb-2">112</p>
              <p className="text-blue-200 font-medium tracking-wide uppercase text-sm">Alunos Matriculados</p>
            </div>
            <div>
              <p className="text-5xl md:text-6xl font-black text-white mb-2">89</p>
              <p className="text-blue-200 font-medium tracking-wide uppercase text-sm">Benefícios Entregues</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PARCEIROS E CLUBE SECTION */}
      <section id="parceiros" className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">Empresas Parceiras & Clube de Vantagens</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto mb-12">
            Empresas que acreditam e patrocinam nossos projetos. Os alunos e doadores do ICAT ganham descontos exclusivos nessas lojas através do nosso Clube de Vantagens.
          </p>
          
          <div className="flex flex-wrap justify-center gap-12 items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex flex-col items-center gap-2">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold text-xl border-4 border-gray-50 shadow-inner">
                SICOOB
              </div>
              <span className="text-sm font-bold text-gray-800">Sicoob Credi</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold text-xl border-4 border-gray-50 shadow-inner">
                BRETAS
              </div>
              <span className="text-sm font-bold text-gray-800">Supermercado Bretas</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold text-xl border-4 border-gray-50 shadow-inner">
                FARM
              </div>
              <span className="text-sm font-bold text-gray-800">Farmácia Preço Baixo</span>
            </div>
          </div>
          
          <div className="mt-12">
            <a href="https://wa.me/5564999119610?text=Quero%20ser%20um%20parceiro%20do%20ICAT" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-icat-green bg-green-50 hover:bg-green-100 md:py-4 md:text-lg md:px-10 transition-all">
              Seja um Parceiro Oficial
            </a>
          </div>
        </div>
      </section>

      {/* Footer Minimalista */}
      <footer className="bg-white py-12 border-t border-gray-100 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <img src="/logo.png" alt="ICAT" className="h-10 mx-auto mb-6 grayscale opacity-60" />
          <p className="text-gray-500 font-medium mb-2">INSTITUTO CATALANO - ICAT</p>
          <p className="text-sm text-gray-400">© 2026. Catalão, Goiás. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/5564999119610" 
        target="_blank" rel="noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all hover:scale-110 z-50 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
      </a>
    </div>
  );
}
