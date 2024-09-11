from newcorpo.models.users import User
from app import db, app
from werkzeug.security import generate_password_hash, check_password_hash
from flask import request, flash, redirect, url_for, render_template
from flask_login import login_user, logout_user, login_required, current_user

@app.route('/signup', methods=['POST', 'GET'])
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

@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    
    username = request.form["username"]
    password = request.form['password']
    user = User.query.filter_by(username=username).last()
    if user and user.check_password(password=password):
        login_user(user)
        return redirect(url_for('dashboard'))
    flash('Login failed. Check your email and password.', 'danger')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', username=current_user.username)
            