import os
from flask_sqlalchemy import SQLAlchemy

class Config:
    HOST = '0.0.0.0'
    PORT = 8000
    DEBUG = True
    #SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root:Bancos*1999@localhost:3306/pets"
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root:Bancos*1999@db:3306/data_pets"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'chave_secreta'

db = SQLAlchemy()