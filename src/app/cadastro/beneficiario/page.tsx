'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, User, Home, Users, Heart } from 'lucide-react';

export default function BeneficiarioCadastro() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    dataNascimento: '',
    whatsapp: '',
    estadoCivil: '',
    nomeConjuge: '',
    temFilhos: 'nao',
    cep: '',
    logradouro: '',
    bairro: '',
    cidade: '',
    uf: '',
    rendaFamiliar: ''
  });

  const [filhos, setFilhos] = useState([{ nome: '', dataNascimento: '' }]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFilhoChange = (index: number, field: string, value: string) => {
    const novosFilhos = [...filhos];
    novosFilhos[index] = { ...novosFilhos[index], [field]: value };
    setFilhos(novosFilhos);
  };

  const addFilho = () => {
    setFilhos([...filhos, { nome: '', dataNascimento: '' }]);
  };

  const removeFilho = (index: number) => {
    const novosFilhos = filhos.filter((_, i) => i !== index);
    setFilhos(novosFilhos);
  };

  const buscarCep = async () => {
    const cepNumerico = formData.cep.replace(/\D/g, '');
    if (cepNumerico.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepNumerico}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            logradouro: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            uf: data.uf || ''
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar CEP', error);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <CheckCircle2 className="w-16 h-16 text-icat-green mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Cadastro recebido!</h2>
          <p className="text-gray-600 mb-6">Nossa equipe de assistência social entrará em contato pelo WhatsApp.</p>
          <Link href="/" className="text-icat-blue hover:underline font-medium">Voltar ao site</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center text-icat-blue hover:text-icat-green transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao site
          </Link>
          <div className="flex justify-center items-center mb-4">
            <Heart className="w-10 h-10 text-icat-green mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">Projeto ICAT</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Cadastro de Beneficiário</h2>
          <p className="mt-2 text-gray-600">Preencha o formulário para solicitar assistência</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-6 sm:p-10 space-y-8">
          {/* Dados Pessoais */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center mb-4">
              <User className="w-5 h-5 mr-2 text-icat-green" />
              Dados Pessoais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Responsável *</label>
                <input required type="text" name="nome" value={formData.nome} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-icat-green focus:border-icat-green outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CPF *</label>
                <input required type="text" name="cpf" value={formData.cpf} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-icat-green focus:border-icat-green outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento *</label>
                <input required type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-icat-green focus:border-icat-green outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp *</label>
                <input required type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-icat-green focus:border-icat-green outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado Civil *</label>
                <select required name="estadoCivil" value={formData.estadoCivil} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-icat-green focus:border-icat-green outline-none transition-all">
                  <option value="">Selecione...</option>
                  <option value="solteiro">Solteiro(a)</option>
                  <option value="casado">Casado(a)</option>
                  <option value="divorciado">Divorciado(a)</option>
                  <option value="viuvo">Viúvo(a)</option>
                </select>
              </div>
              {formData.estadoCivil === 'casado' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Cônjuge</label>
                  <input type="text" name="nomeConjuge" value={formData.nomeConjuge} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-icat-green focus:border-icat-green outline-none transition-all" />
                </div>
              )}
            </div>
          </div>

          {/* Composição Familiar */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center mb-4">
              <Users className="w-5 h-5 mr-2 text-icat-green" />
              Composição Familiar
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tem Filhos? *</label>
                <select name="temFilhos" value={formData.temFilhos} onChange={handleInputChange} className="w-full md:w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-icat-green focus:border-icat-green outline-none transition-all">
                  <option value="nao">Não</option>
                  <option value="sim">Sim</option>
                </select>
              </div>

              {formData.temFilhos === 'sim' && (
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg border">
                  {filhos.map((filho, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-4 items-end">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Nome do Filho</label>
                        <input type="text" value={filho.nome} onChange={(e) => handleFilhoChange(index, 'nome', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Data de Nasc.</label>
                        <input type="date" value={filho.dataNascimento} onChange={(e) => handleFilhoChange(index, 'dataNascimento', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-icat-green outline-none" />
                      </div>
                      {index > 0 && (
                        <button type="button" onClick={() => removeFilho(index)} className="px-3 py-2 text-red-600 border border-red-200 hover:bg-red-50 rounded-lg">Remover</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={addFilho} className="text-sm font-medium text-icat-green hover:text-green-700">+ Adicionar outro filho</button>
                </div>
              )}
            </div>
          </div>

          {/* Endereço */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center mb-4">
              <Home className="w-5 h-5 mr-2 text-icat-green" />
              Endereço e Informações Adicionais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CEP *</label>
                <input required type="text" name="cep" value={formData.cep} onChange={handleInputChange} onBlur={buscarCep} placeholder="00000-000" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-icat-green focus:border-icat-green outline-none transition-all" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Logradouro *</label>
                <input required type="text" name="logradouro" value={formData.logradouro} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-icat-green focus:border-icat-green outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bairro *</label>
                <input required type="text" name="bairro" value={formData.bairro} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-icat-green focus:border-icat-green outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade *</label>
                <input required type="text" name="cidade" value={formData.cidade} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-icat-green focus:border-icat-green outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">UF *</label>
                <input required type="text" name="uf" value={formData.uf} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-icat-green focus:border-icat-green outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Renda Familiar Mensal *</label>
                <input required type="text" name="rendaFamiliar" value={formData.rendaFamiliar} onChange={handleInputChange} placeholder="R$ 0,00" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-icat-green focus:border-icat-green outline-none transition-all" />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full bg-[#20B2AA] hover:bg-[#1C9C95] text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg hover:shadow-xl btn-primary">
              Enviar Solicitação de Cadastro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
