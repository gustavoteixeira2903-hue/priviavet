"use client";
import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { ShieldCheck, FileSignature, Printer, Send, X, Edit3, ClipboardList, AlertCircle } from 'lucide-react';

interface Documento {
  id: number;
  titulo: string;
  desc: string;
  tipo: string;
  conteudo: string;
}

export default function Termos() {
  const [docAberto, setDocAberto] = useState<{ id: number; titulo: string } | null>(null);
  const [textoEditavel, setTextoEditavel] = useState('');

  const documentos: Documento[] = [
    { 
      id: 1, 
      titulo: 'Receituário Médico Veterinário', 
      desc: 'Prescrição de medicamentos, dosagens e recomendações de uso livre.',
      tipo: 'receita',
      conteudo: 'RECEITUÁRIO VETERINÁRIO\n\nPaciente: \nTutor: \nData: \n\nUSO INTERNO / EXTERNO:\n\n1. \n   Administrar:\n\n2. \n   Administrar:\n\nRecomendações adicionais:\n\n\n\n___________________________________\nCarimbo e Assinatura do Médico Veterinário'
    },
    { 
      id: 2, 
      titulo: 'Termo de Consentimento (LGPD)', 
      desc: 'Para o tutor assinar autorizando o cadastro na clínica e envio de exames.',
      tipo: 'termo',
      conteudo: 'TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO PARA TRATAMENTO DE DADOS PESSOAIS\n\nEu, abaixo assinado, na qualidade de Tutor(a), autorizo a CLÍNICA VETERINÁRIA a realizar a coleta, armazenamento e tratamento dos meus dados pessoais (Nome, CPF, Endereço, Contato) estritamente para a finalidade de prestação de serviços veterinários, emissão de receituários, notas fiscais e compartilhamento com laboratórios parceiros.\n\nDeclaro estar ciente dos meus direitos previstos na Lei Geral de Proteção de Dados (Lei nº 13.709/2018).'
    },
    { 
      id: 3, 
      titulo: 'Autorização Cirúrgica / Anestésica', 
      desc: 'Isenção de responsabilidade padrão e ciência de riscos para intervenções.',
      tipo: 'termo',
      conteudo: 'TERMO DE AUTORIZAÇÃO PARA PROCEDIMENTO CIRÚRGICO E ANESTÉSICO\n\nAutorizo a equipe médica veterinária a realizar os procedimentos cirúrgicos e anestésicos necessários no meu animal.\n\nFui devidamente informado(a) pelo(a) Médico(a) Veterinário(a) sobre o quadro clínico do paciente, bem como sobre os riscos inerentes ao procedimento anestésico e cirúrgico, incluindo o risco de óbito, eximindo a equipe de responsabilidades sobre intercorrências imprevisíveis.'
    },
    { 
      id: 4, 
      titulo: 'Termo de Ciência de Custos e Orçamento', 
      desc: 'Estimativa prévia de despesas com internação, exames, cirurgias e medicamentos.',
      tipo: 'termo',
      conteudo: 'TERMO DE CIÊNCIA DE CUSTOS E ORÇAMENTO PRÉVIO\n\nPaciente: \nTutor: \nData: \n\nDeclaro estar ciente e de acordo com a estimativa de custos apresentada pela equipe médica veterinária para a realização dos procedimentos, exames, internação, intervenções cirúrgicas e fornecimento de medicamentos necessários ao tratamento do paciente.\n\nCompreendo que valores adicionais poderão incidir caso haja necessidade de alteração na conduta terapêutica, prolongamento da internação ou exames complementares de urgência, sendo devidamente comunicado(a) prévia ou postumamente.\n\nAssumo total responsabilidade financeira pelos encargos decorrentes dos serviços prestados até a data da alta médica ou desfecho clínico.\n\n\n\n___________________________________\nAssinatura do(a) Tutor(a)'
    }
  ];

  const abrirVisualizador = (doc: Documento) => {
    setDocAberto({ id: doc.id, titulo: doc.titulo });
    setTextoEditavel(doc.conteudo);
  };

  const abrirWhatsapp = (titulo: string) => {
    const texto = encodeURIComponent("Olá! Segue o link para assinatura digital do seu documento: " + titulo + ". Atenciosamente, Clínica PriviaVet.");
    window.open("https://wa.me/?text=" + texto, '_blank');
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden relative text-slate-900">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center mb-2">
              <ShieldCheck className="mr-2 text-blue-600" /> Emissão de Documentos
            </h2>
            <p className="text-slate-600 text-sm">Edite, imprima ou envie receitas médicas e termos jurídicos formatados para a assinatura do tutor.</p>
          </div>

          <div className="space-y-4">
            {documentos.map(doc => (
              <div key={doc.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between hover:border-emerald-300 transition">
                <div className="mb-4 md:mb-0 flex-1">
                  <h3 className="font-bold text-lg text-slate-800 flex items-center">
                    {doc.tipo === 'receita' ? (
                      <ClipboardList size={18} className="mr-2 text-emerald-600" />
                    ) : (
                      <FileSignature size={18} className="mr-2 text-slate-500" />
                    )}
                    {doc.titulo}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 ml-6">{doc.desc}</p>
                </div>
                
                <div className="flex space-x-2 shrink-0">
                  <button type="button" onClick={() => abrirVisualizador(doc)} className="flex items-center px-3 py-2 bg-slate-100 text-slate-700 rounded text-sm font-medium hover:bg-slate-200 transition">
                    <Edit3 size={16} className="mr-2" /> Editar e Imprimir
                  </button>
                  <button type="button" onClick={() => abrirWhatsapp(doc.titulo)} className="flex items-center px-3 py-2 bg-emerald-600 text-white rounded text-sm font-medium hover:bg-emerald-700 transition">
                    <Send size={16} className="mr-2" /> Enviar (WhatsApp)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {docAberto && (
        <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50 rounded-t-lg">
              <h3 className="font-bold text-slate-800 flex items-center text-sm">
                <Edit3 size={18} className="mr-2 text-blue-600" /> Modo de Edição Livre: {docAberto.titulo}
              </h3>
              <button type="button" onClick={() => setDocAberto(null)} className="text-slate-500 hover:text-slate-800"><X size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-slate-200">
              <div className="bg-white shadow-md border border-slate-300 min-h-[500px] flex flex-col">
                <textarea 
                  value={textoEditavel}
                  onChange={(e) => setTextoEditavel(e.target.value)}
                  className="w-full h-full min-h-[500px] p-10 resize-none outline-none font-serif text-slate-800 text-sm leading-relaxed bg-transparent"
                  spellCheck={false}
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 flex justify-between items-center bg-slate-50 rounded-b-lg">
              <p className="text-xs text-slate-500 flex items-center"><AlertCircle size={14} className="mr-1"/> Podes alterar qualquer texto antes de imprimir.</p>
              <div className="flex space-x-3">
                <button type="button" onClick={() => setDocAberto(null)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded text-sm">
                  Cancelar
                </button>
                <button type="button" onClick={() => { alert('Documento gerado e enviado para a impressora!'); setDocAberto(null); }} className="px-4 py-2 bg-slate-900 text-white font-medium hover:bg-slate-800 rounded flex items-center shadow-md text-sm">
                  <Printer size={18} className="mr-2" /> Imprimir Documento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
