from models.users import User
from app import db
from flask import request, flash, redirect, url_for, render_template, Blueprint, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity



auth = Blueprint('auth', __name__)

@auth.route('/signup', methods=['POST', 'GET'])
def signup():
    if request.method == 'GET':
        return render_template('signup.html')
    
    username = request.form["username"]
    password = request.form["password"]
    email = request.form["email"]
    
    user = User(username=username, email=email)
    user.set_password(password=password)
    db.session.add(user)
    db.session.commit()
    flash('Account Created, you can log in.', 'success')
    return redirect(url_for('auth.login'))

@auth.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    
    username = request.json["username"]
    password = request.json['password']
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password=password):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token, user=user.user_dict()), 200
    # flash('Login failed. Check your email and password.', 'danger')
    return jsonify({"msg": "Invalid username or password"}), 401

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))

@auth.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', username=current_user.username)
            