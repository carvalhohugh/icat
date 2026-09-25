import { NextResponse } from 'next/server';
import * as mammoth from 'mammoth';

interface ExtractedOption {
  id: string;
  nome: string;
  partido: string;
  foto: string;
}

interface ExtractedQuestion {
  id: string;
  titulo: string;
  tipo: string;
  multiSelect: boolean;
  opcoes: ExtractedOption[];
}

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const textData = data.get('text') as string;
    const file = data.get('file') as File;

    let textContent = textData || '';

    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (file.name.endsWith('.docx')) {
        const result = await mammoth.extractRawText({ buffer });
        textContent = result.value;
      } else if (file.name.endsWith('.pdf')) {
        const pdfParse = require('pdf-parse');
        const result = await pdfParse(buffer);
        textContent = result.text;
      } else if (file.name.endsWith('.txt')) {
        textContent = buffer.toString('utf-8');
      }
    }

    if (!textContent) {
      return NextResponse.json({ error: 'Nenhum texto ou arquivo válido enviado.' }, { status: 400 });
    }

    // Heuristic Parsing
    const lines = textContent.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const questions: ExtractedQuestion[] = [];
    let currentQ: ExtractedQuestion | null = null;

    for (let line of lines) {
      // Ignore common noise (e.g. page numbers)
      if (line.toLowerCase().includes('página') && line.length < 15) continue;

      // Question detection heuristics
      const isQuestion = 
        /^\d+[\.\-\)]\s+/.test(line) || // starts with number + dot/dash/paren
        line.endsWith('?') ||           // ends with ?
        line.includes('?') ||           // contains ?
        (line === line.toUpperCase() && line.length > 15); // ALL CAPS TITLE

      const isOptionList = /^[a-zA-Z][\.\-\)]\s+/.test(line) || /^[\-\*]\s+/.test(line) || /^\[\s*\]/.test(line);

      if (isQuestion && !isOptionList) {
        if (currentQ) questions.push(currentQ);
        let title = line.replace(/^\d+[\.\-\)]\s+/, '').trim();
        
        currentQ = {
          id: 'p' + Date.now() + Math.random().toString(36).substr(2, 9),
          titulo: title,
          tipo: (title.toLowerCase().includes('espont') || title.toLowerCase().includes('aberta')) ? 'Espontânea' : 'Induzida',
          multiSelect: title.toLowerCase().includes('múltipla') || title.toLowerCase().includes('vários') || title.toLowerCase().includes('mais de um'),
          opcoes: []
        };
      } else {
        // Assume it's an option
        let optionName = line.replace(/^[a-zA-Z][\.\-\)]\s+/, '').replace(/^[\-\*]\s+/, '').replace(/^\[\s*\]\s*/, '').trim();
        
        // Ignore single numbers or completely empty after clean up
        if (!/^\d+$/.test(optionName) && optionName.length > 0) {
          if (!currentQ) {
            currentQ = {
              id: 'p' + Date.now() + Math.random().toString(36).substr(2, 9),
              titulo: 'Pergunta 1',
              tipo: 'Induzida',
              multiSelect: false,
              opcoes: []
            };
          }
          currentQ.opcoes.push({
            id: 'o' + Date.now() + Math.random().toString(36).substr(2, 9),
            nome: optionName,
            partido: '',
            foto: ''
          });
        }
      }
    }

    if (currentQ) questions.push(currentQ);

    return NextResponse.json({ perguntas: questions, raw: textContent });
  } catch (error) {
    console.error('Error extracting text:', error);
    return NextResponse.json({ error: 'Erro ao processar o documento.' }, { status: 500 });
  }
}
