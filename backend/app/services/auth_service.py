import jwt
import datetime
from flask import current_app
from app.extensions import mongo, bcrypt
from bson.objectid import ObjectId

class AuthService:
    @staticmethod
    def generate_token(user_id):
        payload = {
            'exp': datetime.datetime.utcnow() + current_app.config['JWT_ACCESS_TOKEN_EXPIRES'],
            'iat': datetime.datetime.utcnow(),
            'sub': str(user_id)
        }
        return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')

    @staticmethod
    def register_user(data):
        if mongo.db.users.find_one({'email': data['email']}):
            return {'error': 'User already exists'}, 400

        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        user_id = mongo.db.users.insert_one({
            'email': data['email'],
            'password': hashed_password,
            'name': data['name'],
            'role': 'User',
            'created_at': datetime.datetime.utcnow(),
            'total_questions_attempted': 0,
            'total_correct': 0,
            'study_streak': 0
        }).inserted_id

        return {'message': 'User registered successfully'}, 201

    @staticmethod
    def login_user(data):
        user = mongo.db.users.find_one({'email': data['email']})
        if user and bcrypt.check_password_hash(user['password'], data['password']):
            token = AuthService.generate_token(user['_id'])
            return {
                'token': token,
                'user': {
                    'id': str(user['_id']),
                    'name': user['name'],
                    'email': user['email'],
                    'role': user['role']
                }
            }, 200
        return {'error': 'Invalid credentials'}, 401
