import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

const API_URL = 'http://localhost:3006/animais';
const API_PEDIDOS_URL = 'http://localhost:3006/pedidos';
const API_USER_URL = 'http://localhost:3006/users/1'; // Endpoint do usuário logado
const API_ONG_PEDIDOS_URL = 'http://localhost:3006/ong/1/pedidos';

function VisaoGeral() {
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('Cachorro');
  const [raca, setRaca] = useState('');
  const [idade, setIdade] = useState('');
  const [img, setImg] = useState('');
  
  // --- ESTADOS PARA OS PEDIDOS REAIS ---
  const [pedidos, setPedidos] = useState([]);
  const [carregandoPedidos, setCarregandoPedidos] = useState(true);

  const navigate = useNavigate();

  // BUSCAR PEDIDOS REAIS DO BACKEND
  useEffect(() => {
    const buscarPedidosReais = async () => {
      try {
        const response = await fetch(API_ONG_PEDIDOS_URL);
        if (response.ok) {
          const dados = await response.json();
          setPedidos(dados);
        } else {
          console.error("Erro ao buscar pedidos do servidor");
        }
      } catch (error) {
        console.error("Erro de conexão ao buscar pedidos:", error);
      } finally {
        setCarregandoPedidos(false);
      }
    };

    buscarPedidosReais();
  }, []);

  // FUNÇÃO DE UPLOAD DA FOTO DO PET
  const handleFotoUploadCadastro = (e) => {
    const arquivo = e.target.files[0];
    if (arquivo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImg(reader.result); // Salva o Base64 da imagem no estado
      };
      reader.readAsDataURL(arquivo);
    }
  };

  const handleCadastrar = async (e) => {
    e.preventDefault();

    const novoPet = {
      nome,
      especie,
      raca,
      idade: parseInt(idade),
      img,
      user_id: 1, // Será substituído pelo ID real depois,
      status: 'disponivel' // status inicial
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
          
          {/* ÁREA DA FOTO COM UPLOAD */}
          <div className="border border-gray-200 p-4 rounded-lg bg-gray-50">
            <label className='block text-sm font-bold text-gray-700 mb-2'>Foto do Pet:</label>
            
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFotoUploadCadastro} 
              className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-[#E56A45] hover:file:bg-orange-100 cursor-pointer mb-3"
            />
            
            <div className="text-center text-xs text-gray-400 font-bold mb-3">OU</div>
            
            <input 
              type="text" 
              value={img} 
              onChange={(e) => setImg(e.target.value)} 
              className='w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:border-[#E56A45] text-sm' 
              placeholder='Cole o Link da foto...'
            />

            {img && (
              <div className="mt-4 flex justify-center">
                <img src={img} alt="Preview" className="h-32 w-32 object-cover rounded-lg border-2 border-[#E56A45]" />
              </div>
            )}
          </div>

          <button type="submit" className="w-full bg-[#E56A45] text-white font-bold py-3 rounded-lg hover:bg-[#d45a36] transition-colors mt-4">
            Salvar Cadastro
          </button>
        </form>
      </section>

      {/* PAINEL 2: INTERESSES EM ADOÇÃO REAIS (LIMITADO A 3) */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">💌 Novos Pedidos de Adoção</h3>
          {pedidos.length > 0 && (
            <span className="bg-orange-50 text-[#E56A45] text-xs font-bold px-2.5 py-1 rounded-full">
              {pedidos.length} no total
            </span>
          )}
        </div>
        
        <div className="space-y-4 flex-1">
          {carregandoPedidos ? (
            <p className="text-center text-sm text-gray-400 font-medium py-4">A carregar os pedidos... 🔄</p>
          ) : pedidos.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <span className="text-4xl block mb-2">📥</span>
              <p className="text-sm font-medium">Nenhum pedido de adoção recebido ainda.</p>
            </div>
          ) : (
            <>
              {/* O .slice(0, 3) garante que apenas os 3 primeiros apareçam aqui */}
              {pedidos.slice(0, 3).map((pedido) => (
                <div key={pedido.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50 flex flex-col space-y-3 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 text-[#E56A45] rounded-full flex items-center justify-center font-bold uppercase">
                        {pedido.nome_adotante.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{pedido.nome_adotante}</p>
                        <p className="text-xs text-gray-500">
                          Interessado(a) em: <span className="font-bold text-[#E56A45] capitalize">{pedido.pet_nome}</span>
                        </p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${
                      pedido.status === 'pendente' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {pedido.status}
                    </span>
                  </div>

                  <div className="text-xs text-gray-600 bg-white p-3 rounded-lg border border-gray-100">
                    <p><strong>📞 WhatsApp:</strong> {pedido.telefone_adotante}</p>
                    {pedido.mensagem && (
                      <p className="mt-1 text-gray-500 italic">"{pedido.mensagem.substring(0, 60)}..."</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Botão para ir para o controle completo se houver mais pedidos */}
              <button 
                onClick={() => navigate('/dashboard/pedidos')} 
                className="mt-2 w-full text-center text-sm font-bold text-[#E56A45] hover:text-[#d45a36] py-2 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors"
              >
                Ver todos os pedidos →
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}


function MeusPets() {
  const [pet, setPet] = useState({nome:'',raca:'',especie:'',idade:'',img:''});
  const [meusPets, setMeusPets] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [petEdit, setPetEdit] = useState(null); 
  const [petEdited, setPetEdited] = useState({});

  const [petParaExcluir, setPetParaExcluir] = useState(null); 
  const [mensagemSucesso, setMensagemSucesso] = useState(''); 

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

  const updatePet = async(e) => {
    e.preventDefault();
    try{
      const response = await fetch(`${API_URL}/${petEdited.id}`, {
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(petEdited),
      });

      if(response.ok){
        setMeusPets(meusPets.map(pet => pet.id === petEdited.id ? petEdited : pet));
        setMensagemSucesso(`Pet ${petEdited.nome} atualizado com sucesso`);
        setPetEdit(null);

        setTimeout(() => {
          setMensagemSucesso('');
        }, 3000);
      }
    }catch(err){
      console.log(`Erro durante a atualização: ${err}`);
    }
  }

  function handleChangeEdit(e){
    const {name, value} = e.target;
    setPetEdited(data => ({
      ...data,
      [name]: value
    }));
  }

  // FUNÇÃO DE UPLOAD PARA EDIÇÃO
  const handleFotoUploadEdicao = (e) => {
    const arquivo = e.target.files[0];
    if (arquivo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPetEdited({ ...petEdited, img: reader.result }); // Salva no pet que está sendo editado
      };
      reader.readAsDataURL(arquivo);
    }
  };

  const confirmarExclusao = async () => {
    if (!petParaExcluir) return;
    try {
      const response = await fetch(`${API_URL}/${petParaExcluir.id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setMeusPets(meusPets.filter(pet => pet.id !== petParaExcluir.id));
        setMensagemSucesso(`O pet "${petParaExcluir.nome}" foi excluído com sucesso!`);
        setPetParaExcluir(null);

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
          {meusPets.map((pet) => 
            petEdit !== pet.id ? (
              // --- MODO VISUALIZAÇÃO ---
              <div key={pet.id} className="border border-gray-200 rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-bold text-gray-800 capitalize">{pet.nome}</h4>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${pet.status === 'disponivel' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {pet.status === 'disponivel' ? 'Disponível' : 'Indisponível'}
                    </span>
                  </div>
                  
                  <div className="space-y-1 mb-4">
                    <p className="text-gray-600 text-sm">Espécie: <span className="font-medium capitalize">{pet.especie}</span></p>
                    <p className="text-gray-600 text-sm">Raça: <span className="font-medium capitalize">{pet.raca}</span></p>
                    <p className="text-gray-600 text-sm">Idade: <span className="font-medium">{pet.idade} anos</span></p>
                    <p className="text-gray-600 text-sm">Informações de Saude: <span className="font-medium">{pet.saude || "N/A"}</span></p>
                  </div>
                  
                  <img className="h-60 w-full object-cover rounded-lg border border-gray-200" src={pet.img} alt={`Foto de ${pet.nome}`} />
                </div>
                
                <div className="mt-4 flex gap-4 border-t border-gray-100 pt-4">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors" onClick={() => { setPetEdit(pet.id); setPetEdited(pet);}}>
                    Editar
                  </button>
                  <button className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors" onClick={() => setPetParaExcluir(pet)} type='button'>
                    Excluir
                  </button>
                </div>
              </div>
            ) : (
              // --- MODO EDIÇÃO ---
              <form key={pet.id} onSubmit={updatePet} className="border border-blue-200 bg-blue-50/30 rounded-xl p-5 flex flex-col justify-between shadow-sm">
                <div className="space-y-3">
                  <h4 className="text-lg font-bold text-gray-800 mb-2">Editar Pet</h4>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nome</label>
                    <input className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" type="text" value={petEdited.nome || ''} name="nome" onChange={handleChangeEdit} required/>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Informações de Saude</label>
                    <input className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" type="text" value={petEdited.saude || ''} name="saude" onChange={handleChangeEdit} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Espécie</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" value={petEdited.especie || ''} name="especie" onChange={handleChangeEdit}>
                        <option value="Cachorro">Cachorro</option>
                        <option value="Gato">Gato</option>
                        <option value="Outro">Outro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Raça</label>
                      <input className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" type="text" name="raca" value={petEdited.raca || ''} onChange={handleChangeEdit} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Idade</label>
                      <input className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" type="number" name="idade" value={petEdited.idade || '' } onChange={handleChangeEdit}/>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" value={petEdited.status || 'disponivel'} name="status" onChange={handleChangeEdit}>
                        <option value="disponivel">Disponível</option>
                        <option value="em andamento">Em Andamento</option>
                        <option value="adotado">Adotado</option>
                      </select>
                    </div>
                  </div>

                  {/* ÁREA DA FOTO COM UPLOAD */}
                  <div className="border border-blue-100 p-3 rounded-lg bg-white mt-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Atualizar Foto</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFotoUploadEdicao} 
                      className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer mb-2"
                    />
                    <div className="text-center text-[10px] text-gray-400 font-bold mb-2">OU</div>
                    <input 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      type="text" 
                      name="img" 
                      value={petEdited.img || ''} 
                      onChange={handleChangeEdit}
                      placeholder="Link da foto..."
                    />
                  </div>

                </div>

                <div className="mt-5 flex gap-2 border-t border-gray-200 pt-4 justify-end">
                  <button type="button" onClick={() => setPetEdit(null)} className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Cancelar</button>
                  <button type="submit" className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors">Salvar</button>
                </div>
              </form>
            )
          )}
        </div>
      )}

      {/* MODAL E TOASTS SEGUEM ABAIXO... */}
      {petParaExcluir && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full mx-4 animate-fade-in">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Confirmar Exclusão</h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir o pet <strong>{petParaExcluir.nome}</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setPetParaExcluir(null)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">Cancelar</button>
              <button onClick={confirmarExclusao} className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg font-medium transition-colors">Sim, Excluir</button>
            </div>
          </div>
        </div>
      )}

      {mensagemSucesso && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg font-medium animate-bounce z-50">
          ✅ {mensagemSucesso}
        </div>
      )}
    </div>
  );
}

// O componente Perfil agora recebe 'usuario' e 'setUsuario' como propriedades (props)
function Perfil({ usuario, setUsuario }) {
  const [dadosOriginais, setDadosOriginais] = useState(usuario);
  const [editando, setEditando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  const handleCancelar = () => {
    setUsuario(dadosOriginais); 
    setEditando(false);
  };

  // FUNÇÃO DE UPLOAD CORRIGIDA PARA USAR 'img'
  const handleFotoUpload = (e) => {
    const arquivo = e.target.files[0];
    if (arquivo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Agora salva exatamente na propriedade 'img' que o seu BD espera
        setUsuario({ ...usuario, img: reader.result });
      };
      reader.readAsDataURL(arquivo);
    }
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_USER_URL, {
        method: 'PUT', // Ou 'PATCH' dependendo de como está o seu Flask
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
      });

      if (response.ok) {
        setDadosOriginais(usuario); 
        setEditando(false); 
        setMensagemSucesso("Perfil atualizado com sucesso!");
        setTimeout(() => setMensagemSucesso(''), 3000);
      } else {
         const errorData = await response.json();
         alert(`Erro do servidor: ${JSON.stringify(errorData)}`);
      }
    } catch (erro) {
      console.error("Erro ao salvar perfil:", erro);
      alert("Erro de conexão com a API.");
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full relative">
      <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">👤 Meu Perfil</h3>
        {!editando && (
          <button onClick={() => setEditando(true)} className="px-4 py-2 text-[#E56A45] border-2 border-[#E56A45] hover:bg-[#E56A45] hover:text-white rounded-lg font-bold transition-colors">
            Editar Perfil
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* LADO ESQUERDO: FOTO / UPLOAD */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-40 h-40 rounded-full border-4 border-gray-100 bg-gray-200 flex items-center justify-center overflow-hidden shadow-inner">
             {/* Exibição usando 'img' */}
             {usuario.img ? (
               <img src={usuario.img} alt="Foto de Perfil" className="w-full h-full object-cover" />
             ) : (
               <span className="text-6xl text-gray-400">👤</span>
             )}
          </div>
          
          {editando && (
             <div className="w-full space-y-3">
               <div>
                 <label className="block text-xs font-bold text-gray-700 mb-1 text-center">Fazer Upload de Foto</label>
                 <input 
                   type="file" 
                   accept="image/*" 
                   onChange={handleFotoUpload} 
                   className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-[#E56A45] hover:file:bg-orange-100 cursor-pointer"
                 />
               </div>

               <div className="text-center text-xs text-gray-400 font-bold">OU</div>

               <div>
                 <label className="block text-xs font-bold text-gray-700 mb-1 text-center">Colar Link da Foto</label>
                 <input 
                   type="text" 
                   value={usuario.img || ''} 
                   onChange={(e) => setUsuario({...usuario, img: e.target.value})} 
                   className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-[#E56A45] text-xs" 
                   placeholder="https://exemplo.com/foto.jpg" 
                 />
               </div>
             </div>
          )}
        </div>

        {/* LADO DIREITO: FORMULÁRIO */}
        <div className="flex-1">
          <form onSubmit={handleSalvar} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nome da ONG / Petshop</label>
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
                  <input type="text" value={usuario.endereco || ''} onChange={(e) => setUsuario({...usuario, endereco: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:border-[#E56A45]" placeholder="Ex: Rua das Flores, 123" />
                ) : (
                  <p className="text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-transparent">{usuario.endereco || 'Não informado'}</p>
                )}
              </div>
            </div>

            {editando && (
              <div className="flex gap-3 justify-end pt-6">
                <button type="button" onClick={handleCancelar} className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 text-white bg-[#E56A45] hover:bg-[#d45a36] rounded-lg font-medium transition-colors shadow-sm">Salvar Alterações</button>
              </div>
            )}
          </form>
        </div>
      </div>

      {mensagemSucesso && (
        <div className="absolute top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg font-medium z-50">
          ✅ {mensagemSucesso}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [usuario, setUsuario] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    img: ''
  });
  const [carregandoUsuario, setCarregandoUsuario] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  // Busca as informações do usuário centralizado no Dashboard
  useEffect(() => {
    const buscarUsuario = async () => {
      try {
        const response = await fetch(API_USER_URL);
        if (response.ok) {
          const data = await response.json();
          setUsuario(data);
        }
      } catch (error) {
        console.error("Erro ao buscar usuário logado:", error);
      } finally {
        setCarregandoUsuario(false);
      }
    };
    buscarUsuario();
  }, []);

  const isActive = (path) => {
    return location.pathname === path 
      ? 'bg-[#E56A45] text-white shadow-sm' 
      : 'text-gray-600 hover:bg-[#E56A45] hover:text-white';
  };

  const handleSair = () => {
    navigate('/login'); 
  };

  if (carregandoUsuario) {
    return <div className="h-screen flex items-center justify-center bg-[#F7F5F0] text-gray-500">A carregar sistema...</div>;
  }

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

            <Link to="/dashboard/pedidos" className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${isActive('/dashboard/meus-pets')}`} >
            📋 Pedidos de Adoção
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button onClick={handleSair} className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors font-semibold">
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            {/* AGORA EXIBE DINAMICAMENTE O NOME DO USUÁRIO LOGADO */}
            <h2 className="text-3xl font-bold text-gray-800">Olá, {usuario.nome || 'Bicho Feliz'}! 👋</h2>
            <p className="text-gray-500 mt-1">Gerencie seus pets e acompanhe as adoções.</p>
          </div>
          
          {/* FOTO DE AVATAR DO TOPO DINÂMICA VIA URL */}
          <div className="w-14 h-14 rounded-full border-2 border-[#E56A45] bg-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
            {usuario.img ? (
              <img src={usuario.img} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl">👤</span>
            )}
          </div>
        </header>

        <Routes>
          <Route path="/" element={<VisaoGeral />} />
          <Route path="/meus-pets" element={<MeusPets />} />
          <Route path="/perfil" element={<Perfil usuario={usuario} setUsuario={setUsuario} />} />
        </Routes>
      </main>
    </div>
  );
}