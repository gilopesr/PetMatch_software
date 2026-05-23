import React, { useState, useEffect } from 'react';

// Ajuste para as URLs reais da sua API
const API_ANIMAIS_URL = 'http://localhost:3006/animais'; 
const API_PEDIDOS_URL = 'http://localhost:3006/pedidos';

export default function Adocao() {
  const [pets, setPets] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // --- ESTADOS DO MODAL E FORMULÁRIO ---
  const [modalAberto, setModalAberto] = useState(false);
  const [petSelecionado, setPetSelecionado] = useState(null);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [formData, setFormData] = useState({
    nome_adotante: '',
    email_adotante: '',
    telefone_adotante: '',
    mensagem: ''
  });

  useEffect(() => {
    const buscarPets = async () => {
      try {
        const response = await fetch(API_ANIMAIS_URL);
        if (response.ok) {
          const data = await response.json();
          const petsDisponiveis = data.filter(pet => pet.status === 'disponivel');
          setPets(petsDisponiveis);
        }
      } catch (error) {
        console.error("Erro ao buscar animais:", error);
      } finally {
        setCarregando(false);
      }
    };

    buscarPets();
  }, []);

  // --- FUNÇÕES DO MODAL ---
  const abrirModal = (pet) => {
    setPetSelecionado(pet);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setPetSelecionado(null);
    setFormData({ nome_adotante: '', email_adotante: '', telefone_adotante: '', mensagem: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- FUNÇÃO PARA ENVIAR O PEDIDO ---
  const handleSubmitPedido = async (e) => {
    e.preventDefault();

    if (!petSelecionado) {
      alert("Erro: Nenhum pet foi selecionado.");
      return;
    }

    const novoPedido = {
      pet_id: petSelecionado.id,
      ...formData
    };

    try {
      const response = await fetch(API_PEDIDOS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoPedido)
      });

      if (!response.ok) {
        // Se o Flask deu erro 500, vamos capturar o JSON detalhado que ele enviou
        const dadosErro = await response.json();
        alert(`Erro do servidor: ${JSON.stringify(dadosErro)}`);
        return;
      }

      // Se deu tudo certo:
      fecharModal();
      setMensagemSucesso(`Oba! O seu pedido para adotar o(a) ${petSelecionado.nome} foi enviado para a ONG!`);
      setTimeout(() => setMensagemSucesso(''), 5000);

    } catch (erro) {
      console.error("Erro ao enviar pedido:", erro);
      alert("Erro de conexão com o servidor. Verifique se o Flask está rodando.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Adote um Amigo 🐾</h1>
          <p className="text-gray-600 text-lg">Conheça os animais que estão à procura de um lar cheio de amor.</p>
        </div>

        {carregando ? (
          <div className="text-center text-xl text-gray-500 font-bold py-10 animate-pulse">
            A procurar pets... 🔍
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <span className="text-6xl mb-4 block">🏠</span>
            <h2 className="text-2xl font-bold text-gray-700">Todos os pets já foram adotados!</h2>
            <p className="text-gray-500 mt-2">Volte em breve para conhecer novos amiguinhos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {pets.map((pet) => (
              <div key={pet.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden flex flex-col">
                <div className="h-56 overflow-hidden bg-gray-100 relative">
                  {pet.img ? (
                    <img src={pet.img} alt={pet.nome} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">🐕</div>
                  )}
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#E56A45] text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                    {pet.especie}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-gray-800 mb-1 capitalize">{pet.nome}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-medium">{pet.raca || 'SRD'}</span>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-medium">{pet.idade} anos</span>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-1">Cuidado por:</p>
                    <p className="text-sm font-bold text-gray-700">{pet.ong_nome || 'ONG Parceira'}</p>
                    
                    <button 
                      onClick={() => abrirModal(pet)}
                      className="mt-4 w-full bg-[#E56A45] hover:bg-[#d45a36] text-white font-bold py-2.5 rounded-lg transition-colors"
                    >
                      Quero Adotar!
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- MODAL DE ADOÇÃO --- */}
      {modalAberto && petSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            {/* Cabeçalho */}
            <div className="bg-[#E56A45] p-4 text-white flex justify-between items-center">
              <h3 className="font-bold text-lg">Adotar {petSelecionado.nome} 🐶</h3>
              <button onClick={fecharModal} className="text-white hover:text-gray-200 font-bold text-xl">&times;</button>
            </div>
            
            {/* Formulário */}
            <form onSubmit={handleSubmitPedido} className="p-6 space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Preencha os seus dados abaixo. A ONG <strong>{petSelecionado.ong_nome || 'responsável'}</strong> entrará em contato com você!
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seu Nome Completo</label>
                <input type="text" name="nome_adotante" value={formData.nome_adotante} onChange={handleInputChange} required className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:border-[#E56A45] text-sm" placeholder="Ex: Maria Silva" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <input type="email" name="email_adotante" value={formData.email_adotante} onChange={handleInputChange} required className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:border-[#E56A45] text-sm" placeholder="seu@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone/WhatsApp</label>
                  <input type="text" name="telefone_adotante" value={formData.telefone_adotante} onChange={handleInputChange} required className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:border-[#E56A45] text-sm" placeholder="(00) 00000-0000" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Por que quer adotar?</label>
                <textarea name="mensagem" value={formData.mensagem} onChange={handleInputChange} rows="3" className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:border-[#E56A45] text-sm resize-none" placeholder="Conte um pouco sobre você e por que quer este pet..." />
              </div>

              <div className="mt-6">
                <button type="submit" className="w-full bg-[#E56A45] hover:bg-[#d45a36] text-white font-bold py-3 rounded-lg transition-colors">
                  Enviar Pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POP-UP DE SUCESSO */}
      {mensagemSucesso && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-4 rounded-lg shadow-xl font-bold z-50">
          🎉 {mensagemSucesso}
        </div>
      )}
    </div>
  );
}