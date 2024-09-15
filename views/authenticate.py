from models.users import User
from app import db
from flask import request, flash, redirect, url_for, render_template, Blueprint, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import re



auth = Blueprint('auth', __name__)

def check_users(username, email, password):
    if not email or not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return False, "Invalid email address"

    if not password or len(password) < 6:
        return False, "Password must be at least 6 characters"

    if not username or len(username) < 3:
        return False, "Username must be at least 3 characters"
    user = User.query.filter((User.email == email) | (User.username == username)).first()
    if user:
        return False, "User already exists"
    return True, "valid"


@auth.route('/signup', methods=['POST'])
def signup():
    try:
        username = request.json["username"]
        password = request.json["password"]
        email = request.json["email"]
    except:
        return jsonify({"message":"invalid request body"}), 400    
    valid, message = check_users(username=username, email=email, password=password)
    if not valid:
        return jsonify({"message":message}), 400
    user = User(username=username, email=email)
    user.set_password(password=password)
    db.session.add(user)
    db.session.commit()
    return jsonify({"message":"Account Created, you can log in."}), 200

@auth.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    
    username = request.json["username"]
    password = request.json['password']
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password=password):
        access_token = create_access_token(identity=user.id)
        return jsonify(token=access_token, user=user.user_dict()), 200
    # flash('Login failed. Check your email and password.', 'danger')
    return jsonify({"message": "Invalid username or password"}), 401

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))

@auth.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', username=current_user.username)
            

@auth.route('/account-info')
@jwt_required()
def get_account_info():
    user = get_jwt_identity()
    user_object = User.query.filter_by(id=user).first()
    user_dict = {
        "username": user_object.username,
        "email": user_object.email
    }
    return jsonify(user_dict), 200

@auth.route('/update-account-info', methods=["POST"])
@jwt_required()
def update_account_info():
    user = get_jwt_identity()
    user_object = User.query.filter_by(id=user).first()
    username = request.json["username"]
    email = request.json["email"]
    password = request.json['password']
    if user_object and user_object.check_password(password=password):
        user = User(username=username, email=email)
        db.session.add(user)
        db.session.commit() 
        return jsonify({"message": "account updated"}), 200
    return jsonify({"message": "invalid body"}), 400            