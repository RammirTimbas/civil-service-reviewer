from flask import Blueprint, request, jsonify
from app.middleware.auth import token_required
from app.services.learn_service import LearnService

learn_bp = Blueprint('learn', __name__)

@learn_bp.route('/session', methods=['GET'])
@token_required
def get_learn_session(current_user):
    category = request.args.get('category')
    subcategory = request.args.get('subcategory')
    session_data = LearnService.get_learn_session(category, subcategory)

    if not session_data:
        return jsonify({'error': 'No learning modules found for this criteria'}), 404

    return jsonify(session_data), 200

@learn_bp.route('/topics', methods=['GET'])
@token_required
def get_topics(current_user):
    category = request.args.get('category')
    topics = LearnService.get_available_topics(category)
    return jsonify(topics), 200
