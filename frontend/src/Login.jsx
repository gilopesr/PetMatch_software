import React, { useState } from 'react'; // Adicionado useState
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  // 1. Estados para capturar os dados
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. Função para lidar com o login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:3006/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login sucesso! 
        // Dica: Você pode salvar o usuário no localStorage para persistir a sessão
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard'); // Ou a página principal após login
      } else {
        // Erro 401 ou 400 do seu Flask
        alert(data.error || "E-mail ou senha incorretos.");
      }
    } catch (error) {
      console.error("Erro ao conectar ao servidor:", error);
      alert("Servidor fora do ar. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
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
          <h2 className="text-3xl font-extrabold mb-2 text-center">Bem-vindo de volta!</h2>
          <p className="text-gray-500 text-center mb-8">Acesse o painel da sua organização.</p>
          
          {/* 3. onSubmit adicionado aqui */}
          <form className="flex flex-col gap-5" onSubmit={handleLogin}>
            <div>
              <label className="block font-bold mb-2 text-sm text-gray-700">E-mail</label>
              <input 
                type="email" 
                required
                className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-[#E26A45] focus:ring-1 focus:ring-[#E26A45] transition-all" 
                placeholder="contato@ong.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Atualiza estado
              />
            </div>
            <div>
              <label className="block font-bold mb-2 text-sm text-gray-700">Senha</label>
              <input 
                type="password" 
                required
                className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-[#E26A45] focus:ring-1 focus:ring-[#E26A45] transition-all" 
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)} // Atualiza estado
              />
              <div className="text-right mt-1">
                <a href="#" className="text-xs text-gray-400 hover:text-[#E26A45]">Esqueceu a senha?</a>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className={`bg-[#E26A45] text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 text-sm">
            Ainda não tem cadastro? <Link to="/cadastro" className="text-[#E26A45] font-bold hover:underline">Crie sua conta</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;