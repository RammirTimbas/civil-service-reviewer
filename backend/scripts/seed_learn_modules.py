import sys
import os
from dotenv import load_dotenv
from bson.objectid import ObjectId
import datetime

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv()

from app import create_app
from app.extensions import mongo

def seed_learn_data():
    app = create_app()
    with app.app_context():
        print("🧹 Preserving existing questions; adding learn-module questions (no delete).")
        # NOTE: don't delete the entire questions collection here — the mock exam
        # and other features rely on a broader seeded question set. This script
        # should only insert learning-module-specific questions to avoid
        # breaking the exam sampling logic.

        # 1. Create Reinforcement Questions first to get their IDs
        reinforcement_ids = []

        q_ref1 = {
            "text": "SCALPEL : SURGEON :: ______ : ______",
            "options": [
                {"id": "A", "text": "Hammer : Carpenter"},
                {"id": "B", "text": "Patient : Hospital"},
                {"id": "C", "text": "Blueprint : Architect"},
                {"id": "D", "text": "Uniform : Police"}
            ],
            "correct_answer": "A",
            "category": "Verbal Ability",
            "difficulty": "medium",
            "explanation": "A scalpel is the primary tool used by a surgeon, just as a hammer is the primary tool of a carpenter.",
            "tags": ["analogies", "reinforcement"],
            "created_at": datetime.datetime.utcnow()
        }

        q_ref2 = {
            "text": "TROWEL : GARDENER :: ______ : ______",
            "options": [
                {"id": "A", "text": "Books : Librarian"},
                {"id": "B", "text": "Whistle : Referee"},
                {"id": "C", "text": "Plants : Soil"},
                {"id": "D", "text": "Court : Lawyer"}
            ],
            "correct_answer": "B",
            "category": "Verbal Ability",
            "difficulty": "medium",
            "explanation": "A gardener uses a trowel to perform their work; a referee uses a whistle to perform their work.",
            "tags": ["analogies", "reinforcement"],
            "created_at": datetime.datetime.utcnow()
        }

        res1 = mongo.db.questions.insert_one(q_ref1)
        res2 = mongo.db.questions.insert_one(q_ref2)
        reinforcement_ids = [str(res1.inserted_id), str(res2.inserted_id)]

        # 2. Create the Primary Instructional Question
        primary_q = {
            "text": "GAVEL : JUDGE :: ______ : ______",
            "options": [
                {"id": "A", "text": "Baton : Conductor"},
                {"id": "B", "text": "Classroom : Teacher"},
                {"id": "C", "text": "Handcuffs : Crime"},
                {"id": "D", "text": "Scale : Weight"}
            ],
            "correct_answer": "A",
            "category": "Verbal Ability",
            "difficulty": "medium",
            "explanation": "A gavel is a tool used by a judge to maintain order or signal a decision. Similarly, a baton is used by a conductor to direct an orchestra.",
            "tags": ["analogies", "instructional"],
            "learning_metadata": {
                "concept": {
                    "title": "Verbal Analogies: Functional Relationships",
                    "rule_explanation": "In functional analogies, identify the 'User' and their primary 'Professional Tool'.",
                    "key_points": [
                        "The relationship is Tool-to-User.",
                        "The tool must be essential to the profession, not just a general object.",
                        "Check the order: if it is Tool:User, the answer must also be Tool:User."
                    ],
                    "heuristics": [
                        "CSC often uses traditional professions (Judges, Teachers, Doctors).",
                        "Avoid options that describe a 'Location' (e.g., Teacher : School)."
                    ]
                },
                "worked_example": {
                    "problem": "STETHOSCOPE : DOCTOR",
                    "solution_steps": [
                        "Step 1: Identify that a Stethoscope is a tool used exclusively by a Doctor.",
                        "Step 2: Create a functional bridge: 'A Doctor uses a Stethoscope.'",
                        "Step 3: Look for a similar essential tool used by a specific professional.",
                        "Step 4: Answer would be something like 'BRUSH : PAINTER'."
                    ],
                    "pattern_recognition_note": "Look for the 'Symbol of Authority' pattern."
                },
                "guided_hint": "A Judge uses a Gavel to exercise authority. Which other professional uses their tool to direct or control?",
                "misconception_notes": "Do not select 'Classroom : Teacher' because a classroom is a place, not a tool.",
                "reinforcement_question_ids": reinforcement_ids
            },
            "created_at": datetime.datetime.utcnow()
        }

        mongo.db.questions.insert_one(primary_q)
        print(f"✅ Successfully seeded Learn Module with {len(reinforcement_ids)} reinforcement questions.")

if __name__ == "__main__":
    seed_learn_data()
