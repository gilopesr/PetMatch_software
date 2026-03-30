import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Cadastro() {
  const navigate = useNavigate();

  // Estado com todos os campos que seu backend exige
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    tipo: 'organizacao', // Valor padrão conforme seu modelo
    endereco: '',
    telefone: '' // Opcional no seu backend (.get)
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:3006/users', { // Rota do seu user_bp
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Conta criada com sucesso!");
        navigate('/login');
      } else {
        alert("Erro: " + (data.error || "Falha ao cadastrar"));
      }
    } catch (error) {
      console.error("Erro na conexão:", error);
      alert("Servidor offline ou erro de rede.");
    }
  };

  return (
    <div className="bg-[#F5F2ED] min-h-screen flex flex-col font-sans text-[#2D2D2D]">
      <header className="p-6">
        <button onClick={() => navigate('/')} className="text-gray-500 hover:text-[#E26A45] font-bold">
          &larr; Voltar para a Home
        </button>
      </header>

      <div className="flex-grow flex items-center justify-center px-6">
        <div className="bg-white p-10 rounded-2xl shadow-sm w-full max-w-md border border-gray-100">
          <h2 className="text-3xl font-extrabold mb-2 text-center">Criar Conta</h2>
          
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
              <label className="block font-bold mb-2 text-sm text-gray-700">Nome da Organização</label>
              <input 
                type="text" 
                required
                className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-[#E26A45] focus:ring-1 focus:ring-[#E26A45]"
                placeholder="Happy Pet" 
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
              />
            </div>

            <div>
              <label className="block font-bold mb-2 text-sm text-gray-700">Endereço</label>
              <input 
                type="text" 
                required
                className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-[#E26A45] focus:ring-1 focus:ring-[#E26A45]" 
                placeholder="Rua Jardim, 123"
                onChange={(e) => setFormData({...formData, endereco: e.target.value})}
              />
            </div>

            <div>
              <label className="block font-bold mb-2 text-sm text-gray-700">E-mail</label>
              <input 
                type="email" 
                required
                className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-[#E26A45] focus:ring-1 focus:ring-[#E26A45]"
                placeholder="happypet@gmail.com"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="block font-bold mb-2 text-sm text-gray-700">Senha</label>
              <input 
                type="password" 
                required
                className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-[#E26A45] focus:ring-1 focus:ring-[#E26A45]" 
                onChange={(e) => setFormData({...formData, senha: e.target.value})}
              />
            </div>
            
            <button type="submit" className="bg-[#E26A45] text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all mt-4">
              Finalizar Cadastro
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 text-sm">
            Já tem uma conta? <Link to="/login" className="text-[#E26A45] font-bold hover:underline">Faça login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;