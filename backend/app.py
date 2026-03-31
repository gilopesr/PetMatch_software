from flask import Flask
from flask_cors import CORS
from config import Config, db
from user.user_route import user_bp
from user.user_model import User


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    #app.secret_key = 'chave_secreta'
    
    CORS(app)
    
    db.init_app(app)

    app.register_blueprint(user_bp)

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