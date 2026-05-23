import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Cadastro from './Cadastro';
import Dashboard from './Dashboard';
import Adocao from './Adocao';
import MeusPedidos from './MeusPedidos';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/adocao" element={<Adocao />} />
        <Route path="/dashboard/pedidos" element={<MeusPedidos />} />
        
      </Routes>
    </Router>
  );
}

export default App;