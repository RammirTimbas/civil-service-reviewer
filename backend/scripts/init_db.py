import sys
import os
from dotenv import load_dotenv
import pymongo

# Ensure we are looking at the 'backend' folder for imports
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BACKEND_DIR)

# Explicitly load .env from the backend root
load_dotenv(os.path.join(BACKEND_DIR, '.env'))

from app import create_app
from app.extensions import mongo

def init_db():
    app = create_app()
    with app.app_context():
        # Check if URI is loaded
        uri = app.config.get('MONGO_URI')
        if not uri:
            print("❌ Error: MONGO_URI not found in config. Check your .env file.")
            return

        print(f"🔗 Attempting to connect to: {uri.split('@')[-1]}")

        # Fallback logic for mongo.db
        db = mongo.db
        if db is None:
            print("⚠️ mongo.db is None. Manually selecting 'civil_service_db' from connection...")
            # mongo.cx is the underlying MongoClient
            db = mongo.cx['civil_service_db']

        print(f"📂 Target Database: {db.name}")

        try:
            # Users Collection
            db.users.create_index([("email", pymongo.ASCENDING)], unique=True)
            db.users.create_index([("google_id", pymongo.ASCENDING)], sparse=True)

            # Questions Collection
            db.questions.create_index([("category", pymongo.ASCENDING)])
            db.questions.create_index([("difficulty", pymongo.ASCENDING)])
            db.questions.create_index([("tags", pymongo.ASCENDING)])

            # Compound index for common filtering in exam/practice modes
            db.questions.create_index([
                ("category", pymongo.ASCENDING),
                ("difficulty", pymongo.ASCENDING)
            ])

            # Simple index for text search
            db.questions.create_index([("text", pymongo.ASCENDING)])

            # User Progress
            db.user_progress.create_index([
                ("user_id", pymongo.ASCENDING),
                ("question_id", pymongo.ASCENDING)
            ], unique=True)

            # Exam Sessions
            db.exam_sessions.create_index([
                ("user_id", pymongo.ASCENDING),
                ("status", pymongo.ASCENDING)
            ])

            # TTL Index: Auto-cleanup sessions after 30 days
            db.exam_sessions.create_index(
                [("completed_at", pymongo.DESCENDING)],
                expireAfterSeconds=60 * 60 * 24 * 30
            )

            print("✅ Production-grade database indexes initialized successfully.")
        except Exception as e:
            print(f"❌ Database initialization failed: {str(e)}")

if __name__ == "__main__":
    init_db()
