from app.extensions import mongo
from bson.objectid import ObjectId

class LearnService:
    @staticmethod
    def get_learn_session(category=None):
        query = {"learning_metadata": {"$exists": True}}
        if category:
            query["category"] = category

        # Get a random question with learning metadata
        pipeline = [
            {"$match": query},
            {"$sample": {"size": 1}}
        ]
        cursor = mongo.db.questions.aggregate(pipeline)
        primary = next(cursor, None)

        if not primary:
            return None

        primary['id'] = str(primary['_id'])
        del primary['_id']

        # Fetch reinforcement questions
        reinforcement_ids = primary.get('learning_metadata', {}).get('reinforcement_question_ids', [])
        reinforcements = []
        if reinforcement_ids:
            obj_ids = []
            for rid in reinforcement_ids:
                try:
                    obj_ids.append(ObjectId(rid))
                except:
                    # In case they are stored as strings or don't exist
                    pass

            if obj_ids:
                ref_cursor = mongo.db.questions.find({"_id": {"$in": obj_ids}})
                for q in ref_cursor:
                    q['id'] = str(q['_id'])
                    del q['_id']
                    reinforcements.append(q)

        return {
            "primary_question": primary,
            "reinforcement_questions": reinforcements
        }
