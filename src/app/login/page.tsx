import React from 'react';
import { ShieldCheck, Bot, Building2, ArrowRight, Stethoscope } from 'lucide-react';

export default function Login() {
  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Lado Esquerdo - O Pitch de Vendas (Copywriter) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 text-white flex-col justify-center px-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-emerald-900/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Stethoscope className="text-slate-900" size={28} />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white">Privia<span className="text-emerald-400">Vet</span></h1>
          </div>

          <h2 className="text-4xl font-bold mb-6 leading-tight">
            O Prontuário Inteligente que <span className="text-emerald-400">blinda</span> sua atuação clínica.
          </h2>
          
          <p className="text-lg text-slate-400 mb-10 max-w-lg">
            Esqueça a papelada e o risco jurídico. Concentre seus atendimentos, receba diagnósticos diferenciais por IA e gere os Termos de Consentimento (LGPD) automáticos em segundos.
          </p>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-slate-800 p-2 rounded-md"><Bot className="text-emerald-400" size={24} /></div>
              <div>
                <h3 className="font-bold text-white">Diagnóstico Diferencial com IA</h3>
                <p className="text-sm text-slate-400">Acelere sua linha de raciocínio clínico com nossa Inteligência Artificial.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-slate-800 p-2 rounded-md"><ShieldCheck className="text-blue-400" size={24} /></div>
              <div>
                <h3 className="font-bold text-white">Blindagem Jurídica e LGPD</h3>
                <p className="text-sm text-slate-400">Termos de autorização cirúrgica e internação gerados e assinados na hora.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-slate-800 p-2 rounded-md"><Building2 className="text-purple-400" size={24} /></div>
              <div>
                <h3 className="font-bold text-white">Gestão Multi-Clínicas</h3>
                <p className="text-sm text-slate-400">Feito para o autônomo. Separe seus pacientes e prontuários por local de atendimento.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Direito - O Login para entrar no sistema */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white">
        <div className="max-w-md w-full px-8">
          <div className="lg:hidden flex items-center justify-center space-x-2 mb-8">
            <Stethoscope className="text-emerald-600" size={32} />
            <h1 className="text-3xl font-extrabold text-slate-900">Privia<span className="text-emerald-600">Vet</span></h1>
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Acessar Sistema</h2>
          <p className="text-slate-500 mb-8">Entre com suas credenciais para continuar.</p>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-mail Profissional</label>
              <input type="email" value="dr.gustavo@exemplo.com" readOnly className="w-full p-3 border border-slate-300 rounded-md bg-slate-50 text-slate-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
              <input type="password" value="********" readOnly className="w-full p-3 border border-slate-300 rounded-md bg-slate-50 text-slate-500 outline-none" />
            </div>
            
            <a href="/" className="w-full bg-emerald-600 text-white font-bold p-3 rounded-md hover:bg-emerald-700 transition flex justify-center items-center mt-6 shadow-lg shadow-emerald-600/30">
              Entrar no Prontuário <ArrowRight size={18} className="ml-2" />
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}
