import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'default_secret_key')
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "postgresql://corp1:Corp@0.0.0.0:5432/corp")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = 'supersecretkey'  # Change this in production!
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    UPLOAD_FOLDER = './upload'
    IMAGE_UPLOAD_FOLDER = './upload/images'