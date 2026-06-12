from flask import Flask
from flask_cors import CORS
from app.config import config
from app.middleware.errors import register_error_handlers
import os
import logging

def create_app(config_name=None):
    if config_name is None:
        config_name = os.getenv('FLASK_CONFIG', 'default')

    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # Configure Logging
    logging.basicConfig(level=logging.INFO)

    # Allow FRONTEND_URL to be a single origin or a comma-separated list (e.g. "http://localhost:3000,http://localhost:3001")
    origins = app.config.get('FRONTEND_URL') or ''
    if isinstance(origins, str) and ',' in origins:
        origins = [o.strip() for o in origins.split(',') if o.strip()]

    CORS(app, resources={r"/api/*": {"origins": origins}})

    # Initialize extensions
    from app.extensions import mongo, bcrypt
    mongo.init_app(app)
    bcrypt.init_app(app)

    # Register error handlers
    register_error_handlers(app)

    # Register blueprints
    from app.api.auth import auth_bp
    from app.api.questions import questions_bp
    from app.api.users import users_bp
    from app.api.progress import progress_bp
    from app.api.exams import exams_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(questions_bp, url_prefix='/api/questions')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(progress_bp, url_prefix='/api/progress')
    app.register_blueprint(exams_bp, url_prefix='/api/exams')

    @app.route('/health')
    def health_check():
        return {'status': 'healthy'}, 200

    return app
