import React, { useEffect, useState } from 'react';

export function PrintHeader({ title }: { title: string }) {
  const [config, setConfig] = useState({
    razao: 'Instituto Catalano - ICAT',
    cnpj: '00.000.000/0001-00',
    endereco: 'Rua das Margaridas, 123 - Centro, Catalão - GO, 75701-000',
    contato: '(64) 3441-0000 | (64) 99999-0000',
    email: 'contato@institutocatalano.com.br'
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('icat_config_instituicao');
      if (saved) {
        setConfig(JSON.parse(saved));
      }
    } catch(e) {}
  }, []);

  return (
    <div className="hidden print:flex flex-col mb-8 border-b-2 border-gray-800 pb-6 items-center text-center">
      <img src="/logo.png" alt="ICAT Logo" className="h-24 w-auto object-contain mb-4" />
      <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2">{title}</h1>
      <div className="text-sm text-gray-600">
        <p className="font-bold text-gray-900">{config.razao}</p>
        <p>CNPJ: {config.cnpj}</p>
        <p>{config.endereco}</p>
        <p>Contato: {config.contato}</p>
        <p>Email: {config.email}</p>
      </div>
      <p className="text-xs text-gray-400 mt-4 self-end">Gerado em: {new Date().toLocaleDateString('pt-BR')}</p>
    </div>
  );
}
