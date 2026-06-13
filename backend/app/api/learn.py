from flask import Blueprint, request, jsonify
from app.middleware.auth import token_required
from app.services.learn_service import LearnService

learn_bp = Blueprint('learn', __name__)

@learn_bp.route('/session', methods=['GET'])
@token_required
def get_learn_session(current_user):
    category = request.args.get('category')
    session_data = LearnService.get_learn_session(category)

    if not session_data:
        return jsonify({'error': 'No learning modules found for this category'}), 404

    return jsonify(session_data), 200
