'use client';

import { useState } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { ChevronLeft, QrCode, Copy, Landmark, MessageCircle } from 'lucide-react';

export default function Doacoes() {
  const [valor, setValor] = useState<number | ''>(50);
  const [cpf, setCpf] = useState('');
  const [copiado, setCopiado] = useState(false);
  
  // Em um sistema real, o CNPJ viria de uma tabela de configurações.
  const cnpjConfig = '12.345.678/0001-90';
  
  // Payload simplificado do PIX (Em produção usaríamos uma lib como 'pix-payload-generator')
  const pixPayload = `00020126360014br.gov.bcb.pix0114${cnpjConfig.replace(/\D/g, '')}52040000530398654${valor ? valor.toString().padEnd(4, '0') : '0000'}5802BR5917INSTITUTO CATALANO6007CATALAO62070503***6304`;

  const valores = [20, 50, 100, 200];

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixPayload);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Simples */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center text-gray-500 hover:text-icat-green">
            <ChevronLeft className="w-5 h-5 mr-1" /> Voltar ao Início
          </Link>
          <img src="/logo.png" alt="ICAT" className="h-10 grayscale opacity-50" />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 pt-12 space-y-12">
        {/* Intro */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-gray-900">Faça parte dessa transformação</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sua contribuição ajuda o ICAT a ampliar projetos de educação, esporte, cultura e assistência social em Catalão.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulário de Doação */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-icat-green/10 p-3 rounded-xl">
                <QrCode className="text-icat-green w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Doação via PIX</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Selecione um valor:</label>
                <div className="grid grid-cols-4 gap-3">
                  {valores.map((v) => (
                    <button
                      key={v}
                      onClick={() => setValor(v)}
                      className={`py-3 rounded-xl font-bold transition-all ${
                        valor === v 
                        ? 'bg-icat-green text-white shadow-md' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      R$ {v}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ou digite outro valor:</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">R$</span>
                  <input 
                    type="number" 
                    value={valor} 
                    onChange={(e) => setValor(e.target.value ? Number(e.target.value) : '')}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-icat-green focus:border-transparent outline-none transition-all font-bold text-gray-900"
                    placeholder="0,00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seu CPF / CNPJ (Opcional):</label>
                <input 
                  type="text" 
                  value={cpf} 
                  onChange={(e) => setCpf(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-icat-green focus:border-transparent outline-none transition-all"
                  placeholder="000.000.000-00"
                />
              </div>
            </div>
          </div>

          {/* QR Code Panel */}
          <div className="bg-icat-blue p-8 rounded-3xl shadow-lg text-white flex flex-col items-center text-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            
            <p className="text-lg font-medium text-blue-100 mb-6 z-10">Escaneie o QR Code no app do seu banco</p>
            
            <div className="bg-white p-4 rounded-2xl mb-6 z-10">
              <QRCodeSVG 
                value={pixPayload}
                size={220}
                level="H"
                includeMargin={false}
                fgColor="#0057B8" // Azul do ICAT
              />
            </div>
            
            <p className="text-3xl font-black mb-6 z-10">R$ {valor || '0,00'}</p>
            
            <button 
              onClick={handleCopyPix}
              className="bg-white/20 hover:bg-white/30 text-white w-full py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2 z-10"
            >
              {copiado ? <><QrCode className="w-5 h-5"/> Copiado!</> : <><Copy className="w-5 h-5" /> Copiar Código PIX</>}
            </button>
          </div>
        </div>

        {/* Empresas e Imposto de Renda */}
        <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 mt-12 flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <div className="bg-icat-yellow/20 p-6 rounded-full flex-shrink-0">
            <Landmark className="w-16 h-16 text-icat-yellow" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">Sua empresa também pode transformar vidas!</h3>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Empresas podem apoiar os projetos do ICAT e fortalecer suas ações de responsabilidade social deduzindo doações do <strong>Imposto de Renda</strong>. Fale com nossa contabilidade para conhecer as possibilidades legais de apoio, incentivos fiscais e destinação de recursos.
            </p>
            <a 
              href="https://wa.me/5564999119610?text=Ol%C3%A1!+Quero+saber+como+minha+empresa+pode+apoiar+o+ICAT+e+conhecer+as+possibilidades+legais+de+destina%C3%A7%C3%A3o+de+recursos+e+incentivos+fiscais." 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20b858] text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all uppercase tracking-wide text-sm"
            >
              <MessageCircle className="w-5 h-5" />
              Fale direto com nosso contador. Ele te ajudará a nos ajudar!
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
