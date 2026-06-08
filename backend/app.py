from flask import Flask
from flask_cors import CORS
from config import Config, db, mail
from user.user_route import user_bp
from user.user_model import User
from animais.animais_routes import animais_bp
from animais.animais_model import Animais, PedidoAdocao
from flask_mail import Mail


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    #app.secret_key = 'chave_secreta'
    
    CORS(app)
    
    db.init_app(app)

    app.register_blueprint(user_bp)
    app.register_blueprint(animais_bp)

    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = 'giovana.rpa27@gmail.com'

    app.config['MAIL_PASSWORD'] = 'mpvh vxfd cmqv yrev'  

    app.config['MAIL_DEFAULT_SENDER'] = 'giovana.rpa27@gmail.com'

    mail.init_app(app)

    with app.app_context():
        db.create_all()

    return app

app = create_app()

if __name__ == '__main__':
    app.run(
        host=app.config.get("HOST"), 
        port=app.config.get("PORT"), 
        debug=app.config.get("DEBUG")
    )