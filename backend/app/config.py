import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key')
    MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/civil_service_db')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET')
    FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
    # Next official civil service exam date in ISO format (YYYY-MM-DD)
    EXAM_DATE = os.environ.get('EXAM_DATE', '')

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
