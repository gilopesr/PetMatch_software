import React, { useState, useEffect } from 'react';

const API_ONG_PEDIDOS_URL = 'http://localhost:8000/ong/1/pedidos'; // Fixado na ONG 1

export default function MeusPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('todos');

  // Função para buscar os pedidos (isolada para podermos recarregar após atualizar)
  const buscarTodosPedidos = async () => {
    try {
      const response = await fetch(API_ONG_PEDIDOS_URL);
      if (response.ok) {
        const dados = await response.json();
        setPedidos(dados);
      }
    } catch (error) {
      console.error("Erro ao buscar lista completa de pedidos:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarTodosPedidos();
  }, []);

  // --- FUNÇÃO PARA ALTERAR O STATUS NO BACKEND ---
  const handleMudarStatus = async (pedidoId, novoStatus) => {
    const confirmacao = window.confirm(`Tem certeza que deseja marcar este pedido como ${novoStatus}?`);
    if (!confirmacao) return;

    try {
      const response = await fetch(`http://localhost:8000/pedidos/${pedidoId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novoStatus })
      });

      if (response.ok) {
        alert(`Pedido atualizado para ${novoStatus} com sucesso!`);
        // Recarrega a lista para atualizar a tabela na tela
        buscarTodosPedidos();
      } else {
        const erroData = await response.json();
        alert(`Erro ao atualizar: ${erroData.erro || 'Erro interno'}`);
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro de conexão com o servidor.");
    }
  };

  // Filtragem na tela
  const pedidosFiltrados = pedidos.filter(pedido => {
    if (filtroStatus === 'todos') return true;
    return pedido.status === filtroStatus;
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">📋 Controle de Adoções</h2>
          <p className="text-sm text-gray-500 mt-1">Gerencie e analise os formulários recebidos.</p>
        </div>
        
        {/* Filtros rápidos de Status */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
          {['todos', 'pendente', 'aprovado', 'recusado'].map((status) => (
            <button
              key={status}
              onClick={() => setFiltroStatus(status)}
              className={`px-4 py-2 rounded-lg uppercase tracking-wider transition-all ${
                filtroStatus === status 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {carregando ? (
        <p className="text-center text-gray-400 font-medium py-12">Carregando histórico de pedidos... 🔄</p>
      ) : pedidosFiltrados.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl">
          <span className="text-5xl block mb-3">📂</span>
          <p className="text-gray-500 font-medium">Nenhum pedido encontrado para o filtro selecionado.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                <th className="py-4 px-4">Adotante</th>
                <th className="py-4 px-4">Pet Interessado</th>
                <th className="py-4 px-4">Contatos</th>
                <th className="py-4 px-4">Mensagem enviada</th>
                <th className="py-4 px-4">Data</th>
                <th className="py-4 px-4 text-center">Status attuale</th>
                <th className="py-4 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
              {pedidosFiltrados.map((pedido) => (
                <tr key={pedido.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-4 font-bold text-gray-900">{pedido.nome_adotante}</td>
                  <td className="py-4 px-4">
                    <span className="bg-orange-50 text-[#E56A45] font-semibold px-2.5 py-1 rounded-md capitalize text-xs">
                      {pedido.pet_nome}
                    </span>
                  </td>
                  <td className="py-4 px-4 space-y-0.5 text-xs">
                    <p className="font-medium text-gray-800">📞 {pedido.telefone_adotante}</p>
                    <p className="text-gray-400">✉️ {pedido.email_adotante}</p>
                  </td>
                  <td className="py-4 px-4 max-w-xs truncate text-xs text-gray-500 italic" title={pedido.mensagem}>
                    "{pedido.mensagem || 'Sem mensagem adicional.'}"
                  </td>
                  <td className="py-4 px-4 text-xs text-gray-400">{pedido.data_pedido}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                      pedido.status === 'pendente' ? 'bg-amber-100 text-amber-700' :
                      pedido.status === 'aprovado' ? 'bg-green-100 text-green-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {pedido.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {pedido.status === 'pendente' ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleMudarStatus(pedido.id, 'aprovado')}
                          className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                        >
                          ✔ Aprovar
                        </button>
                        <button
                          onClick={() => handleMudarStatus(pedido.id, 'recusado')}
                          className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                        >
                          ✖ Recusar
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Concluído</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}