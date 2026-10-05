"use client";
import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { Users, Search, AlertCircle, CheckCircle2, X, Clock, FileText } from 'lucide-react';

export default function Pacientes() {
  const [tutores, setTutores] = useState([
    { id: 1, nome: 'Carlos Eduardo Silva', cpf: '000.111.222-33', paciente: 'Rex (Canino)', lgpd: true },
    { id: 2, nome: 'Mariana Souza', cpf: '111.222.333-44', paciente: 'Mimi (Felino)', lgpd: false },
    { id: 3, nome: 'Roberto Alves', cpf: '222.333.444-55', paciente: 'Thor (Canino)', lgpd: true },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [novo, setNovo] = useState({ nome: '', cpf: '', paciente: '', lgpd: false });
  const [prontuarioAberto, setProntuarioAberto] = useState(null);

  const handleSalvar = (e) => {
    e.preventDefault();
    setTutores([...tutores, { id: Date.now(), ...novo }]);
    setShowModal(false);
    setNovo({ nome: '', cpf: '', paciente: '', lgpd: false });
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden relative text-slate-900">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
              <Users className="mr-2 text-emerald-600" /> Gestão de Pacientes & Tutores
            </h2>
            <button onClick={() => setShowModal(true)} className="bg-slate-900 text-white px-4 py-2 rounded font-medium hover:bg-slate-800 transition shadow-md text-sm">
              + Novo Cadastro
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input type="text" placeholder="Buscar por nome do tutor, CPF ou paciente..." className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md outline-none focus:border-emerald-500 text-sm bg-white" />
              </div>
            </div>
            
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                  <th className="p-4 font-semibold">Tutor</th>
                  <th className="p-4 font-semibold">CPF</th>
                  <th className="p-4 font-semibold">Paciente</th>
                  <th className="p-4 font-semibold">Status LGPD</th>
                  <th className="p-4 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {tutores.map(t => (
                  <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="p-4 font-medium text-slate-800">{t.nome}</td>
                    <td className="p-4 text-slate-600">{t.cpf}</td>
                    <td className="p-4 text-slate-600">{t.paciente}</td>
                    <td className="p-4">
                      {t.lgpd ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          <CheckCircle2 size={14} className="mr-1" /> Assinado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertCircle size={14} className="mr-1" /> Pendente
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <button onClick={() => setProntuarioAberto(t)} className="text-emerald-600 font-medium text-sm hover:underline flex items-center">
                        <FileText size={16} className="mr-1" /> Ver Prontuário
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800">Novo Cadastro</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-800"><X size={20} /></button>
            </div>
            <form onSubmit={handleSalvar} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nome do Tutor</label>
                <input type="text" required value={novo.nome} onChange={e => setNovo({...novo, nome: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:border-emerald-500 outline-none text-sm bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">CPF</label>
                <input type="text" required value={novo.cpf} onChange={e => setNovo({...novo, cpf: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:border-emerald-500 outline-none text-sm bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nome do Paciente (Espécie)</label>
                <input type="text" required value={novo.paciente} onChange={e => setNovo({...novo, paciente: e.target.value})} placeholder="Ex: Bob (Canino)" className="w-full p-2 border border-slate-300 rounded focus:border-emerald-500 outline-none text-sm bg-white" />
              </div>
              <div className="flex items-center mt-2 p-3 bg-slate-50 border border-slate-200 rounded">
                <input type="checkbox" id="lgpd" checked={novo.lgpd} onChange={e => setNovo({...novo, lgpd: e.target.checked})} className="mr-2 w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded" />
                <label htmlFor="lgpd" className="text-sm text-slate-700 font-medium cursor-pointer">Tutor já assinou o Termo LGPD</label>
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-2 rounded hover:bg-emerald-700 transition mt-4 text-sm">
                Salvar Cadastro
              </button>
            </form>
          </div>
        </div>
      )}

      {prontuarioAberto && (
        <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50 rounded-t-lg">
              <h3 className="font-bold text-slate-800 flex items-center text-sm">
                <Clock size={18} className="mr-2 text-emerald-600" /> Histórico Clínico: {prontuarioAberto.paciente}
              </h3>
              <button onClick={() => setProntuarioAberto(null)} className="text-slate-500 hover:text-slate-800"><X size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="border-l-2 border-emerald-500 pl-4 relative">
                <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-[7px] top-1"></div>
                <p className="text-sm text-slate-500 font-bold mb-1">Há 2 dias</p>
                <p className="text-slate-800 font-medium">Atendimento de Emergência (Gastroenterite)</p>
                <p className="text-sm text-slate-600 mt-1">Paciente apresentou êmese e diarreia. Diagnóstico diferencial sugerido por IA: Parvovirose. Exames solicitados e medicação de suporte administrada.</p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 flex justify-between bg-slate-50 rounded-b-lg">
              <button className="px-4 py-2 text-emerald-600 font-bold hover:bg-emerald-50 rounded transition text-sm">
                Baixar Histórico Completo
              </button>
              <button onClick={() => setProntuarioAberto(null)} className="px-4 py-2 bg-slate-900 text-white font-medium hover:bg-slate-800 rounded text-sm">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
