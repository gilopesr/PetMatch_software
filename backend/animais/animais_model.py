from config import db
from datetime import datetime
from sqlalchemy.dialects.mysql import LONGTEXT

class Animais(db.Model):
    __tablename__ = "pets"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    especie = db.Column(db.String(20), nullable=False)
    raca = db.Column(db.String(20), nullable=False)
    idade = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), nullable=False, default="disponivel")
    saude = db.Column(db.String(200),default='boa',nullable=True)
    img = db.Column(LONGTEXT, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    responsavel = db.relationship('User', back_populates='pets')

class AnimalNaoEncontrado(Exception):
    pass


class PedidoAdocao(db.Model):
    __tablename__ = 'pedidos_adocao'

    id = db.Column(db.Integer, primary_key=True)
    
    # CORREÇÃO AQUI: Mudado de 'animais.id' para 'pets.id'
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'), nullable=False)
    
    # Dados de quem preencheu o formulário de adoção na página pública
    nome_adotante = db.Column(db.String(100), nullable=False)
    email_adotante = db.Column(db.String(100), nullable=False)
    telefone_adotante = db.Column(db.String(20), nullable=False)
    mensagem = db.Column(db.Text, nullable=True) # Ex: "Tenho espaço em casa..."
    
    # Status do processo: 'pendente', 'aprovado', 'recusado'
    status = db.Column(db.String(20), default='pendente', nullable=False)
    data_pedido = db.Column(db.DateTime, default=db.func.current_timestamp())

    def to_dict(self):
        return {
            "id": self.id,
            "pet_id": self.pet_id,
            "nome_adotante": self.nome_adotante,
            "email_adotante": self.email_adotante,
            "telefone_adotante": self.telefone_adotante,
            "mensagem": self.mensagem,
            "status": self.status,
            "data_pedido": self.data_pedido.strftime('%d/%m/%Y %H:%M') if self.data_pedido else None
        }