import os
from flask import request, jsonify, Blueprint
from config import db
from animais.animais_model import Animais,AnimalNaoEncontrado, PedidoAdocao
from werkzeug.utils import secure_filename
from user.user_model import User

animais_bp = Blueprint('animais_bp', __name__)


@animais_bp.route('/animais', methods=['POST'])
def cadastrar_animal():
    data = request.get_json()

    campos_obrigatorios = ['nome', 'especie', 'raca', 'idade', 'user_id','img']
    for campo in campos_obrigatorios:
        if campo not in data:
            return jsonify({"erro": f"O campo '{campo}' é obrigatório."}), 400

    try:
        novo_animal = Animais(
            nome=data['nome'],
            especie=data['especie'],
            raca=data['raca'],
            idade=data['idade'],
            status=data.get('status', 'disponivel'),
            user_id=data['user_id'] ,
            img=data['img'],
            saude=data.get["saude"]
        )

        db.session.add(novo_animal)
        db.session.commit()

        return jsonify({
            "mensagem": "Animal cadastrado com sucesso!",
            "animal": {
                "id": novo_animal.id,
                "nome": novo_animal.nome
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"erro": "Falha ao cadastrar animal", "detalhes": str(e)}), 500


@animais_bp.route('/animais', methods=['GET'])
def listar_animais():
    animais_ongs = db.session.query(Animais, User).join(User, Animais.user_id == User.id).all()
    lista_animais = []

    for animal, ong in animais_ongs:
        lista_animais.append({
            "id": animal.id,
            "nome": animal.nome,
            "especie": animal.especie,
            "raca": animal.raca,
            "idade": animal.idade,
            "status": animal.status,
            "user_id": animal.user_id,
            "img":animal.img,
            "saude": animal.saude,

            "ong_nome": ong.nome,
            "ong_telefone": ong.telefone,
            "ong_email": ong.email
        })

    return jsonify(lista_animais), 200

@animais_bp.route('/animais/<int:id>',methods=['PUT'])
def atualizar_animal(id):
    try:
     data = request.json
     animal = Animais.query.get(id)
     animal.nome = data['nome']
     animal.raca = data['raca']
     animal.especie = data['especie']
     animal.img = data['img']
     animal.idade = data['idade']
     animal.saude = data['saude']
     db.session.commit()
     return jsonify({'sucesso':'animal atualizado com sucesso'}),201   
    except AnimalNaoEncontrado:
        return jsonify({"erro":'O animal não foi encontrado'}),404


@animais_bp.route("/animais/<int:id>", methods=['DELETE'])
def deletar_animal(id):
    animal = Animais.query.get(id)
    
    if not animal:
        return jsonify({"Erro": "Esse animal não foi encontrado"}), 404
        
    try:
        db.session.delete(animal)
        db.session.commit()
        return jsonify({"Sucesso": "Animal deletado com sucesso"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"Erro": "Falha ao deletar", "detalhes": str(e)}), 500

@animais_bp.route('/pedidos', methods=['POST', 'OPTIONS'])
def criar_pedido():
    # Isso resolve o erro de CORS imediatamente!
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    dados = request.get_json()
    
    # Validação simples para garantir que os dados chegaram
    if not dados.get('pet_id') or not dados.get('nome_adotante') or not dados.get('telefone_adotante'):
        return jsonify({"erro": "Dados incompletos. Nome, telefone e pet_id são obrigatórios."}), 400

    try:
        novo_pedido = PedidoAdocao(
            pet_id=dados['pet_id'],
            nome_adotante=dados['nome_adotante'],
            email_adotante=dados.get('email_adotante', ''),
            telefone_adotante=dados['telefone_adotante'],
            mensagem=dados.get('mensagem', '')
        )
        
        db.session.add(novo_pedido)
        db.session.commit()
        
        return jsonify({"mensagem": "Pedido de adoção registrado com sucesso!"}), 201

    except Exception as e:
        db.session.rollback()
        # Modifique esta linha para retornar o erro real para o React ver:
        return jsonify({"erro": "Erro interno no servidor", "detalhes": str(e)}), 500
    
@animais_bp.route('/ong/<int:ong_id>/pedidos', methods=['GET'])
def listar_pedidos_da_ong(ong_id):
    # Busca os pedidos de adoção onde o pet pertence à ONG especificada
    pedidos = db.session.query(PedidoAdocao, Animais)\
        .join(Animais, PedidoAdocao.pet_id == Animais.id)\
        .filter(Animais.user_id == ong_id).all()

    lista_pedidos = []
    for pedido, animal in pedidos:
        dados = pedido.to_dict()
        dados['pet_nome'] = animal.nome # Coloca o nome do pet para a ONG saber qual é
        lista_pedidos.append(dados)

    return jsonify(lista_pedidos), 200

@animais_bp.route('/pedidos/<int:id>/status', methods=['PUT', 'OPTIONS'])
def atualizar_status_pedido(id):
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    dados = request.get_json()
    novo_status = dados.get('status')

    # Validação simples para aceitar apenas os status corretos
    if novo_status not in ['pendente', 'aprovado', 'recusado']:
        return jsonify({"erro": "Status inválido"}), 400

    try:
        pedido = PedidoAdocao.query.get(id)
        if not pedido:
            return jsonify({"erro": "Pedido não encontrado"}), 404

        # Atualiza o status do pedido
        pedido.status = novo_status
        db.session.commit()

        return jsonify({
            "mensagem": f"Pedido {novo_status} com sucesso!",
            "pedido_id": id,
            "status": pedido.status
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"erro": "Falha ao atualizar status", "detalhes": str(e)}), 500