import sys
import os
import datetime
from pprint import pprint

# Ensure backend root on path so `app` package is importable
# Add parent directory of scripts (the backend folder)
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load environment variables early so config picks them up
try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    # dotenv is optional in some environments
    pass

print('Debug: MONGO_URI present in environment:', bool(os.environ.get('MONGO_URI')))

from app import create_app
from app.extensions import mongo

from learn_modules import get_all_categories


def now():
    return datetime.datetime.utcnow()


def insert_learn_modules(modules, category_name):
    inserted = 0
    skipped = 0
    for module in modules:
        module_id = module.get('module_id')
        if not module_id:
            print('Skipping module without module_id')
            skipped += 1
            continue

        # duplicate check: look for module_id in tags or module_id field
        exists = mongo.db.questions.find_one({'$or': [{'module_id': module_id}, {'tags': module_id}]})
        if exists:
            skipped += 1
            continue

        # Insert reinforcement questions first and capture their IDs
        reinforcement = module.get('learning_metadata', {}).get('reinforcement_questions', [])
        reinforcement_ids = []
        for r in reinforcement:
            r_doc = r.copy()
            r_doc['origin'] = 'learn_reinforcement'
            r_doc['module_id'] = module_id
            r_doc['created_at'] = r_doc.get('created_at', now())
            res = mongo.db.questions.insert_one(r_doc)
            reinforcement_ids.append(str(res.inserted_id))

        # Prepare primary question
        primary = {k: v for k, v in module.items() if k != 'learning_metadata'}
        primary.update(module.get('learning_metadata', {}))
        # ensure learning_metadata.reinforcement_question_ids present
        primary_learning = module.get('learning_metadata', {})
        primary_learning['reinforcement_question_ids'] = reinforcement_ids
        # Attach module fields
        primary['learning_metadata'] = primary_learning
        primary['origin'] = 'learn_primary'
        primary['module_id'] = module_id
        # ensure created_at
        primary['created_at'] = primary.get('created_at', now())
        # ensure tags include module_id and learn_module
        tags = list(primary.get('tags', []))
        if module_id not in tags:
            tags.append(module_id)
        if 'learn_module' not in tags:
            tags.append('learn_module')
        primary['tags'] = tags

        mongo.db.questions.insert_one(primary)
        inserted += 1

    return inserted, skipped


def main():
    app = create_app()
    with app.app_context():
        # Quick DB connectivity check so failures are clear to the operator
        try:
            # ping the server
            mongo.db.command('ping')
        except Exception as exc:
            print('\n❌ Cannot connect to MongoDB. Details:')
            print(str(exc))
            print('\nPossible fixes:')
            print('- Start a local mongod instance: `mongod --dbpath C:\\data\\db`')
            print('- If you installed MongoDB as a Windows service: `net start MongoDB`')
            print('- Or point the app to your Atlas cluster by setting the MONGO_URI environment variable')
            print('\nAfter addressing the DB connection, re-run:')
            print('  cd backend')
            print('  python scripts/seed_learn_data.py')
            import sys
            sys.exit(1)

        print('🔁 Loading Learn Mode category modules...')
        categories = get_all_categories()
        total_inserted = 0
        total_skipped = 0
        per_category_summary = {}

        for cat_name, getter in categories.items():
            print(f'• Processing category: {cat_name}')
            modules = getter()
            inserted, skipped = insert_learn_modules(modules, cat_name)
            per_category_summary[cat_name] = {'inserted': inserted, 'skipped': skipped, 'total_modules': len(modules)}
            total_inserted += inserted
            total_skipped += skipped

        print('\n=== Learn Mode Seeding Summary ===')
        for k, v in per_category_summary.items():
            print(f"✅ {k.capitalize()}: {v['inserted']} modules seeded (skipped {v['skipped']})")
        print(f"\nTotal Learn Modules Inserted: {total_inserted}")
        print(f"Total Skipped (duplicates or errors): {total_skipped}")


if __name__ == '__main__':
    main()
