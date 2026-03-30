import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [nomeOng, setNomeOng] = useState('');

  // useEffect roda assim que a página carrega
  useEffect(() => {
    // 1. Tenta pegar os dados salvos no localStorage no login
    const userStorage = localStorage.getItem('user');

    if (userStorage) {
      // 2. Se existir, transforma de texto para objeto JS
      const user = JSON.parse(userStorage);
      setNomeOng(user.nome); // Define o nome na tela
    } else {
      // 3. Segurança: Se não tiver usuário logado, manda de volta pro login
      navigate('/login');
    }
  }, [navigate]);

  // Função simples de logout
  const handleLogout = () => {
    localStorage.removeItem('user'); // Apaga os dados do usuário
    navigate('/login'); // Manda pro login
  };

  return (
    <div className="bg-[#F5F2ED] min-h-screen flex flex-col font-sans text-[#2D2D2D]">
      
      {/* Header Simples */}
      <header className="bg-white p-6 shadow-sm border-b border-gray-100 flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-[#E26A45]">PetMatch</h1>
        <button 
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-[#E26A45] font-bold"
        >
          Sair
        </button>
      </header>

      {/* Conteúdo Central */}
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded-3xl shadow-xl w-full max-w-2xl border border-gray-100 text-center transform transition-all hover:scale-105">
          
          {/* Foto do Gato (Placeholder) */}
          <div className="mb-10 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600&auto=format&fit=crop" 
              alt="Gato fofo dando boas-vindas" 
              className="rounded-full w-48 h-48 object-cover border-4 border-[#F5F2ED] shadow-lg"
            />
          </div>

          {/* Texto de Boas-Vindas */}
          <h2 className="text-5xl font-extrabold mb-4 leading-tight">
            Bem-vindo(a),
          </h2>
          <p className="text-3xl font-bold text-[#E26A45] bg-[#F5F2ED] inline-block px-6 py-2 rounded-full shadow-inner">
            {nomeOng || 'Carregando...'}
          </p>

          <p className="mt-10 text-gray-500 max-w-md mx-auto">
            Este é o seu painel provisório. Em breve você poderá gerenciar seus pets e adoções por aqui.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;