import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ANIMAIS_MOCK = [
  { id: 1, nome: 'Pipoca', org: 'ONG Patas Amigas', img: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=200' },
  { id: 2, nome: 'Mimi', org: 'Gatil Esperança', img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200' },
  { id: 3, nome: 'Bolota', org: 'Pet Shop Bicho Feliz', img: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200' },
  { id: 4, nome: 'Pantera', org: 'ONG Vida Animal', img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200' },
  { id: 5, nome: 'Thor', org: 'Abrigo São Francisco', img: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=200' },
  { id: 6, nome: 'Laranja', org: 'ONG Patas Amigas', img: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200' },
];

function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F5F2ED] min-h-screen font-sans text-[#2D2D2D]">
      
      {/* CABEÇALHO / MENU */}
      <header className="pt-6 px-6 max-w-7xl mx-auto flex justify-end">
        <Link to="/login" className="font-bold text-[#E26A45] hover:underline text-lg">
          Entrar
        </Link>
      </header>

      {/* HERO SECTION */}
      <section className="pt-16 pb-16 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-6xl font-extrabold mb-8 tracking-tight">
          Cada animal merece uma chance de ser encontrado.
        </h1>
        <p className="text-gray-500 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          A plataforma feita para ONGs e pet shops que levam a sério o trabalho de encontrar lares. Simples, direta e eficaz.
        </p>
        <button 
          onClick={() => navigate('/cadastro')}
          className="bg-[#E26A45] text-white px-10 py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all"
        >
          Cadastrar minha organização
        </button>
      </section>

      {/* PASSO A PASSO */}
      <section className="py-20 max-w-6xl mx-auto grid md:grid-cols-3 gap-16 px-6">
        <div className="flex flex-col">
          <span className="text-7xl font-bold text-[#E26A45] mb-4">1</span>
          <h3 className="text-2xl font-bold mb-3">Cadastre.</h3>
          <p className="text-gray-500 text-lg">Registre sua ONG ou pet shop em menos de dois minutos. Sem burocracia, sem surpresas.</p>
        </div>
        <div className="flex flex-col">
          <span className="text-7xl font-bold text-[#E26A45] mb-4">2</span>
          <h3 className="text-2xl font-bold mb-3">Anuncie.</h3>
          <p className="text-gray-500 text-lg">Adicione os animais disponíveis com foto, nome e descrição. Gerencie seus animais em um só lugar.</p>
        </div>
        <div className="flex flex-col">
          <span className="text-7xl font-bold text-[#E26A45] mb-4">3</span>
          <h3 className="text-2xl font-bold mb-3">Transforme.</h3>
          <p className="text-gray-500 text-lg">Conecte-se com adotantes reais. Acompanhe cada adoção e veja o impacto do seu trabalho.</p>
        </div>
      </section>

      {/* GRID DE ANIMAIS */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-2">Eles estão esperando por você.</h2>
          <p className="text-gray-400 mb-12">Animais reais, cadastrados por organizações reais.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {ANIMAIS_MOCK.map(pet => (
              <div key={pet.id} className="text-left group cursor-pointer">
                <div className="overflow-hidden rounded-xl mb-3">
                  <img src={pet.img} alt={pet.nome} className="h-64 w-full object-cover group-hover:scale-105 transition duration-300" />
                </div>
                <h4 className="font-bold text-lg">{pet.nome}</h4>
                <p className="text-sm text-gray-400">{pet.org}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RODAPÉ / CTA FINAL */}
      <section className="py-24 text-center border-t border-gray-200">
        <h2 className="text-4xl font-bold mb-10">Pronto para começar?</h2>
        <p className="text-gray-500 mb-10">Cadastre sua organização e comece a conectar animais a novos lares hoje mesmo.</p>
        <button 
          onClick={() => navigate('/cadastro')}
          className="bg-[#E26A45] text-white px-12 py-4 rounded-lg font-bold text-xl hover:shadow-lg transition-all"
        >
          Cadastrar minha organização
        </button>
        <div className="mt-32 text-gray-400 text-sm">
          © 2026 PetMatch. Encontre aqui seu novo amor.
        </div>
      </section>
    </div>
  );
}

export default Home;