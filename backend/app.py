from flask import Flask
from flask_cors import CORS
from config import Config, db

def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)
    app.secret_key = Config.SECRET_KEY 

    CORS(app,resources={r'/*':{
        "origins":['http://localhost:5173',"http://127.0.0.1:5173"],
        "methods":["GET","POST","PUT","DELETE","OPTIONS"],
        "allow_headers": ["Content-Type","Authorization"]
        }})

    db.init_app(app)

    from animais.animais_routes import animais_bp
    from user.user_route import user_bp
    app.register_blueprint(user_bp)
    app.register_blueprint(animais_bp)

    with app.app_context():
        from animais.animais_model import Animais,PedidoAdocao
        from user.user_model import User
        db.create_all()

    return app

app = create_app()

if __name__ == '__main__':
    app.run(
        host=app.config.get("HOST"), 
        port=app.config.get("PORT"), 
        debug=app.config.get("DEBUG"))
    
    