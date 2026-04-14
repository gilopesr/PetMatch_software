from flask import Blueprint, request, jsonify
from config import db
from .user_model import User

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    
    campos_obrigatorios = ['nome', 'email', 'senha', 'tipo', 'endereco']
    if not all(campo in data for campo in campos_obrigatorios):
        return jsonify({"error": "Faltam campos obrigatórios"}), 400

    novo_usuario = User(
        nome=data['nome'],
        email=data['email'],
        telefone=data.get('telefone'),
        tipo=data['tipo'],
        endereco=data['endereco']
    )
    
    novo_usuario.set_password(data['senha'])
    
    try:
        db.session.add(novo_usuario)
        db.session.commit()
        return jsonify(novo_usuario.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Erro ao salvar: " + str(e)}), 400

@user_bp.route('/users', methods=['GET'])
def list_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])

@user_bp.route('/users/<int:id>', methods=['GET'])
def get_user(id):
    usuario = User.query.get(id)
    
    if not usuario:
        return jsonify({"error": "Usuário não encontrado"}), 404
        
    return jsonify(usuario.to_dict()), 200

@user_bp.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    usuario = User.query.get(id)
    
    if not usuario:
        return jsonify({"error": "Usuário não encontrado"}), 404

    data = request.get_json()

    # Atualiza apenas os campos que vieram no JSON (se não vier, mantém o atual)
    usuario.nome = data.get('nome', usuario.nome)
    usuario.email = data.get('email', usuario.email)
    usuario.telefone = data.get('telefone', usuario.telefone)
    usuario.endereco = data.get('endereco', usuario.endereco)
    
    # Se quiser permitir que o usuário atualize a senha pelo perfil no futuro:
    # if 'senha' in data and data['senha']:
    #     usuario.set_password(data['senha'])

    try:
        db.session.commit()
        return jsonify({
            "message": "Perfil atualizado com sucesso!",
            "user": usuario.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Erro ao atualizar perfil: " + str(e)}), 400
    
    
@user_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    senha_digitada = data.get('senha')

    if not email or not senha_digitada:
        return jsonify({"error": "E-mail e senha são obrigatórios"}), 400

    usuario = User.query.filter_by(email=email).first()

    if usuario and usuario.check_password(senha_digitada):
        return jsonify({
            "message": "Login realizado com sucesso!",
            "user": usuario.to_dict()
        }), 200
    
    return jsonify({"error": "E-mail ou senha inválidos"}), 401