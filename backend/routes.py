from .database import db
from .models import *
from flask import current_app as app, jsonify, request, render_template, send_file
from flask_security import auth_required, roles_required, current_user, hash_password, login_user
from werkzeug.security import check_password_hash, generate_password_hash
from .tasks import csv_report, generate_csv_and_send_email
from celery.result import AsyncResult
import os 


@app.route('/', methods = ['GET'])
def home():
    return render_template('index.html')



@app.route('/api/home')
@auth_required('token')
@roles_required('user')
def user_home():
    user = current_user
    return jsonify({
        'fullname': user.fullname,
        'email': user.email,
        'password': user.password
    })


@app.route('/api/login', methods=['POST'])
def user_login():
    body = request.get_json()
    email = body['email']
    password = body['password']

    if not email:
        return jsonify({
            'message': 'email required'
        })
    
    user = app.security.datastore.find_user(email = email)

    if user:
        if check_password_hash(user.password, password):
            login_user(user)
            return jsonify({
                'id' : user.id,
                'email' : user.email,
                'role' : current_user.roles[0].name if current_user.roles else "user",
                "auth-token": user.get_auth_token()
            })
        else:
            return jsonify({
                'message': 'incorrect password'
            })
    else:
        return jsonify({
            'message': 'user not found'
        })



@app.route('/api/register', methods = ['POST'])
def create_user():
    credentials =request.get_json()
    if not app.security.datastore.find_user(email = credentials['email']):
        app.security.datastore.create_user(
            email = credentials['email'],
            password = generate_password_hash(credentials['password']),
            fullname = credentials['fullname'],
            qualification = credentials['qualification'],
            dob = credentials['dob'],
            roles = ['user']
        )
        db.session.commit()
        return jsonify({
            "message": "user created"
        })

    return jsonify({
        'message': "user already exist"
    })



@app.route('/api/admin_home', methods=['GET'])
@auth_required('token')
@roles_required('admin')
def admin_home():
    try:
        
        auth_header = request.headers.get("Token")
        print("Received Authorization Header:", auth_header)

        if not auth_header:
            return jsonify({"status": "error", "message": "No Authorization header found"}), 401

        
        subjects = Subject.query.options(db.joinedload(Subject.chapters)).all()

        # Format data
        admin_data = [
            {
                "subject_id": subject.id,
                "subject_name": subject.subjectname,
                "chapters": [
                    {
                        "chapter_id": chapter.id,
                        "chapter_name": chapter.chaptername
                    } for chapter in subject.chapters
                ]
            } for subject in subjects
        ]

        print("Returning JSON Response:", admin_data)  

        return jsonify({
            "status": "success",
            "admin_home_data": admin_data
        }), 200  

    except Exception as e:
        print("ERROR in /api/admin_home:", str(e))  
        return jsonify({"status": "error", "message": str(e)}), 500  


@app.route('/api/export')
@auth_required('token')
@roles_required('user')
def export_csv():
    if not current_user.is_authenticated:
        return jsonify({"error": "User not authenticated"}), 401  

    user_id = current_user.id  

    result = csv_report.delay(user_id)  
    return jsonify({
        "task_id": result.id
    })

@app.route('/api/csv_result/<task_id>')
def csv_result(task_id):
    result = AsyncResult(task_id)

    try:
        if result.ready():
            if result.successful():
                file_path = result.result  

                if os.path.exists(file_path):  
                    return send_file(
                        file_path,
                        as_attachment=True,
                        download_name="quiz_report.csv",
                        mimetype="text/csv"
                    )

                return jsonify({"error": "File not found"}), 404

            return jsonify({
                "ready": True,
                "successful": False,
                "error": str(result.result)
            })

        return jsonify({"ready": False, "successful": False, "value": None})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500  


@app.route('/api/import', methods=["POST"])
@auth_required('token')
@roles_required('user')
def import_csv():
    if not current_user.is_authenticated:
        return jsonify({"error": "User not authenticated"}), 401

    user_id = current_user.id
    user_email = current_user.email  

    
    result = generate_csv_and_send_email.delay(user_id, user_email)

    return jsonify({
        "task_id": result.id,
        "message": "CSV generation started. You will receive an email when it's ready."
    })

