from models.users import User
from models.image_upload import Image
from app import db
import cv2
import os, json
import pandas as pd
from flask import request, Blueprint, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from config import Config
import matplotlib.pyplot as plt
from io import BytesIO

image = Blueprint('image', __name__)

def check_allowed_image(filename):
    return '.' in filename and filename.split('.')[1].lower() in ["png"]

@image.route('/upload_image', methods=['POST'])
@jwt_required()
def upload_images():
    authenticted_user_id = get_jwt_identity()
    user = User.query.filter_by(id=authenticted_user_id).first()
    if not user:
        return jsonify({"message":"authentication failure", "success": False}), 400
    if 'files[]' not in request.files:
        return jsonify({'error': 'No files part in the request'}), 400

    files = request.files.getlist('files[]')
    uploaded_files = []

    for file in files:
        if file and check_allowed_image(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join('./upload/images', filename)
            file.save(file_path)
            dataset = Image(image=filename, data={}, user_id=authenticted_user_id)
            db.session.add(dataset)
            db.session.commit()
            uploaded_files.append(filename)
    
    return jsonify({'message': 'Files uploaded successfully', 'files': uploaded_files}), 200

@image.route('/image/<id>/histogram', methods=['GET'])
@jwt_required()
def generate_histogram(id):
    authenticted_user_id = get_jwt_identity()
    image_object = Image.query.filter_by(id=id, user_id=authenticted_user_id).first()
    file_path = os.path.join(Config.IMAGE_UPLOAD_FOLDER, image_object.image)
    print(file_path)
    
    if not os.path.exists(file_path):
        return jsonify({'error': 'File not found'}), 404

    # Open the image and split the channels
    image = cv2.imread(file_path)
    color = ('b', 'g', 'r')
    
    plt.figure()
    
    # Generate histogram for each channel
    for i, col in enumerate(color):
        hist = cv2.calcHist([image], [i], None, [256], [0, 256])
        plt.plot(hist, color=col)
        plt.xlim([0, 256])

    plt.title('Color Histogram')
    plt.xlabel('Bins')
    plt.ylabel('# of Pixels')

    # Save and return the histogram as an image
    img = BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    
    return send_file(img, mimetype='image/png')