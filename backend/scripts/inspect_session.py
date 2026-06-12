import sys
import os

# add backend package path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from app.extensions import mongo
from bson.objectid import ObjectId
from bson import json_util

def main():
    if len(sys.argv) < 2:
        print('Usage: python inspect_session.py <session_id>')
        sys.exit(1)
    session_id = sys.argv[1]
    app = create_app()
    with app.app_context():
        try:
            sess = mongo.db.exam_sessions.find_one({'_id': ObjectId(session_id)})
            if not sess:
                print(f'No session found with id {session_id}')
                return
            print(json_util.dumps(sess, indent=2))
        except Exception as e:
            print('Error inspecting session:', e)

if __name__ == '__main__':
    main()
