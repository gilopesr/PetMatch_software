import pytest
from config import db
from app import app
from user.user_model import User

# Fixture para configurar o app em modo de teste
@pytest.fixture
def client():
    app.config['TESTING'] = True
    # Usamos um banco de dados em memória para os testes serem ultra rápidos
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.drop_all()

# --- TESTES ---

def test_criar_usuario_sucesso(client):
    """Teste de criação de usuário com todos os campos"""
    payload = {
        "nome": "João Silva",
        "email": "joao@teste.com",
        "senha": "123",
        "tipo": "admin",
        "endereco": "Rua A, 123"
    }
    response = client.post('/users', json=payload)
    assert response.status_code == 201
    assert response.json['email'] == "joao@teste.com"

def test_criar_usuario_faltando_campos(client):
    """Teste que deve falhar se faltar o campo 'nome'"""
    payload = {"email": "erro@teste.com", "senha": "123"}
    response = client.post('/users', json=payload)
    assert response.status_code == 400
    assert "Faltam campos obrigatórios" in response.json['error']

def test_login_sucesso(client):
    """Teste de login após criar um usuário"""
    # 1. Cria o usuário primeiro
    user_data = {
        "nome": "Maria", "email": "maria@teste.com", 
        "senha": "senha_segura", "tipo": "user", "endereco": "Rua B"
    }
    client.post('/users', json=user_data)

    # 2. Tenta logar
    login_payload = {"email": "maria@teste.com", "senha": "senha_segura"}
    response = client.post('/login', json=login_payload)
    
    assert response.status_code == 200
    assert "Login realizado com sucesso!" in response.json['message']

def test_login_senha_errada(client):
    """Teste de login com senha incorreta"""
    user_data = {
        "nome": "Maria", "email": "maria@teste.com", 
        "senha": "correta", "tipo": "user", "endereco": "Rua B"
    }
    client.post('/users', json=user_data)

    login_payload = {"email": "maria@teste.com", "senha": "errada"}
    response = client.post('/login', json=login_payload)
    
    assert response.status_code == 401
    assert "E-mail ou senha inválidos" in response.json['error']