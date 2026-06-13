from flask import Blueprint, request, jsonify
from app.middleware.auth import token_required
from app.extensions import mongo
from app.models.session import ExamSessionSchema
from bson.objectid import ObjectId
import datetime
import random

exams_bp = Blueprint('exams', __name__)
session_schema = ExamSessionSchema()

@exams_bp.route('/start', methods=['POST'])
@token_required
def start_exam(current_user):
    data = request.get_json()
    exam_type = data.get('type', 'Mock')

    active_session = mongo.db.exam_sessions.find_one({
        'user_id': str(current_user['_id']),
        'status': 'active'
    })

    if active_session:
        # If an active session already exists for this user, return its session_id
        # and the questions so the client can resume the existing session.
        stored_qids = active_session.get('questions', []) or []
        questions = []
        if stored_qids:
            try:
                question_ids = [ObjectId(qid) for qid in stored_qids]
                questions = list(mongo.db.questions.find({'_id': {'$in': question_ids}}))
            except Exception:
                questions = []

        # If the active session exists but has no valid questions (e.g., questions were deleted),
        # remove the stale session and let the flow continue to create a fresh one below.
        if not questions:
            mongo.db.exam_sessions.delete_one({'_id': active_session['_id']})
        else:
            return jsonify({
                'message': 'Active session exists',
                'session_id': str(active_session['_id']),
                'questions': [{**q, 'id': str(q['_id']), '_id': None} for q in questions]
            }), 200

    category = data.get('category')
    query = {}
    if category:
        query['category'] = category

    questions = list(mongo.db.questions.aggregate([
        {'$match': query},
        {'$sample': {'size': 20}}
    ]))

    if not questions:
        return jsonify({'error': 'No questions found for this criteria'}), 404

    question_ids = [str(q['_id']) for q in questions]

    session_data = {
        'user_id': str(current_user['_id']),
        'type': exam_type,
        'status': 'active',
        'category': category,
        'questions': question_ids,
        'answers': {},
        'created_at': datetime.datetime.utcnow()
    }

    result = mongo.db.exam_sessions.insert_one(session_data)

    return jsonify({
        'session_id': str(result.inserted_id),
        'questions': [{**q, 'id': str(q['_id']), '_id': None} for q in questions]
    }), 201

@exams_bp.route('/submit/<session_id>', methods=['POST'])
@token_required
def submit_exam(current_user, session_id):
    data = request.get_json()
    user_answers = data.get('answers', {}) # question_id -> optionId ("A", "B", etc.)

    session = mongo.db.exam_sessions.find_one({
        '_id': ObjectId(session_id),
        'user_id': str(current_user['_id']),
        'status': 'active'
    })

    if not session:
        return jsonify({'error': 'Active session not found'}), 404

    question_ids = [ObjectId(qid) for qid in session['questions']]
    questions = list(mongo.db.questions.find({'_id': {'$in': question_ids}}))

    score = 0
    for q in questions:
        qid_str = str(q['_id'])
        selected_option_id = user_answers.get(qid_str)
        # Standardized string comparison for IDs
        if selected_option_id == q['correct_answer']:
            score += 1

    now = datetime.datetime.utcnow()
    mongo.db.exam_sessions.update_one(
        {'_id': ObjectId(session_id)},
        {
            '$set': {
                'status': 'completed',
                'score': score,
                'total_questions': len(questions),
                'answers': user_answers,
                'duration_seconds': data.get('duration_seconds', 0),
                'completed_at': now
            }
        }
    )

    mongo.db.users.update_one(
        {'_id': current_user['_id']},
        {
            '$inc': {
                'total_exams_completed': 1,
                'total_correct_answers': score,
                'total_questions_answered': len(questions)
            },
            '$set': {'last_active': now}
        }
    )

    return jsonify({
        'score': score,
        'total': len(questions)
    }), 200


@exams_bp.route('/submit', methods=['POST'])
@token_required
def submit_exam_body(current_user):
    # Accept session_id in JSON body for clients that post to /api/exams/submit
    data = request.get_json() or {}
    session_id = data.get('session_id')
    # If no session_id provided, attempt to find the active session for this user
    if not session_id:
        active_session = mongo.db.exam_sessions.find_one({
            'user_id': str(current_user['_id']),
            'status': 'active'
        })
        if not active_session:
            return jsonify({'error': 'session_id is required in request body and no active session found'}), 400
        session_id = str(active_session['_id'])

    # Reuse the same logic as submit_exam
    user_answers = data.get('answers', {})

    session = mongo.db.exam_sessions.find_one({
        '_id': ObjectId(session_id),
        'user_id': str(current_user['_id']),
        'status': 'active'
    })

    if not session:
        return jsonify({'error': 'Active session not found'}), 404

    question_ids = [ObjectId(qid) for qid in session['questions']]
    questions = list(mongo.db.questions.find({'_id': {'$in': question_ids}}))

    score = 0
    for q in questions:
        qid_str = str(q['_id'])
        selected_option_id = user_answers.get(qid_str)
        if selected_option_id == q['correct_answer']:
            score += 1

    now = datetime.datetime.utcnow()
    mongo.db.exam_sessions.update_one(
        {'_id': ObjectId(session_id)},
        {
            '$set': {
                'status': 'completed',
                'score': score,
                'total_questions': len(questions),
                'answers': user_answers,
                'duration_seconds': data.get('duration_seconds', 0),
                'completed_at': now
            }
        }
    )

    mongo.db.users.update_one(
        {'_id': current_user['_id']},
        {
            '$inc': {
                'total_exams_completed': 1,
                'total_correct_answers': score,
                'total_questions_answered': len(questions)
            },
            '$set': {'last_active': now}
        }
    )

    return jsonify({
        'score': score,
        'total': len(questions)
    }), 200
