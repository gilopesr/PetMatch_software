import os
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Config:
    HOST = '0.0.0.0'
    PORT = 3006
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///app.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False