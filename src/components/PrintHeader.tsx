import React from 'react';

export function PrintHeader({ title }: { title: string }) {
  return (
    <div className="hidden print:flex flex-col mb-8 border-b-2 border-gray-800 pb-6">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{title}</h1>
          <div className="mt-4 text-sm text-gray-600">
            <p className="font-bold text-gray-900">Instituto Catalano - ICAT</p>
            <p>CNPJ: 00.000.000/0001-00</p>
            <p>Rua das Margaridas, 123 - Centro</p>
            <p>Catalão - GO, 75701-000</p>
            <p className="mt-2">Contato: (64) 3441-0000 | (64) 99999-0000</p>
            <p>Email: contato@icat.org.br</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <img src="/logo.png" alt="ICAT Logo" className="h-20 w-auto object-contain" />
          <p className="text-xs text-gray-400 mt-2">Documento gerado em: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>
    </div>
  );
}
