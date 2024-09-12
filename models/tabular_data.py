from app import db
from models.users import User
class TabularData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'),
        nullable=False)
    filename = db.Column(db.String(200), nullable=False)
    data = db.Column(db.JSON, nullable=False)
    
    def __repr__(self):
        return f"<Dataset {self.filename}>"