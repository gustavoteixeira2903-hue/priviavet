"use client";
import React, { useState } from 'react';
import Sidebar from '../layout/Sidebar';
import { Stethoscope, Sparkles, CheckCircle, FileText } from 'lucide-react';

export default function AnamneseIA() {
  const [sintomas, setSintomas] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

  const handleAnalisar = (e) => {
    e.preventDefault();
    if (!sintomas.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResultado({
        hipoteses: ['Gastroenterite Hemorrágica', 'Parvovirose Canina', 'Coronavirose'],
        conduta: 'Solicitar hemograma completo, PCR para parvovirose e iniciar suporte fluidoterápico imediato com Ringer Lactato.',
        medicamentos: ['Plasil (Metoclopramida) 0,5mg/kg', 'Ondansetrona 0,2mg/kg', 'Protetor gástrico']
      });
    }, 800);
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-900">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center mb-2">
              <Sparkles className="mr-2 text-emerald-600" /> Anamnese com IA Autônoma
            </h2>
            <p className="text-slate-600 text-sm">Insira os sintomas observados na consulta para gerar hipóteses diagnósticas e condutas veterinárias precisas.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
            <form onSubmit={handleAnalisar} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Histórico e Sintomas do Paciente</label>
                <textarea 
                  rows={4}
                  value={sintomas}
                  onChange={(e) => setSintomas(e.target.value)}
                  placeholder="Ex: Canino, 8 meses, apatia severa, êmese com estrias de sangue e diarreia fétida há 2 dias..."
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-slate-900 bg-white"
                />
              </div>
              <button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-lg transition shadow-md flex items-center text-sm">
                {loading ? 'Analisando sintomas...' : <><Sparkles size={16} className="mr-2" /> Gerar Análise Clínica por IA</>}
              </button>
            </form>
          </div>

          {resultado && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-200 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center">
                  <Stethoscope className="mr-2 text-emerald-600" /> Hipóteses Diagnósticas Sugeridas
                </h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  {resultado.hipoteses.map((h, i) => (
                    <span key={i} className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-700 mb-2">Conduta Terapêutica Recomendada:</h4>
                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">{resultado.conduta}</p>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-700 mb-2">Prescrições Sugeridas:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
                  {resultado.medicamentos.map((med, i) => (
                    <li key={i}>{med}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
