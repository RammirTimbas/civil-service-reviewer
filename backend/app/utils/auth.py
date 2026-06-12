import jwt
import datetime
from flask import current_app

def generate_tokens(user_id):
    access_token_payload = {
        'exp': datetime.datetime.utcnow() + current_app.config['JWT_ACCESS_TOKEN_EXPIRES'],
        'iat': datetime.datetime.utcnow(),
        'sub': str(user_id),
        'type': 'access'
    }

    refresh_token_payload = {
        'exp': datetime.datetime.utcnow() + current_app.config['JWT_REFRESH_TOKEN_EXPIRES'],
        'iat': datetime.datetime.utcnow(),
        'sub': str(user_id),
        'type': 'refresh'
    }

    access_token = jwt.encode(access_token_payload, current_app.config['SECRET_KEY'], algorithm='HS256')
    refresh_token = jwt.encode(refresh_token_payload, current_app.config['SECRET_KEY'], algorithm='HS256')

    return access_token, refresh_token

def verify_token(token):
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return {'error': 'Token expired'}
    except jwt.InvalidTokenError:
        return {'error': 'Invalid token'}
