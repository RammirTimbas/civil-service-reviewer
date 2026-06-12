from flask import Blueprint, request, jsonify
from app.extensions import mongo
from app.models.question import QuestionSchema
from app.services.question_service import QuestionService
from bson.objectid import ObjectId
import datetime

questions_bp = Blueprint('questions', __name__)
question_schema = QuestionSchema()

@questions_bp.route('/', methods=['GET'])
def get_questions():
    category = request.args.get('category')
    difficulty = request.args.get('difficulty')
    limit = int(request.args.get('limit', 20))
    skip = int(request.args.get('skip', 0))

    filters = {}
    if category:
        filters['category'] = category
    if difficulty:
        filters['difficulty'] = difficulty

    questions = QuestionService.get_questions(filters, limit, skip)
    return jsonify(questions), 200

@questions_bp.route('/mock', methods=['GET'])
def get_mock_exam():
    questions = QuestionService.get_mock_exam_questions()
    return jsonify(questions), 200

@questions_bp.route('/<id>', methods=['GET'])
def get_question(id):
    question = QuestionService.get_question_by_id(id)
    if question:
        return jsonify(question), 200
    return jsonify({'error': 'Question not found'}), 404

@questions_bp.route('/', methods=['POST'])
def create_question():
    # Admin check should be here (middleware)
    data = request.get_json()
    errors = question_schema.validate(data)
    if errors:
        return jsonify(errors), 400

    question_id = QuestionService.create_question(data)
    return jsonify({'id': question_id}), 201
