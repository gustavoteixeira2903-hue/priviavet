"use client";
import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserPlus, Trash2, ArrowLeft, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminPanel() {
  const router = useRouter();
  const [licencas, setLicencas] = useState([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    const salvas = localStorage.getItem('privia_licencas');
    if (salvas) {
      setLicencas(JSON.parse(salvas));
    } else {
      const iniciais = [
        { id: '1', nome: 'Dra. Irmã (Cliente Beta)', email: 'dra.irma@privia.vet', senha: 'vet123' },
        { id: '2', nome: 'Hospital Vet Central', email: 'clinica@central.vet', senha: 'central2026' }
      ];
      localStorage.setItem('privia_licencas', JSON.stringify(iniciais));
      setLicencas(iniciais);
    }
  }, []);

  const handleCriarLicenca = (e) => {
    e.preventDefault();
    if (!nome || !email || !senha) return;

    if (licencas.some(l => l.email === email)) {
      setMensagem('Erro: Este e-mail já possui uma licença ativa.');
      return;
    }

    const novaLicenca = { id: Date.now().toString(), nome, email, senha };
    const atualizadas = [...licencas, novaLicenca];
    
    setLicencas(atualizadas);
    localStorage.setItem('privia_licencas', JSON.stringify(atualizadas));
    
    setNome('');
    setEmail('');
    setSenha('');
    setMensagem('Licença criada com sucesso!');
    setTimeout(() => setMensagem(''), 3000);
  };

  const handleExcluir = (id) => {
    if (confirm('Tem certeza que deseja revogar o acesso desta licença?')) {
      const atualizadas = licencas.filter(l => l.id !== id);
      setLicencas(atualizadas);
      localStorage.setItem('privia_licencas', JSON.stringify(atualizadas));
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500 p-2.5 rounded-xl">
              <ShieldCheck className="text-slate-900" size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold">Painel Master PriviaVet</h1>
              <p className="text-xs text-slate-400">Gestão centralizada de licenças e acessos comerciais</p>
            </div>
          </div>
          <button 
            onClick={() => router.push('/dashboard')} 
            className="flex items-center text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg transition"
          >
            <ArrowLeft size={16} className="mr-2" /> Voltar ao Sistema
          </button>
        </div>

        {mensagem && (
          <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-lg text-sm font-medium">
            {mensagem}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 h-fit">
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <UserPlus size={18} className="mr-2 text-emerald-400" /> Nova Licença
            </h2>
            <form onSubmit={handleCriarLicenca} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Nome do Cliente / Veterinário(a)</label>
                <input 
                  type="text" 
                  required 
                  value={nome} 
                  onChange={e => setNome(e.target.value)} 
                  placeholder="Ex: Dra. Paula Costa" 
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:border-emerald-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">E-mail de Acesso</label>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="paula@vet.com" 
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:border-emerald-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Senha Provisória</label>
                <input 
                  type="text" 
                  required 
                  value={senha} 
                  onChange={e => setSenha(e.target.value)} 
                  placeholder="Defina uma senha" 
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:border-emerald-500 outline-none" 
                />
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold py-2.5 rounded-lg transition shadow-md">
                Gerar e Ativar Licença
              </button>
            </form>
          </div>

          <div className="md:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <Users size={18} className="mr-2 text-emerald-400" /> Clientes Licenciados ({licencas.length})
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 text-xs uppercase">
                    <th className="p-3">Cliente</th>
                    <th className="p-3">E-mail</th>
                    <th className="p-3">Senha</th>
                    <th className="p-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {licencas.map((l) => (
                    <tr key={l.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition">
                      <td className="p-3 font-semibold">{l.nome}</td>
                      <td className="p-3 text-slate-300">{l.email}</td>
                      <td className="p-3 font-mono text-emerald-400">{l.senha}</td>
                      <td className="p-3 text-right">
                        <button 
                          onClick={() => handleExcluir(l.id)} 
                          className="text-red-400 hover:text-red-300 p-1.5 rounded hover:bg-red-500/10 transition"
                          title="Revogar Licença"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
