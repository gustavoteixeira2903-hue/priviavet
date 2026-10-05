"use client";
import React, { useState } from 'react';
import { ShieldCheck, Zap, ArrowRight, LogIn, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setErro('');

    const ADMIN_EMAIL = 'gustavoteixeira2903@gmail.com';
    const ADMIN_SENHA = 'admin123';

    if (email.trim().toLowerCase() === ADMIN_EMAIL && senha === ADMIN_SENHA) {
      localStorage.setItem('privia_logged_name', 'Gustavo Teixeira (Admin)');
      router.push('/admin');
      return;
    }

    const salvas = localStorage.getItem('privia_licencas');
    const licencas = salvas ? JSON.parse(salvas) : [
      { email: 'dra.irma@privia.vet', senha: 'vet123', nome: 'Dra. Irmã (Cliente Beta)' },
      { email: 'clinica@central.vet', senha: 'central2026', nome: 'Hospital Vet Central' }
    ];

    const usuarioEncontrado = licencas.find(
      (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase() && u.senha === senha
    );

    if (usuarioEncontrado) {
      localStorage.setItem('privia_logged_name', usuarioEncontrado.nome);
      router.push('/dashboard');
    } else {
      setErro('E-mail não licenciado ou palavra-passe incorreta. (Usa admin123 para o admin)');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col md:flex-row">
      <div className="flex-1 p-12 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-emerald-900/20 z-0"></div>
        <div className="relative z-10 max-w-xl">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            O Prontuário Inteligente que <span className="text-emerald-400">Acelera Diagnósticos</span> e <span className="text-emerald-400">Blinda o seu CRMV.</span>
          </h1>
          <p className="text-lg text-slate-300 mb-10 leading-relaxed">
            Plataforma exclusiva para veterinários autónomos e clínicas. Unimos <strong>Inteligência Artificial Autônoma</strong> e <strong>gestão completa de termos LGPD</strong>.
          </p>
        </div>
      </div>

      <div className="w-full md:w-[450px] bg-white text-slate-900 flex flex-col justify-center p-12 shadow-2xl z-20">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Privia<span className="text-emerald-600">Vet</span></h2>
          <p className="text-slate-500 text-sm mt-2">Acesso exclusivo para licenciados</p>
        </div>

        {erro && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 text-xs rounded font-medium leading-relaxed">
            {erro}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">E-mail</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="seuemail@gmail.com" 
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-slate-900" 
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Palavra-passe</label>
            <input 
              type="password" 
              required 
              value={senha} 
              onChange={e => setSenha(e.target.value)} 
              placeholder="••••••••" 
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-slate-900" 
            />
          </div>

          <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-600 transition duration-300 flex justify-center items-center shadow-md">
            <LogIn className="mr-2" size={18} />
            Acessar Sistema
            <ArrowRight className="ml-2" size={18} />
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-6 space-y-2">
          <p className="text-xs text-slate-500 flex items-center justify-center">
            <Lock size={14} className="mr-1 text-emerald-600" /> Acesso protegido e seguro.
          </p>
          <div className="text-[11px] text-slate-500 bg-slate-100 p-2 rounded">
            <strong>Admin:</strong> gustavoteixeira2903@gmail.com <br/>
            <strong>Password:</strong> admin123
          </div>
        </div>
      </div>
    </div>
  );
}
