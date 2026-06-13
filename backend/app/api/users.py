from flask import Blueprint, jsonify, request
from app.middleware.auth import token_required
from app.extensions import mongo
from bson.objectid import ObjectId

users_bp = Blueprint('users', __name__)

@users_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    current_user['id'] = str(current_user['_id'])
    del current_user['_id']
    if 'password' in current_user:
        del current_user['password']
    return jsonify(current_user), 200

@users_bp.route('/me', methods=['PUT'])
@token_required
def update_current_user(current_user):
    data = request.get_json()
    allowed_fields = ['name'] # Add more fields as needed
    update_data = {}

    for field in allowed_fields:
        if field in data:
            update_data[field] = data[field]

    if not update_data:
        return jsonify({'error': 'No valid fields to update'}), 400

    mongo.db.users.update_one(
        {'_id': current_user['_id']},
        {'$set': update_data}
    )

    return jsonify({'message': 'Profile updated successfully'}), 200

@users_bp.route('/stats', methods=['GET'])
@token_required
def get_user_stats(current_user):
    # Aggregate summary stats
    total_attempted = current_user.get('total_questions_attempted', 0)
    total_correct = current_user.get('total_correct', 0)

    accuracy = (total_correct / total_attempted * 100) if total_attempted > 0 else 0

    # Get total count of questions available in DB for progress %
    total_questions_in_db = mongo.db.questions.count_documents({})
    unique_questions_attempted = mongo.db.user_progress.count_documents({'user_id': current_user['_id']})

    overall_progress = (unique_questions_attempted / total_questions_in_db * 100) if total_questions_in_db > 0 else 0

    stats = {
        'overall_accuracy': round(accuracy, 1),
        'questions_solved': unique_questions_attempted,
        'total_attempts': total_attempted,
        'study_streak': current_user.get('study_streak', 0),
        'overall_progress': round(overall_progress, 1)
    }

    return jsonify(stats), 200
