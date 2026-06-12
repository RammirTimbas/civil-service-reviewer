from app.extensions import mongo
from bson.objectid import ObjectId
import datetime
import random

class QuestionService:
    @staticmethod
    def get_questions(filters=None, limit=20, skip=0):
        query = {}
        if filters:
            if 'category' in filters:
                query['category'] = filters['category']
            if 'difficulty' in filters:
                query['difficulty'] = filters['difficulty']
            if 'tags' in filters:
                query['tags'] = {'$in': filters['tags']}

        cursor = mongo.db.questions.find(query).skip(skip).limit(limit)
        questions = []
        for q in cursor:
            q['id'] = str(q['_id'])
            del q['_id']
            questions.append(q)
        return questions

    @staticmethod
    def get_mock_exam_questions():
        # CSC pattern typically involves specific distributions
        # For this MVP, we'll take a balanced random sample
        categories = [
            'Verbal Ability', 'Numerical Reasoning', 'Analytical Ability',
            'Clerical Operations', 'General Information'
        ]

        exam_questions = []
        for cat in categories:
            # Get 10 questions per category (example)
            cursor = mongo.db.questions.aggregate([
                {'$match': {'category': cat}},
                {'$sample': {'size': 10}}
            ])
            for q in cursor:
                q['id'] = str(q['_id'])
                del q['_id']
                exam_questions.append(q)

        random.shuffle(exam_questions)
        return exam_questions

    @staticmethod
    def get_question_by_id(question_id):
        question = mongo.db.questions.find_one({'_id': ObjectId(question_id)})
        if question:
            question['id'] = str(question['_id'])
            del question['_id']
            return question
        return None

    @staticmethod
    def create_question(data):
        data['created_at'] = datetime.datetime.utcnow()
        data['updated_at'] = datetime.datetime.utcnow()
        result = mongo.db.questions.insert_one(data)
        return str(result.inserted_id)
