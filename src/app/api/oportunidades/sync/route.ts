import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Exemplo de integração futura com o site da prefeitura
    // const response = await fetch('https://catalao.go.gov.br/vagas');
    // const html = await response.text();
    // const $ = cheerio.load(html);
    
    // Simulação do resultado do Crawler (para demonstrar a mecânica)
    const scrapedVagas = [
      {
        titulo: 'Auxiliar Administrativo',
        empresa: 'Prefeitura de Catalão (SINE)',
        local: 'Catalão, GO',
        tipo: 'Emprego',
        requisitos: 'Ensino Médio Completo, Informática Básica',
        status: 'Aberta'
      },
      {
        titulo: 'Técnico em Edificações',
        empresa: 'Prefeitura de Catalão (SINE)',
        local: 'Catalão, GO',
        tipo: 'Emprego',
        requisitos: 'Curso Técnico, CNH B',
        status: 'Aberta'
      }
    ];

    // Aqui seria feito o INSERT no Supabase:
    // const { data, error } = await supabase.from('oportunidades').upsert(scrapedVagas);

    return NextResponse.json({ 
      success: true, 
      message: 'Scraping das vagas do SINE/Prefeitura concluído com sucesso.', 
      vagas_encontradas: scrapedVagas.length,
      vagas: scrapedVagas 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao buscar vagas externas.' }, { status: 500 });
  }
}
