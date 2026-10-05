"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Building2, Home, Users, ShieldCheck, LogOut, Stethoscope, PlusCircle, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();
  const [clinicas, setClinicas] = useState([
    { id: '1', nome: 'Hospital Vet Central' },
    { id: '2', nome: 'Clínica 24h Curitiba' }
  ]);
  const [clinicaSelecionada, setClinicaSelecionada] = useState('1');
  const [showModalClinica, setShowModalClinica] = useState(false);
  const [novaClinicaNome, setNovaClinicaNome] = useState('');

  const handleAdicionarClinica = (e) => {
    e.preventDefault();
    if (!novaClinicaNome.trim()) return;
    const novaId = Date.now().toString();
    setClinicas([...clinicas, { id: novaId, nome: novaClinicaNome }]);
    setClinicaSelecionada(novaId);
    setNovaClinicaNome('');
    setShowModalClinica(false);
  };

  const handleExcluirClinica = (id, e) => {
    e.stopPropagation();
    if (clinicas.length <= 1) {
      alert('Você precisa manter pelo menos um local de atendimento.');
      return;
    }
    const novas = clinicas.filter(c => c.id !== id);
    setClinicas(novas);
    if (clinicaSelecionada === id) {
      setClinicaSelecionada(novas[0].id);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('privia_logged_name');
    router.push('/');
  };

  return (
    <aside className="w-64 h-screen bg-slate-900 text-white flex flex-col shrink-0 relative select-none border-r border-slate-800">
      <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
        <div className="bg-emerald-500 p-2 rounded-lg">
          <Stethoscope size={24} className="text-slate-900" />
        </div>
        <h1 className="text-xl font-black tracking-tight text-white">Privia<span className="text-emerald-400">Vet</span></h1>
      </div>

      <div className="p-4 border-b border-slate-800">
        <div className="flex justify-between items-center mb-1">
          <p className="text-xs text-slate-400 font-medium">Local de Atendimento</p>
          <button onClick={() => setShowModalClinica(true)} className="text-emerald-400 hover:text-emerald-300 transition flex items-center text-xs font-semibold" title="Adicionar Nova Clínica">
            <PlusCircle size={14} className="mr-1" /> Novo
          </button>
        </div>
        <div className="flex items-center space-x-2 bg-slate-800/80 p-2 rounded-md border border-slate-700">
          <Building2 size={16} className="text-emerald-400 shrink-0" />
          <select 
            value={clinicaSelecionada} 
            onChange={(e) => setClinicaSelecionada(e.target.value)}
            className="bg-transparent text-xs font-bold outline-none w-full cursor-pointer appearance-none text-white"
          >
            {clinicas.map(c => (
              <option key={c.id} value={c.id} className="text-slate-900">{c.nome}</option>
            ))}
          </select>
        </div>
        {clinicas.length > 1 && (
          <div className="mt-2 flex justify-end">
            <button onClick={(e) => handleExcluirClinica(clinicaSelecionada, e)} className="text-[11px] text-red-400 hover:underline flex items-center">
              <Trash2 size={12} className="mr-1" /> Remover local atual
            </button>
          </div>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link href="/dashboard" className="w-full flex items-center space-x-3 p-2.5 rounded-lg hover:bg-slate-800 transition text-slate-300 hover:text-white">
          <Home size={18} />
          <span className="font-medium text-sm">Anamnese IA</span>
        </Link>
        
        <Link href="/pacientes" className="w-full flex items-center space-x-3 p-2.5 rounded-lg hover:bg-slate-800 transition text-slate-300 hover:text-white">
          <Users size={18} />
          <span className="font-medium text-sm">Pacientes & Tutores</span>
        </Link>

        <div className="pt-4 mt-4 border-t border-slate-800">
          <p className="text-xs text-slate-400 mb-2 px-2 uppercase tracking-wider font-semibold">Jurídico & LGPD</p>
          <Link href="/termos" className="w-full flex items-center space-x-3 p-2.5 rounded-lg hover:bg-slate-800 transition text-slate-300 hover:text-white">
            <ShieldCheck size={18} className="text-blue-400" />
            <span className="font-medium text-sm">Termos para Tutores</span>
          </Link>
        </div>
      </nav>

      {/* Rodapé com Perfil e Botão de Sair Funcional */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-xs">
            GT
          </div>
          <div>
            <p className="text-xs font-bold text-white">Gustavo</p>
            <p className="text-[10px] text-slate-400">Administrador</p>
          </div>
        </div>
        <button 
          onClick={handleLogout} 
          className="bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 p-2 rounded-lg transition flex items-center border border-slate-700"
          title="Sair do Sistema"
        >
          <LogOut size={16} />
        </button>
      </div>

      {showModalClinica && (
        <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white text-slate-900 rounded-lg p-6 w-full max-w-sm shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-800">Adicionar Local de Atendimento</h3>
              <button onClick={() => setShowModalClinica(false)} className="text-slate-500 hover:text-slate-800"><X size={18} /></button>
            </div>
            <form onSubmit={handleAdicionarClinica} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome da Clínica / Hospital</label>
                <input 
                  type="text" 
                  required 
                  value={novaClinicaNome} 
                  onChange={e => setNovaClinicaNome(e.target.value)} 
                  placeholder="Ex: Vet Plaza 24h" 
                  className="w-full p-2 text-sm border border-slate-300 rounded focus:border-emerald-500 outline-none text-slate-900" 
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowModalClinica(false)} className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded font-medium">
                  Cancelar
                </button>
                <button type="submit" className="px-3 py-1.5 text-xs bg-emerald-600 text-white font-bold rounded hover:bg-emerald-700 transition">
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
}
