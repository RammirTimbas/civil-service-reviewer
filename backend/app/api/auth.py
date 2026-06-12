from flask import Blueprint, request, jsonify, current_app
from app.services.auth_service import AuthService
from google.oauth2 import id_token
from google.auth.transport import requests
from app.extensions import mongo
from app.middleware.rate_limit import rate_limit
import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
@rate_limit
def register():
    data = request.get_json()
    result, status = AuthService.register_user(data)
    return jsonify(result), status

@auth_bp.route('/login', methods=['POST'])
@rate_limit
def login():
    data = request.get_json()
    result, status = AuthService.login_user(data)
    return jsonify(result), status

@auth_bp.route('/google-login', methods=['POST'])
@rate_limit
def google_login():
    token = request.json.get('token')
    if not token:
        return jsonify({'error': 'Token is required'}), 400

    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), current_app.config['GOOGLE_CLIENT_ID'])

        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')

        google_id = idinfo['sub']
        email = idinfo['email']
        name = idinfo.get('name', '')
        picture = idinfo.get('picture', '')

        user = mongo.db.users.find_one({'email': email})

        if not user:
            user_id = mongo.db.users.insert_one({
                'email': email,
                'name': name,
                'google_id': google_id,
                'profile_picture': picture,
                'role': 'User',
                'created_at': datetime.datetime.utcnow(),
                'total_questions_attempted': 0,
                'total_correct': 0,
                'study_streak': 0
            }).inserted_id
            user = mongo.db.users.find_one({'_id': user_id})
        else:
            mongo.db.users.update_one(
                {'_id': user['_id']},
                {'$set': {'google_id': google_id, 'profile_picture': picture}}
            )

        access_token = AuthService.generate_token(user['_id'])

        return jsonify({
            'token': access_token,
            'user': {
                'id': str(user['_id']),
                'name': user['name'],
                'email': user['email'],
                'role': user['role'],
                'profile_picture': user.get('profile_picture')
            }
        }), 200

    except ValueError:
        return jsonify({'error': 'Invalid Google token'}), 401
