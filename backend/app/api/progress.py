from flask import Blueprint, request, jsonify
from app.middleware.auth import token_required
from app.extensions import mongo
import datetime
from bson.objectid import ObjectId

progress_bp = Blueprint('progress', __name__)

@progress_bp.route('/track', methods=['POST'])
@token_required
def track_progress(current_user):
    data = request.get_json()
    question_id = data.get('question_id')
    is_correct = data.get('is_correct')
    mode = data.get('mode') # Learn, Practice, Mock

    if not question_id:
        return jsonify({'error': 'Question ID is required'}), 400

    # Update user progress record
    mongo.db.user_progress.update_one(
        {'user_id': current_user['_id'], 'question_id': ObjectId(question_id)},
        {
            '$set': {
                'last_attempt_at': datetime.datetime.utcnow(),
                'status': 'correct' if is_correct else 'incorrect'
            },
            '$inc': {
                'attempts': 1,
                'correct_count': 1 if is_correct else 0
            }
        },
        upsert=True
    )

    # Update user global stats
    mongo.db.users.update_one(
        {'_id': current_user['_id']},
        {
            '$inc': {
                'total_questions_attempted': 1,
                'total_correct': 1 if is_correct else 0
            },
            '$set': {'last_active': datetime.datetime.utcnow()}
        }
    )

    return jsonify({'message': 'Progress tracked successfully'}), 200

@progress_bp.route('/stats', methods=['GET'])
@token_required
def get_detailed_stats(current_user):
    pipeline = [
        {'$match': {'user_id': current_user['_id']}},
        {'$lookup': {
            'from': 'questions',
            'localField': 'question_id',
            'foreignField': '_id',
            'as': 'question'
        }},
        {'$unwind': '$question'},
        {'$group': {
            '_id': '$question.category',
            'correct': {'$sum': {'$cond': [{'$eq': ['$status', 'correct']}, 1, 0]}},
            'total': {'$sum': 1}
        }}
    ]

    stats = list(mongo.db.user_progress.aggregate(pipeline))
    return jsonify(stats), 200
