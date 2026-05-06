from config import db
import datetime

class Animais(db.Model):
    __tablename__ = "pets"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    especie = db.Column(db.String(20), nullable=False)
    raca = db.Column(db.String(20), nullable=False)
    idade = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), nullable=False, default="disponivel")
    img = db.Column(db.String(200),nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    responsavel = db.relationship('User', back_populates='pets')

class AnimalNaoEncontrado(Exception):
    pass