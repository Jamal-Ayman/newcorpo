from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_jwt_extended import JWTManager
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
CORS(app)

# Register Models
from models.users import User
from models.tabular_data import TabularData
from models.image_upload import Image

login_manager = LoginManager()
login_manager.init_app(app)
# Define the user_loader function for Flask-Login
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Set the login view for Flask-Login
login_manager.login_view = 'login'

# Register blueprints
from views.authenticate import auth as auth_blueprint
app.register_blueprint(auth_blueprint)

from views.corpo_api import corpo as corpo_blueprint
app.register_blueprint(corpo_blueprint)
from views.image_view import image as image_blueprint
app.register_blueprint(image_blueprint)
from views.text_handler_view import text as text_blueprint
app.register_blueprint(text_blueprint)


@app.route('/')
def hello_world():
    return "<p>Hello, World!</p>"