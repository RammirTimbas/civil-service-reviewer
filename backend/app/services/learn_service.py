from app.extensions import mongo
from bson.objectid import ObjectId

class LearnService:
    @staticmethod
    def get_learn_session(category=None, subcategory=None):
        query = {"learning_metadata": {"$exists": True}}
        if category:
            query["category"] = category
        # `get_available_topics` maps missing/null subcategory to the display
        # name "General". If the frontend sends "General", interpret this
        # as documents where `subcategory` is missing or null instead of the
        # literal string "General".
        if subcategory:
            if subcategory == "General":
                query["$or"] = [{"subcategory": {"$exists": False}}, {"subcategory": None}]
            else:
                query["subcategory"] = subcategory

        # Get a random question with learning metadata matching the criteria
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

    @staticmethod
    def get_available_topics(category=None):
        """Returns a list of subcategories that have learning modules."""
        query = {"learning_metadata": {"$exists": True}}
        if category:
            query["category"] = category

        pipeline = [
            {"$match": query},
            {"$group": {
                "_id": "$subcategory",
                "count": {"$sum": 1},
                "titles": {"$addToSet": "$learning_metadata.concept.title"}
            }},
            {"$project": {
                "name": {"$ifNull": ["$_id", "General"]},
                "count": 1,
                "display_title": {"$arrayElemAt": ["$titles", 0]},
                "_id": 0
            }}
        ]
        return list(mongo.db.questions.aggregate(pipeline))
