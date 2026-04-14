import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

const API_URL = 'http://localhost:3006/animais';


function VisaoGeral() {
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('Cachorro');
  const [raca, setRaca] = useState('');
  const [idade, setIdade] = useState('');
  const navigate = useNavigate();

  const handleCadastrar = async (e) => {
    e.preventDefault();

    const novoPet = {
      nome,
      especie,
      raca,
      idade: parseInt(idade),
      user_id: 1 // Será substituído pelo ID real depois
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoPet)
      });

      if (response.ok) {
        alert("Pet cadastrado com sucesso!");
        navigate('/dashboard/meus-pets');
      } else {
        const errorData = await response.json();
        alert(`Erro: ${errorData.erro}`);
      }
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro de conexão com a API. Verifique se o Flask está rodando e com o CORS configurado.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* PAINEL 1: CADASTRAR ANIMAL */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">📝 Cadastrar Novo Pet</h3>
        <form onSubmit={handleCadastrar} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Pet</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:border-[#E56A45]" placeholder="Ex: Bob" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Espécie</label>
              <select value={especie} onChange={(e) => setEspecie(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:border-[#E56A45]">
                <option value="Cachorro">Cachorro</option>
                <option value="Gato">Gato</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Idade (anos)</label>
              <input type="number" value={idade} onChange={(e) => setIdade(e.target.value)} required min="0" className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:border-[#E56A45]" placeholder="Ex: 2" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Raça</label>
            <input type="text" value={raca} onChange={(e) => setRaca(e.target.value)} required className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:border-[#E56A45]" placeholder="Ex: Vira-lata (SRD)" />
          </div>
          <button type="submit" className="w-full bg-[#E56A45] text-white font-bold py-3 rounded-lg hover:bg-[#d45a36] transition-colors mt-4">
            Salvar Cadastro
          </button>
        </form>
      </section>

      {/* PAINEL 2: INTERESSES EM ADOÇÃO */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">💌 Pedidos de Adoção</h3>
        <div className="space-y-4 flex-1">
          <div className="p-4 border border-gray-100 rounded-xl bg-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">C</div>
              <div>
                <p className="font-bold text-gray-800">Carlos Eduardo</p>
                <p className="text-sm text-gray-500">Quer adotar um pet</p>
              </div>
            </div>
            <button className="text-sm font-semibold text-[#E56A45] hover:underline">Ver Perfil</button>
          </div>
        </div>
      </section>
    </div>
  );
}


function MeusPets() {
  const [meusPets, setMeusPets] = useState([]);
  const [carregando, setCarregando] = useState(true);
  
  // Novos estados para controlar os pop-ups
  const [petParaExcluir, setPetParaExcluir] = useState(null); // Armazena o pet que está prestes a ser excluído
  const [mensagemSucesso, setMensagemSucesso] = useState(''); // Controla o aviso de sucesso

  useEffect(() => {
    const buscarPets = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setMeusPets(data);
      } catch (error) {
        console.error("Erro ao buscar os pets:", error);
      } finally {
        setCarregando(false);
      }
    };
    buscarPets();
  }, []);

  // Nova função para confirmar e executar a exclusão
  const confirmarExclusao = async () => {
    if (!petParaExcluir) return;

    try {
      const response = await fetch(`${API_URL}/${petParaExcluir.id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        // Atualiza a lista na tela removendo o pet excluído (sem precisar dar reload na página)
        setMeusPets(meusPets.filter(pet => pet.id !== petParaExcluir.id));
        
        // Fecha o modal e mostra a mensagem de sucesso
        setMensagemSucesso(`O pet "${petParaExcluir.nome}" foi excluído com sucesso!`);
        setPetParaExcluir(null);

        // Esconde a mensagem de sucesso após 3 segundos
        setTimeout(() => {
          setMensagemSucesso('');
        }, 3000);
      } else {
        alert("Ocorreu um erro ao excluir na API.");
      }
    } catch (erro) {
      console.error("Erro durante a deleção de pets", erro);
    }
  };

  return (
    <div className="relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">🐾 Meus Pets Cadastrados</h3>
      
      {carregando ? (
        <p className="text-gray-500 text-center py-8">Carregando pets...</p>
      ) : meusPets.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-2">Nenhum pet encontrado na API.</p>
          <p className="text-sm text-gray-400">Se você já cadastrou, verifique se a API Flask está rodando e com o CORS liberado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {meusPets.map((pet) => (
            <div key={pet.id} className="border border-gray-200 rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-bold text-gray-800">{pet.nome}</h4>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${pet.status === 'disponivel' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {pet.status === 'disponivel' ? 'Disponível' : 'Indisponível'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">Espécie: <span className="font-medium">{pet.especie}</span></p>
                <p className="text-gray-600 text-sm">Raça: <span className="font-medium">{pet.raca}</span></p>
                <p className="text-gray-600 text-sm">Idade: <span className="font-medium">{pet.idade} anos</span></p>
              </div>
              <div className="mt-4 flex gap-2 border-t pt-4">
                <button className="text-sm text-blue-600 hover:underline font-medium">Editar</button>
                {/* O botão agora apenas abre o modal, definindo qual pet será excluído */}
                <button 
                  className="text-sm text-red-600 hover:underline font-medium" 
                  onClick={() => setPetParaExcluir(pet)} 
                  type='button'
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {petParaExcluir && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full mx-4 animate-fade-in">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Confirmar Exclusão</h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir o pet <strong>{petParaExcluir.nome}</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setPetParaExcluir(null)} 
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmarExclusao} 
                className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg font-medium transition-colors"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POP-UP DE SUCESSO (TOAST) */}
      {mensagemSucesso && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg font-medium animate-bounce">
          ✅ {mensagemSucesso}
        </div>
      )}

    </div>
  );
}

const API_USER_URL = 'http://localhost:3006/users/1'; 

function Perfil() {
  const [usuario, setUsuario] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: ''
  });
  
  // Clona os dados originais caso o usuário cancele a edição
  const [dadosOriginais, setDadosOriginais] = useState({});
  const [editando, setEditando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  // Busca os dados do usuário ao abrir a página
  useEffect(() => {
    const buscarUsuario = async () => {
      try {
        const response = await fetch(API_USER_URL);
        if (response.ok) {
          const data = await response.json();
          setUsuario(data);
          setDadosOriginais(data); // Guarda uma cópia segura
        } else {
          console.warn("Usuário não encontrado ou erro na API. Usando dados vazios.");
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      } finally {
        setCarregando(false);
      }
    };
    buscarUsuario();
  }, []);

  const handleCancelar = () => {
    setUsuario(dadosOriginais); // Restaura os dados se cancelar
    setEditando(false);
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(API_USER_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
      });

      if (response.ok) {
        setDadosOriginais(usuario); // Atualiza os dados seguros
        setEditando(false); // Sai do modo de edição
        
        // Exibe o aviso de sucesso
        setMensagemSucesso("Perfil atualizado com sucesso!");
        setTimeout(() => setMensagemSucesso(''), 3000);
      } else {
        alert("Ocorreu um erro ao atualizar o perfil na API.");
      }
    } catch (erro) {
      console.error("Erro ao salvar perfil:", erro);
      alert("Erro de conexão com a API.");
    }
  };

  if (carregando) {
    return <div className="p-6 text-gray-500 text-center">Carregando perfil...</div>;
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-3xl relative">
      <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          👤 Meu Perfil
        </h3>
        {!editando && (
          <button 
            onClick={() => setEditando(true)}
            className="px-4 py-2 text-[#E56A45] border-2 border-[#E56A45] hover:bg-[#E56A45] hover:text-white rounded-lg font-bold transition-colors"
          >
            Editar Perfil
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Lado esquerdo: Avatar */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-32 h-32 rounded-full border-4 border-gray-100 bg-gray-200 flex items-center justify-center overflow-hidden">
             {/* Você pode adicionar um <img> aqui se a API retornar foto de perfil */}
             <span className="text-4xl text-gray-400">👤</span>
          </div>
          {editando && (
            <button className="text-sm font-semibold text-blue-600 hover:underline">
              Trocar Foto
            </button>
          )}
        </div>

        {/* Lado direito: Formulário / Dados */}
        <div className="flex-1">
          <form onSubmit={handleSalvar} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nome Completo</label>
              {editando ? (
                <input type="text" value={usuario.nome || ''} onChange={(e) => setUsuario({...usuario, nome: e.target.value})} required className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:border-[#E56A45]" />
              ) : (
                <p className="text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-transparent">{usuario.nome || 'Não informado'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">E-mail</label>
              {editando ? (
                <input type="email" value={usuario.email || ''} onChange={(e) => setUsuario({...usuario, email: e.target.value})} required className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:border-[#E56A45]" />
              ) : (
                <p className="text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-transparent">{usuario.email || 'Não informado'}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Telefone / WhatsApp</label>
                {editando ? (
                  <input type="text" value={usuario.telefone || ''} onChange={(e) => setUsuario({...usuario, telefone: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:border-[#E56A45]" placeholder="(00) 00000-0000" />
                ) : (
                  <p className="text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-transparent">{usuario.telefone || 'Não informado'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Endereço</label>
                {editando ? (
                  <input 
                    type="text" 
                    value={usuario.endereco || ''} 
                    onChange={(e) => setUsuario({...usuario, endereco: e.target.value})} 
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:border-[#E56A45]" 
                    placeholder="Ex: Rua das Flores, 123 - São Paulo" 
                  />
                ) : (
                  <p className="text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-transparent">
                    {usuario.endereco || 'Não informado'}
                  </p>
                )}
              </div>
              </div>

            {/* Botões de Ação (Aparecem apenas se estiver editando) */}
            {editando && (
              <div className="flex gap-3 justify-end pt-6">
                <button type="button" onClick={handleCancelar} className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2.5 text-white bg-[#E56A45] hover:bg-[#d45a36] rounded-lg font-medium transition-colors shadow-sm">
                  Salvar Alterações
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Pop-up de Sucesso (Toast) */}
      {mensagemSucesso && (
        <div className="absolute top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg font-medium animate-fade-in z-50">
          ✅ {mensagemSucesso}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const location = useLocation();

  const isActive = (path) => {
    // Verifica se a URL atual é exatamente o path, para pintar o botão de laranja
    return location.pathname === path 
      ? 'bg-[#E56A45] text-white shadow-sm' 
      : 'text-gray-600 hover:bg-[#E56A45] hover:text-white';
  };

  return (
    <div className="flex h-screen bg-[#F7F5F0]">
      
      <aside className="w-64 bg-white shadow-md flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-extrabold text-[#E56A45]">PetMatch</h1>
          </div>
          
          <nav className="p-4 space-y-2">
            <Link to="/dashboard" className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${isActive('/dashboard')}`}>
              🏠 Visão Geral
            </Link>
            
            <Link to="/dashboard/perfil" className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${isActive('/dashboard/perfil')}`}>
              👤 Perfil
            </Link>

            <Link to="/dashboard/meus-pets" className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${isActive('/dashboard/meus-pets')}`}>
              🐾 Meus Pets
            </Link>

            <Link to="/dashboard/notificacoes" className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${isActive('/dashboard/notificacoes')}`}>
              🔔 Notificações
            </Link>

            <Link to="/dashboard/configuracoes" className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${isActive('/dashboard/configuracoes')}`}>
              ⚙️ Configurações
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors font-semibold">
            Sair
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTEÚDO */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Olá, bicho feliz! 👋</h2>
            <p className="text-gray-500 mt-1">Gerencie seus pets e acompanhe as adoções.</p>
          </div>
          <div className="w-14 h-14 rounded-full border-2 border-[#E56A45] bg-gray-300 flex items-center justify-center overflow-hidden">
            <span className="text-xs text-gray-500">Avatar</span>
          </div>
        </header>

        {/* Rotas renderizadas aqui dentro */}
        <Routes>
          <Route path="/" element={<VisaoGeral />} />
          <Route path="/meus-pets" element={<MeusPets />} />
          {/* Você pode criar componentes vazios temporários para estas rotas depois: */}
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/notificacoes" element={<div className="p-6 bg-white rounded-2xl">Notificações (Em construção)</div>} />
          <Route path="/configuracoes" element={<div className="p-6 bg-white rounded-2xl">Configurações (Em construção)</div>} />
        </Routes>

      </main>
    </div>
  );
}