export const mockAiGenerator = {
  generateDescription: async (title: string, contextType: 'projeto' | 'curso' | 'evento') => {
    // Simulando delay de API
    await new Promise(resolve => setTimeout(resolve, 800));

    const lowerTitle = title.toLowerCase();

    if (contextType === 'curso') {
      if (lowerTitle.includes('informática') || lowerTitle.includes('tecnologia')) {
        return `O curso "${title}" oferece uma formação completa e atualizada, focada na inclusão digital e no preparo prático para o mercado de trabalho. Com metodologia passo a passo, os alunos aprendem desde o básico até o uso de ferramentas profissionais, ganhando independência e novas oportunidades de carreira.`;
      }
      if (lowerTitle.includes('inglês') || lowerTitle.includes('idioma')) {
        return `O curso "${title}" foi desenhado para quebrar barreiras na comunicação. Com foco em conversação prática do dia a dia, vocabulário e expressões reais, ajudamos jovens e adultos a darem o primeiro passo rumo à fluência, abrindo portas para o futuro profissional e acadêmico.`;
      }
      if (lowerTitle.includes('futebol') || lowerTitle.includes('esporte')) {
        return `Mais que um esporte, o projeto "${title}" é uma escola de cidadania. Através da prática esportiva orientada, trabalhamos disciplina, trabalho em equipe, respeito e coordenação física, promovendo saúde e inclusão social para nossas crianças e adolescentes.`;
      }
      return `O curso "${title}" é mais uma iniciativa do ICAT focada em qualificação e desenvolvimento humano. Com turmas reduzidas e instrutores capacitados, oferecemos uma base sólida de conhecimento para que nossos alunos possam transformar suas realidades e alcançar novos objetivos profissionais e pessoais.`;
    }

    if (contextType === 'projeto') {
      if (lowerTitle.includes('reforço') && lowerTitle.includes('fundamental')) {
        return `O projeto "${title}" oferece apoio pedagógico direcionado para alunos da rede pública do ensino fundamental. Nosso objetivo é combater a defasagem escolar, auxiliando nas tarefas, tirando dúvidas e fortalecendo a base nas disciplinas essenciais como Matemática e Português.`;
      }
      if (lowerTitle.includes('reforço') && lowerTitle.includes('médio')) {
        return `Focado nos desafios do Ensino Médio, o projeto "${title}" visa aprofundar os conhecimentos dos alunos, oferecendo suporte especializado nas disciplinas de exatas e humanas. Preparamos o aluno não apenas para a escola, mas para os desafios dos exames externos.`;
      }
      if (lowerTitle.includes('enem')) {
        return `O projeto "${title}" é um preparatório intensivo criado para democratizar o acesso à universidade. Com professores voluntários especializados, material focado nos temas mais cobrados e simulados regulares, guiamos nossos alunos da escola pública na jornada rumo ao Ensino Superior.`;
      }
      if (lowerTitle.includes('cesta') || lowerTitle.includes('alimento') || lowerTitle.includes('solidária')) {
        return `O projeto "${title}" é o braço de segurança alimentar do ICAT. Realizamos o mapeamento e acompanhamento de famílias em extrema vulnerabilidade, garantindo a entrega regular de suprimentos básicos, sempre aliada ao suporte da nossa equipe de assistência social para emancipação dessas famílias.`;
      }
      return `A iniciativa "${title}" reforça o compromisso do Instituto Catalano com a comunidade. Atuando diretamente nas necessidades locais, o projeto mobiliza recursos, voluntários e conhecimento técnico para gerar impacto positivo e transformação social contínua.`;
    }

    if (contextType === 'evento') {
      if (lowerTitle.includes('palestra') || lowerTitle.includes('seminário')) {
        return `A(o) "${title}" será um encontro imperdível voltado para a troca de conhecimentos e experiências. Reunindo especialistas convidados e a comunidade, debateremos temas atuais e relevantes, promovendo networking, aprendizado prático e muita inspiração.`;
      }
      if (lowerTitle.includes('mutirão') || lowerTitle.includes('ação social')) {
        return `Participe do "${title}", um grande dia dedicado a servir nossa comunidade! Concentraremos em um único local serviços gratuitos de saúde, orientação jurídica, assistência social e recreação para as crianças. Um esforço coletivo para levar cidadania a quem mais precisa.`;
      }
      return `O evento "${title}" é uma grande oportunidade para estarmos juntos! Preparamos uma programação especial, organizada com muito carinho, para envolver a comunidade, parceiros e voluntários em momentos de alegria, integração e propósito. Não fique de fora!`;
    }

    return `A descrição para "${title}" está sendo desenvolvida com base nas necessidades da nossa comunidade. Em breve, atualizaremos com todos os detalhes desta incrível iniciativa do Instituto Catalano.`;
  },

  generateSurveyOptions: async (title: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('governo') && lowerTitle.includes('goiás')) {
      return [
        { nome: 'Ronaldo Caiado (Atual / Apoio)', partido: 'UB' },
        { nome: 'Daniel Vilela', partido: 'MDB' },
        { nome: 'Vitor Hugo', partido: 'PL' },
        { nome: 'Wilder Morais', partido: 'PL' },
        { nome: 'Adriana Accorsi', partido: 'PT' },
        { nome: 'Branco/Nulo', partido: '' },
        { nome: 'Não sabe/Não responde', partido: '' }
      ];
    }
    
    if (lowerTitle.includes('prefeito') || lowerTitle.includes('catalão')) {
      return [
        { nome: 'Velomar Rios', partido: 'MDB' },
        { nome: 'Renato Ribeiro', partido: 'PL' },
        { nome: 'Elder Galdino', partido: 'Republicanos' },
        { nome: 'Maria Moura', partido: 'PT' },
        { nome: 'Branco/Nulo', partido: '' },
        { nome: 'Não sabe/Não responde', partido: '' }
      ];
    }

    if (lowerTitle.includes('avaliação') || lowerTitle.includes('satisfação') || lowerTitle.includes('gestão')) {
      return [
        { nome: 'Ótima', partido: '' },
        { nome: 'Boa', partido: '' },
        { nome: 'Regular', partido: '' },
        { nome: 'Ruim', partido: '' },
        { nome: 'Péssima', partido: '' }
      ];
    }

    // Default Survey Options
    return [
      { nome: 'Muito Favorável', partido: '' },
      { nome: 'Favorável', partido: '' },
      { nome: 'Indiferente', partido: '' },
      { nome: 'Desfavorável', partido: '' },
      { nome: 'Muito Desfavorável', partido: '' }
    ];
  }
};
