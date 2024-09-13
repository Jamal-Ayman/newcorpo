from models.users import User
from models.image_upload import Image
from app import db
import cv2
import os
from flask import request, Blueprint, jsonify, send_file, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from config import Config
import matplotlib.pyplot as plt
from io import BytesIO

image = Blueprint('image', __name__)

def check_allowed_image(filename):
    return '.' in filename and filename.split('.')[1].lower() in ["png"]

def get_image_path(authenticted_user_id, image_id):
    image_object = Image.query.filter_by(id=image_id, user_id=authenticted_user_id).first()
    if not image_object:
        return False, f"image object not found {image_id}"
    return True, os.path.join(Config.IMAGE_UPLOAD_FOLDER, image_object.image)

def check_crop_validity(width, height, image_box):
    valid = True
    left, upper, right, lower = image_box
    if right > width or lower > height:
        valid = False    
    if right <= left or lower <= upper:
        valid = False
    return valid    
    

@image.route('/upload_image', methods=['POST'])
@jwt_required()
def upload_images():
    authenticted_user_id = get_jwt_identity()
    user = User.query.filter_by(id=authenticted_user_id).first()
    if not user:
        return jsonify({"message":"authentication failure", "success": False}), 400
    if 'file' not in request.files:
        return jsonify({'message': 'No files part in the request'}), 400

    files = request.files.get('file')
    uploaded_files = []

    for file in [files]:
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
    status, file_path = get_image_path(authenticted_user_id=authenticted_user_id, image_id=id)
    if not status:
        return jsonify({'message': file_path}), 404
    
    if not file_path:
        return jsonify({'message': 'File not found'}), 404

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

@image.route('/image/<id>/segmentation', methods=['GET'])
@jwt_required()
def generate_segmentation(id):
    from PIL import Image
    authenticted_user_id = get_jwt_identity()
    status, file_path = get_image_path(authenticted_user_id=authenticted_user_id, image_id=id)
    if not status:
        return jsonify({'message': file_path}), 404
    
    if not file_path:
        return jsonify({'message': 'File not found'}), 404

    # Open the image
    image = cv2.imread(file_path)

    # Convert the image to grayscale
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply a simple threshold to segment the image
    _, mask = cv2.threshold(gray_image, 128, 255, cv2.THRESH_BINARY)

    # Save the mask
    mask_image = Image.fromarray(mask)
    img_io = BytesIO()
    mask_image.save(img_io, 'PNG')
    img_io.seek(0)

    return send_file(img_io, mimetype='image/png')

@image.route('/image/<id>/resize', methods=['POST'])
@jwt_required()
def resize_image(id):
    from PIL import Image
    authenticted_user_id = get_jwt_identity()
    status, file_path = get_image_path(authenticted_user_id=authenticted_user_id, image_id=id)
    if not status:
        return jsonify({'message': file_path}), 404

    if not file_path:
        return jsonify({'message': 'File not found'}), 404

    # Get the new width and height from the request
    width = request.json.get('width')
    height = request.json.get('height')

    if not width or not height:
        return jsonify({'messge': 'Please provide both width and height'}), 400

    # Open and resize the image
    image = Image.open(file_path)
    resized_image = image.resize((width, height))

    # Save the resized image
    img_io = BytesIO()
    resized_image.save(img_io, 'PNG')
    img_io.seek(0)

    return send_file(img_io, mimetype='image/png')

@image.route('/image/<id>/crop', methods=['POST'])
@jwt_required()
def crop_image(id):
    from PIL import Image
    authenticted_user_id = get_jwt_identity()
    status, file_path = get_image_path(authenticted_user_id=authenticted_user_id, image_id=id)
    if not status:
        return jsonify({'message': file_path}), 404

    if not file_path:
        return jsonify({'message': 'File not found'}), 404

    # Get the crop box from the request (left, upper, right, lower)
    box = request.json.get('box')

    if not box or len(box) != 4:
        return jsonify({'error': 'Please provide a valid crop box [left, upper, right, lower]'}), 400

    # Open and crop the image
    image = Image.open(file_path)
    width, height = image.size
    valid = check_crop_validity(
        width=width, 
        height=height, 
        image_box=box
        )
    if not valid:
       return jsonify({'messag': f'Please provide a valid crop box w{width}, h{height}'}), 400 
    try:
        cropped_image = image.crop(box)
    except Exception as e:
        return jsonify({'messag': 'Please provide a valid crop box [left, upper, right, lower]'}), 400    

    # Save the cropped image
    img_io = BytesIO()
    cropped_image.save(img_io, 'PNG')
    img_io.seek(0)

    return send_file(img_io, mimetype='image/png')

@image.route('/image/<id>/convert', methods=['POST'])
@jwt_required()
def convert_image(id):
    from PIL import Image
    authenticted_user_id = get_jwt_identity()
    status, file_path = get_image_path(authenticted_user_id=authenticted_user_id, image_id=id)
    if not status:
        return jsonify({'message': file_path}), 404

    if not file_path:
        return jsonify({'message': 'File not found'}), 404

    # Get the desired format from the request (e.g., 'png', 'jpg')
    new_format = request.json.get('format')

    if not new_format or new_format.lower() not in ['png', 'jpeg']:
        return jsonify({'message': 'Please provide a valid format (png, jpg, jpeg)'}), 400

    image = Image.open(file_path)
        
    if image.mode == 'P' and new_format.lower() in ['jpg', 'jpeg']:
        image = image.convert('RGB')
    
    # Open and convert the image

    img_io = BytesIO()
    image.save(img_io, new_format.upper())
    img_io.seek(0)

    return send_file(img_io, mimetype=f'image/{new_format.lower()}')

@image.route('/images', methods=['GET'])
@jwt_required()
def get_all_datasets():
    authenticated_user = get_jwt_identity()
    datasets = Image.query.filter_by(user_id=authenticated_user)
    return jsonify([{'id': dataset.id, 'imagename': dataset.image, 'url': get_image_path(authenticted_user_id=authenticated_user, image_id=dataset.id)[1]} for dataset in datasets]), 200

@image.route('/image/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_dataset(id):
    authenticated_user = get_jwt_identity()
    dataset = Image.query.filter_by(id=id, user_id=authenticated_user).first()
    if not dataset:
       return jsonify({"message":"not found"}), 404
    db.session.delete(dataset)
    db.session.commit()
    return jsonify({'message': 'Dataset deleted'}), 200

@image.route('/image/<int:id>', methods=['GET'])
@jwt_required()
def get_image_paths(id):
    authenticated_user = get_jwt_identity()
    status, file_path = get_image_path(authenticted_user_id=authenticated_user, image_id=id)
    if not status:
        return jsonify({'message': file_path}), 404

    if not file_path:
        return jsonify({'message': 'File not found'}), 404 
    return jsonify({'url': file_path}), 200 