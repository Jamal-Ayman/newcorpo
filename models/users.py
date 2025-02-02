from app import db
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model, UserMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(200), unique=True, nullable=False)
    username = db.Column(db.String(200), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)  # Store the hashed password
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    tdata = db.relationship('TabularData', backref='tabular_data', lazy=True)
    idata = db.relationship('Image', backref='image_data', lazy=True)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def user_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email
        }
    
    def json(self):
        return {'id':id, 'username':self.username, 'email':self.email}