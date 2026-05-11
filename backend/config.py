import os
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Config:
    HOST = '0.0.0.0'
    PORT = 3006
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root:Bancos*1999@localhost:3306/pets"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    #SECRET_KEY = 'chave_secreta'