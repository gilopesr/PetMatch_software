import os
from flask import request, jsonify, Blueprint
from config import db
from animais.animais_model import Animais,AnimalNaoEncontrado
from werkzeug.utils import secure_filename

animais_bp = Blueprint('animais_bp', __name__)


@animais_bp.route('/animais', methods=['POST'])
def cadastrar_animal():
    data = request.get_json()

    campos_obrigatorios = ['nome', 'especie', 'raca', 'idade', 'user_id']
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
            user_id=data['user_id'] 
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
    animais_db = Animais.query.all()
    lista_animais = []

    for animal in animais_db:
        lista_animais.append({
            "id": animal.id,
            "nome": animal.nome,
            "especie": animal.especie,
            "raca": animal.raca,
            "idade": animal.idade,
            "status": animal.status,
            "user_id": animal.user_id
        })

    return jsonify(lista_animais), 200

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