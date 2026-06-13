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
    allowed_fields = ['name']
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
    total_attempted = current_user.get('total_questions_attempted', 0)
    total_correct = current_user.get('total_correct', 0)
    accuracy = (total_correct / total_attempted * 100) if total_attempted > 0 else 0

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

@users_bp.route('/leaderboard', methods=['GET'])
@token_required
def get_leaderboard(current_user):
    metric = request.args.get('metric', 'total_correct')
    category = request.args.get('category')
    try:
        limit = int(request.args.get('limit', 10))
    except:
        limit = 10

    if category:
        # If category is provided, we must aggregate from user_progress
        pipeline = [
            {
                '$lookup': {
                    'from': 'questions',
                    'localField': 'question_id',
                    'foreignField': '_id',
                    'as': 'q'
                }
            },
            { '$unwind': '$q' },
            { '$match': { 'q.category': category } },
            {
                '$group': {
                    '_id': '$user_id',
                    'total_correct': { '$sum': { '$cond': [{ '$eq': ['$status', 'correct'] }, 1, 0] } },
                    'total_attempted': { '$sum': 1 },
                    'study_streak': { '$max': 0 } # Streak isn't per category easily
                }
            },
            {
                '$lookup': {
                    'from': 'users',
                    'localField': '_id',
                    'foreignField': '_id',
                    'as': 'u'
                }
            },
            { '$unwind': '$u' },
            {
                '$project': {
                    'name': '$u.name',
                    'profile_picture': '$u.profile_picture',
                    'total_correct': 1,
                    'total_attempted': 1,
                    'accuracy': {
                        '$cond': [
                            { '$gt': ['$total_attempted', 0] },
                            { '$multiply': [{ '$divide': ['$total_correct', '$total_attempted'] }, 100] },
                            0
                        ]
                    }
                }
            }
        ]

        sort_key = metric if metric in ['total_correct', 'accuracy'] else 'total_correct'
        pipeline.append({ '$sort': { sort_key: -1 } })
        pipeline.append({ '$limit': limit })

        top_users = list(mongo.db.user_progress.aggregate(pipeline))

        leader_list = []
        for u in top_users:
            leader_list.append({
                'id': str(u['_id']),
                'name': u.get('name'),
                'profile_picture': u.get('profile_picture'),
                'value': round(u.get(sort_key, 0), 1)
            })

        # My rank (simplified for category)
        my_rank = 0
        my_value = 0
        # This is expensive to do for everyone, so we'll just check if current user is in top or 0
        user_in_list = next((l for l in leader_list if l['id'] == str(current_user['_id'])), None)
        if user_in_list:
            my_value = user_in_list['value']
            # Find index
            for idx, l in enumerate(leader_list):
                if l['id'] == str(current_user['_id']):
                    my_rank = idx + 1
                    break

        return jsonify({
            'metric': metric,
            'category': category,
            'leaders': leader_list,
            'my_rank': my_rank or "Top " + str(limit) + "+",
            'my_value': my_value
        }), 200

    else:
        # Global leaderboard (existing logic)
        pipeline = []
        if metric == 'accuracy':
            pipeline = [
                {
                    '$project': {
                        'name': 1,
                        'profile_picture': 1,
                        'total_correct': { '$ifNull': ['$total_correct', 0] },
                        'total_questions_attempted': { '$ifNull': ['$total_questions_attempted', 0] },
                        'accuracy': {
                            '$cond': [
                                { '$gt': ['$total_questions_attempted', 0] },
                                { '$multiply': [ { '$divide': ['$total_correct', '$total_questions_attempted'] }, 100 ] },
                                0
                            ]
                        }
                    }
                },
                { '$sort': { 'accuracy': -1 } },
                { '$limit': limit }
            ]
        elif metric == 'study_streak':
            pipeline = [
                { '$project': { 'name': 1, 'profile_picture': 1, 'study_streak': { '$ifNull': ['$study_streak', 0] } } },
                { '$sort': { 'study_streak': -1 } },
                { '$limit': limit }
            ]
        else:
            pipeline = [
                { '$project': { 'name': 1, 'profile_picture': 1, 'total_correct': { '$ifNull': ['$total_correct', 0] } } },
                { '$sort': { 'total_correct': -1 } },
                { '$limit': limit }
            ]

        top_users = list(mongo.db.users.aggregate(pipeline))
        leader_list = []
        for u in top_users:
            leader_list.append({
                'id': str(u.get('_id')),
                'name': u.get('name'),
                'profile_picture': u.get('profile_picture'),
                'value': float(u.get(metric)) if metric in u else (
                    float(u.get('accuracy')) if 'accuracy' in u else (u.get('total_correct') or u.get('study_streak') or 0)
                )
            })

        cur_total_correct = current_user.get('total_correct', 0)
        cur_attempted = current_user.get('total_questions_attempted', 0)
        cur_accuracy = (cur_total_correct / cur_attempted * 100) if cur_attempted > 0 else 0
        cur_streak = current_user.get('study_streak', 0)

        if metric == 'accuracy':
            cur_value = cur_accuracy
            higher_count = mongo.db.users.count_documents({
                '$expr': {
                    '$gt': [
                        {
                            '$cond': [
                                { '$gt': ['$total_questions_attempted', 0] },
                                { '$multiply': [ { '$divide': ['$total_correct', '$total_questions_attempted'] }, 100 ] },
                                0
                            ]
                        },
                        cur_value
                    ]
                }
            })
        elif metric == 'study_streak':
            cur_value = cur_streak
            higher_count = mongo.db.users.count_documents({'study_streak': {'$gt': cur_value}})
        else:
            cur_value = cur_total_correct
            higher_count = mongo.db.users.count_documents({'total_correct': {'$gt': cur_value}})

        return jsonify({
            'metric': metric,
            'leaders': leader_list,
            'my_rank': int(higher_count) + 1,
            'my_value': round(cur_value, 2)
        }), 200
