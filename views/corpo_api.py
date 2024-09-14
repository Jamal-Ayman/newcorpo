from models.users import User
from models.tabular_data import TabularData
from app import db
import os, json
import pandas as pd
from flask import request, Blueprint, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from config import Config
import matplotlib.pyplot as plt
from io import BytesIO


corpo = Blueprint('corpo', __name__)

def check_allowed_sheet(filename):
    return '.' in filename and filename.split('.')[1].lower() in ["csv"]

@corpo.route('/upload', methods=['POST'])
@jwt_required()
def upload_file():
    authenticted_user_id = get_jwt_identity()
    user = User.query.filter_by(id=authenticted_user_id).first()
    if not user:
        return jsonify({"message":"authentication failure", "success": False}), 400
    file = request.files['file']
    if file.name == "":
        return jsonify({'message': 'No file selected', "success": False}), 400
    if not file or not check_allowed_sheet(file.filename):
        return jsonify({'message': 'File not found or not allowed', "success": False}), 400
    filename = secure_filename(file.filename)
    file_path = os.path.join(Config.UPLOAD_FOLDER, filename)
    file.save(file_path)
    df = pd.read_csv(file_path)
    dataset = TabularData(filename=filename, data=df.to_json(), user_id=authenticted_user_id)
    db.session.add(dataset)
    db.session.commit()
    return jsonify({'message': f'File {filename} uploaded and saved.'}), 200
        
@corpo.route('/tabular_data/<int:id>/statistics', methods=['GET'])
@jwt_required()
def get_statistics(id):
    authenticated_user = get_jwt_identity()
    dataset = TabularData.query.filter_by(id=id, user_id=authenticated_user).first()
    if not dataset:
       return jsonify({"message":"not found"}), 404
    df = pd.read_json(dataset.data)

    statistics = {
        'mean': df.mean().to_dict(),
        'median': df.median().to_dict(),
        'mode': df.mode().iloc[0].to_dict(),
        'quartiles': df.quantile([0.25, 0.5, 0.75]).to_dict(),
        'outliers': df[(df < (df.mean() - 3 * df.std())) | (df > (df.mean() + 3 * df.std()))].dropna().to_dict()
    }

    return jsonify(statistics), 200


# Endpoint for generating a graph (e.g., histogram)
@corpo.route('/dataset/<int:id>/graph', methods=['GET'])
@jwt_required()
def generate_graph(id):
    authenticated_user = get_jwt_identity()
    dataset = TabularData.query.filter_by(id=id, user_id=authenticated_user).first()
    if not dataset:
       return jsonify({"message":"not found"}), 404
    df = pd.read_json(dataset.data)

    # Example: Generate a histogram for the first column
    plt.figure()
    df[df.columns[0]].hist()
    
    # Save to a BytesIO object
    img = BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    
    return send_file(img, mimetype='image/png')

# CRUD Operations

# Retrieve all datasets
@corpo.route('/datasets', methods=['GET'])
@jwt_required()
def get_all_datasets():
    authenticated_user = get_jwt_identity()
    datasets = TabularData.query.filter_by(user_id=authenticated_user)
    return jsonify([{'id': dataset.id, 'filename': dataset.filename} for dataset in datasets]), 200

# Retrieve a specific dataset by ID
@corpo.route('/dataset/<int:id>', methods=['GET'])
@jwt_required()
def get_dataset(id):
    authenticated_user = get_jwt_identity()
    dataset = TabularData.query.filter_by(id=id, user_id=authenticated_user).first()
    if not dataset:
       return jsonify({"message":"not found"}), 404
    return jsonify({'id': dataset.id, 'filename': dataset.filename, 'data': dataset.data}), 200

# Update a dataset by ID
@corpo.route('/dataset/<int:id>', methods=['PUT'])
@jwt_required()
def update_dataset(id):
    authenticated_user = get_jwt_identity()
    dataset = TabularData.query.filter_by(id=id, user_id=authenticated_user).first()
    if not dataset:
       return jsonify({"message":"not found"}), 404
    data = request.get_json()
    dataset.data = json.dumps(data)
    db.session.commit()
    return jsonify({'message': 'Dataset updated'}), 200

# Delete a dataset by ID
@corpo.route('/dataset/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_dataset(id):
    authenticated_user = get_jwt_identity()
    dataset = TabularData.query.filter_by(id=id, user_id=authenticated_user).first()
    if not dataset:
       return jsonify({"message":"not found"}), 404
    db.session.delete(dataset)
    db.session.commit()
    return jsonify({'message': 'Dataset deleted'}), 200    

@corpo.route('/all')
@jwt_required()
def get_all_users():
    user = get_jwt_identity()
    users = User.query.all()
    users_list = [{"id": user.id, "username": user.username, "email": user.email} for user in users]
    return jsonify({"users": users_list}), 200

@corpo.route('/datasets_count')
@jwt_required()
def datasets_count():
    user = get_jwt_identity()
    datasets_list = list(TabularData.query.filter_by(user_id=user))
    return jsonify({"datasets_count": len(datasets_list)}), 200


