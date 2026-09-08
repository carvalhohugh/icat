'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, GraduationCap, Heart, User, ClipboardList } from 'lucide-react';

export default function AlunoCadastro() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nomeAluno: '',
    dataNascimento: '',
    curso: '',
    nomeResponsavel: '',
    cpfResponsavel: '',
    whatsapp: ''
  });

  const cursos = [
    { id: 'futebol', nome: 'Escolinha de Futebol', vagas: 15 },
    { id: 'ballet', nome: 'Ballet Infantil', vagas: 8 },
    { id: 'informatica', nome: 'Informática Básica', vagas: 20 },
    { id: 'jiujitsu', nome: 'Jiu-Jítsu', vagas: 12 }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Inscrição realizada!</h2>
          <p className="text-gray-600 mb-6">Entraremos em contato pelo WhatsApp para confirmar a matrícula.</p>
          <Link href="/" className="text-icat-blue hover:underline font-medium">Voltar ao site</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center text-icat-blue hover:text-icat-green transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao site
          </Link>
          <div className="flex justify-center items-center mb-4">
            <Heart className="w-10 h-10 text-icat-green mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">Projeto ICAT</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Inscrição de Aluno</h2>
          <p className="mt-2 text-gray-600">Garanta a vaga em nossas atividades sociais e esportivas</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-6 sm:p-10 space-y-8">
          {/* Dados do Curso */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center mb-4">
              <ClipboardList className="w-5 h-5 mr-2 text-icat-green" />
              Seleção de Turma
            </h3>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Turma / Curso Desejado *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cursos.map(curso => (
                  <label key={curso.id} className={`border rounded-lg p-4 cursor-pointer transition-all ${formData.curso === curso.id ? 'border-icat-green bg-green-50 ring-2 ring-icat-green ring-opacity-50' : 'hover:border-gray-400'}`}>
                    <div className="flex items-center">
                      <input type="radio" name="curso" value={curso.id} checked={formData.curso === curso.id} onChange={handleInputChange} className="h-4 w-4 text-icat-green focus:ring-icat-green border-gray-300" required />
                      <span className="ml-3 block font-medium text-gray-900">{curso.nome}</span>
                    </div>
                    <p className="ml-7 mt-1 text-sm text-gray-500">{curso.vagas} vagas disponíveis</p>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Dados do Aluno */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center mb-4">
              <GraduationCap className="w-5 h-5 mr-2 text-icat-green" />
              Dados do Aluno
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo do Aluno *</label>
                <input required type="text" name="nomeAluno" value={formData.nomeAluno} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-icat-green focus:border-icat-green outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento *</label>
                <input required type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-icat-green focus:border-icat-green outline-none transition-all" />
              </div>
            </div>
          </div>

          {/* Dados do Responsável */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center mb-4">
              <User className="w-5 h-5 mr-2 text-icat-green" />
              Dados do Responsável
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Responsável *</label>
                <input required type="text" name="nomeResponsavel" value={formData.nomeResponsavel} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-icat-green focus:border-icat-green outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CPF do Responsável *</label>
                <input required type="text" name="cpfResponsavel" value={formData.cpfResponsavel} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-icat-green focus:border-icat-green outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp *</label>
                <input required type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-icat-green focus:border-icat-green outline-none transition-all" />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full bg-[#20B2AA] hover:bg-[#1C9C95] text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg hover:shadow-xl btn-primary">
              Confirmar Inscrição
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
