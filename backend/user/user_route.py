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