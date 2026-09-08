'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, User, Heart, Briefcase, Camera } from 'lucide-react';

export default function ProfessorCadastro() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    dataNascimento: '',
    whatsapp: '',
    email: '',
    formacao: '',
    areaInteresse: '',
    endereco: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
          <p className="text-gray-600 mb-6">Analisaremos seu perfil e entraremos em contato.</p>
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
          <h2 className="text-2xl font-bold text-gray-800">Seja um Voluntário / Professor</h2>
          <p className="mt-2 text-gray-600">Junte-se à nossa equipe e transforme vidas</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-6 sm:p-10 space-y-8">
          
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-200 transition-colors">
              <Camera className="w-8 h-8 mb-2" />
              <span className="text-xs">Upload de Foto</span>
            </div>
          </div>

          {/* Dados Pessoais */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center mb-4">
              <User className="w-5 h-5 mr-2 text-icat-green" />
              Dados Pessoais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-icat-green focus:border-icat-green outline-none transition-all" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo *</label>
                <textarea required name="endereco" value={formData.endereco} onChange={handleInputChange} rows={2} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-icat-green focus:border-icat-green outline-none transition-all"></textarea>
              </div>
            </div>
          </div>

          {/* Perfil Profissional */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center mb-4">
              <Briefcase className="w-5 h-5 mr-2 text-icat-green" />
              Perfil Profissional
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Formação Acadêmica / Experiência *</label>
                <textarea required name="formacao" value={formData.formacao} onChange={handleInputChange} rows={3} placeholder="Descreva sua formação, cursos e experiência relevante" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-icat-green focus:border-icat-green outline-none transition-all"></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Área de Interesse para Atuação *</label>
                <select required name="areaInteresse" value={formData.areaInteresse} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-icat-green focus:border-icat-green outline-none transition-all">
                  <option value="">Selecione uma área...</option>
                  <option value="esportes">Esportes (Futebol, Artes Marciais, etc)</option>
                  <option value="cultura">Cultura (Ballet, Teatro, Música)</option>
                  <option value="educacao">Educação (Informática, Reforço Escolar)</option>
                  <option value="assistencia">Assistência Social / Psicologia</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full bg-[#20B2AA] hover:bg-[#1C9C95] text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg hover:shadow-xl btn-primary">
              Enviar Perfil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
