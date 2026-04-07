from config import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True) 
    telefone = db.Column(db.String(20))
    senha = db.Column(db.String(255), nullable=False)
    tipo = db.Column(db.String(20), nullable=False)
    endereco = db.Column(db.String(128), nullable=False)

    pets = db.relationship('Animais', back_populates='responsavel')

    def set_password(self, password):
        self.senha = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.senha, password)
    def to_dict(self):
        return {"id": self.id, "nome": self.nome, "email": self.email}