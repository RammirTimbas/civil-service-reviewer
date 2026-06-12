import sys
import os
from dotenv import load_dotenv

# Add the parent directory (backend) to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load environment variables from .env
load_dotenv()

from app import create_app
from app.extensions import mongo
import datetime

questions = [
    # VERBAL ABILITY
    {
        "text": "Choose the word that is most nearly opposite in meaning to the word in capital letters: PRODIGAL",
        "options": [
            {"id": "A", "text": "Thrifty"},
            {"id": "B", "text": "Generous"},
            {"id": "C", "text": "Wasteful"},
            {"id": "D", "text": "Wealthy"}
        ],
        "correct_answer": "A",
        "category": "Verbal Ability",
        "subcategory": "Vocabulary",
        "difficulty": "medium",
        "hint": "Think about how someone manages their resources or money.",
        "explanation": "Prodigal means spending money or resources freely and recklessly; wastefully extravagant. The opposite is thrifty, which means using money and other resources carefully and not wastefully.",
        "wrong_answer_explanations": {
            "A": "Correct! Thrifty is the opposite of prodigal.",
            "B": "Incorrect. Generous is a synonym for one aspect of prodigal (giving freely), not an opposite.",
            "C": "Incorrect. Wasteful is a synonym for prodigal.",
            "D": "Incorrect. Wealthy refers to having a lot of money, not how one spends it."
        },
        "tags": ["vocabulary", "antonyms"],
        "source": "csc-inspired",
        "version": 1,
        "created_at": datetime.datetime.utcnow()
    },
    {
        "text": "Identify the error in the following sentence: 'The criteria for the selection of the winner was very strict.'",
        "options": [
            {"id": "A", "text": "criteria"},
            {"id": "B", "text": "for the selection"},
            {"id": "C", "text": "was"},
            {"id": "D", "text": "No error"}
        ],
        "correct_answer": "C",
        "category": "Verbal Ability",
        "subcategory": "Grammar",
        "difficulty": "medium",
        "hint": "'Criteria' is the plural form of 'criterion'.",
        "explanation": "The subject 'criteria' is plural, so it requires the plural verb 'were' instead of 'was'.",
        "wrong_answer_explanations": {
            "A": "Incorrect. 'Criteria' is used correctly as the subject.",
            "B": "Incorrect. This prepositional phrase is correct.",
            "C": "Correct! 'Was' should be 'were' because 'criteria' is plural.",
            "D": "Incorrect. There is a subject-verb agreement error."
        },
        "tags": ["grammar", "subject-verb agreement"],
        "source": "csc-inspired",
        "version": 1,
        "created_at": datetime.datetime.utcnow()
    },
    # NUMERICAL REASONING
    {
        "text": "What is 25% of 1,200?",
        "options": [
            {"id": "A", "text": "250"},
            {"id": "B", "text": "300"},
            {"id": "C", "text": "350"},
            {"id": "D", "text": "400"}
        ],
        "correct_answer": "B",
        "category": "Numerical Reasoning",
        "subcategory": "Percentage",
        "difficulty": "easy",
        "hint": "25% is equivalent to one-fourth (1/4).",
        "explanation": "To find 25% of 1,200, you can multiply 1,200 by 0.25 or divide 1,200 by 4. 1,200 / 4 = 300.",
        "wrong_answer_explanations": {
            "A": "Incorrect. 250 is approximately 20.8% of 1,200.",
            "B": "Correct! 1,200 divided by 4 is 300.",
            "C": "Incorrect. 350 is approximately 29.1% of 1,200.",
            "D": "Incorrect. 400 is 33.3% of 1,200."
        },
        "tags": ["math", "percentage"],
        "source": "csc-inspired",
        "version": 1,
        "created_at": datetime.datetime.utcnow()
    },
    {
        "text": "A train travels 180 km in 3 hours. At the same average speed, how many kilometers will it travel in 5 hours?",
        "options": [
            {"id": "A", "text": "240 km"},
            {"id": "B", "text": "270 km"},
            {"id": "C", "text": "300 km"},
            {"id": "D", "text": "330 km"}
        ],
        "correct_answer": "C",
        "category": "Numerical Reasoning",
        "subcategory": "Ratio and Proportion",
        "difficulty": "medium",
        "hint": "First, find the speed of the train in km/h.",
        "explanation": "Speed = Distance / Time = 180 km / 3 hours = 60 km/h. In 5 hours, Distance = Speed * Time = 60 km/h * 5 hours = 300 km.",
        "wrong_answer_explanations": {
            "A": "Incorrect. 240 km would mean a speed of 48 km/h.",
            "B": "Incorrect. 270 km would mean a speed of 54 km/h.",
            "C": "Correct! The train travels at 60 km/h, so 60 * 5 = 300 km.",
            "D": "Incorrect. 330 km would mean a speed of 66 km/h."
        },
        "tags": ["math", "word problems", "speed"],
        "source": "csc-inspired",
        "version": 1,
        "created_at": datetime.datetime.utcnow()
    },
    # ANALYTICAL ABILITY
    {
        "text": "If all Filipino citizens are hardworking and Maria is a Filipino citizen, then Maria is hardworking. This is an example of:",
        "options": [
            {"id": "A", "text": "Inductive Reasoning"},
            {"id": "B", "text": "Deductive Reasoning"},
            {"id": "C", "text": "Faulty Logic"},
            {"id": "D", "text": "Circular Reasoning"}
        ],
        "correct_answer": "B",
        "category": "Analytical Ability",
        "subcategory": "Logic",
        "difficulty": "easy",
        "hint": "Think about whether the conclusion follows from a general premise to a specific case.",
        "explanation": "Deductive reasoning starts with a general statement (all Filipino citizens are hardworking) and applies it to a specific case (Maria is a Filipino citizen) to reach a specific conclusion (Maria is hardworking).",
        "wrong_answer_explanations": {
            "A": "Incorrect. Inductive reasoning moves from specific observations to general conclusions.",
            "B": "Correct! This is a classic syllogism, a form of deductive reasoning.",
            "C": "Incorrect. The logic is valid based on the premises provided.",
            "D": "Incorrect. Circular reasoning is when the conclusion is among the premises."
        },
        "tags": ["logic", "reasoning"],
        "source": "csc-inspired",
        "version": 1,
        "created_at": datetime.datetime.utcnow()
    },
    {
        "text": "Complete the sequence: 2, 6, 12, 20, 30, ___",
        "options": [
            {"id": "A", "text": "38"},
            {"id": "B", "text": "40"},
            {"id": "C", "text": "42"},
            {"id": "D", "text": "44"}
        ],
        "correct_answer": "C",
        "category": "Analytical Ability",
        "subcategory": "Number Series",
        "difficulty": "medium",
        "hint": "Look at the difference between consecutive numbers.",
        "explanation": "The differences are: 6-2=4, 12-6=6, 20-12=8, 30-20=10. The difference is increasing by 2 each time. The next difference should be 12. 30 + 12 = 42.",
        "wrong_answer_explanations": {
            "A": "Incorrect. Check the pattern of differences again.",
            "B": "Incorrect. The difference increases by 2 each time (4, 6, 8, 10, ...).",
            "C": "Correct! 30 + 12 = 42.",
            "D": "Incorrect. 44 would mean the difference was 14."
        },
        "tags": ["logic", "series"],
        "source": "csc-inspired",
        "version": 1,
        "created_at": datetime.datetime.utcnow()
    },
    # CLERICAL OPERATIONS
    {
        "text": "Which of the following names should come first if they are arranged in alphabetical order?",
        "options": [
            {"id": "A", "text": "De la Cruz, Juan"},
            {"id": "B", "text": "De Lara, Jose"},
            {"id": "C", "text": "Del Rosario, Maria"},
            {"id": "D", "text": "Dela Cuesta, Ana"}
        ],
        "correct_answer": "A",
        "category": "Clerical Operations",
        "subcategory": "Alphabetizing",
        "difficulty": "medium",
        "hint": "Alphabetize word by word, and remember 'nothing comes before something' (space before letters).",
        "explanation": "In standard filing rules: Space comes before any letter. 1. De la Cruz (D-e-[space]-l-a-C...), 2. De Lara (D-e-[space]-l-a-L...), 3. Del Rosario (D-e-l-[space]...), 4. Dela Cuesta (D-e-l-a...). Comparing 'De ' and 'Del', the space in 'De ' makes it come first. Between the two 'De ' entries, 'la Cruz' comes before 'Lara'.",
        "wrong_answer_explanations": {
            "A": "Correct! 'De la Cruz' comes first because space precedes letters, and 'C' comes before 'L'.",
            "B": "Incorrect. 'De la Cruz' comes before 'De Lara'.",
            "C": "Incorrect. 'Del' comes after entries starting with 'De ' (space).",
            "D": "Incorrect. 'Dela' (one word) comes after 'Del ' (space)."
        },
        "tags": ["clerical", "filing"],
        "source": "csc-inspired",
        "version": 1,
        "created_at": datetime.datetime.utcnow()
    },
    # GENERAL INFORMATION
    {
        "text": "According to the 1987 Constitution, the legislative power shall be vested in the ___________, which shall consist of a Senate and a House of Representatives.",
        "options": [
            {"id": "A", "text": "President of the Philippines"},
            {"id": "B", "text": "Supreme Court"},
            {"id": "C", "text": "Congress of the Philippines"},
            {"id": "D", "text": "Department of Justice"}
        ],
        "correct_answer": "C",
        "category": "General Information",
        "subcategory": "Philippine Constitution",
        "difficulty": "easy",
        "hint": "This body is composed of two chambers: the Senate and the House.",
        "explanation": "Article VI, Section 1 of the 1987 Constitution states: 'The legislative power shall be vested in the Congress of the Philippines which shall consist of a Senate and a House of Representatives...'",
        "wrong_answer_explanations": {
            "A": "Incorrect. The President holds executive power.",
            "B": "Incorrect. The Supreme Court holds judicial power.",
            "C": "Correct! Congress is the legislative branch of the Philippine government.",
            "D": "Incorrect. The DOJ is part of the executive branch."
        },
        "tags": ["constitution", "government"],
        "source": "csc-inspired",
        "version": 1,
        "created_at": datetime.datetime.utcnow()
    },
    {
        "text": "Republic Act No. 6713 is also known as the:",
        "options": [
            {"id": "A", "text": "Anti-Graft and Corrupt Practices Act"},
            {"id": "B", "text": "Code of Conduct and Ethical Standards for Public Officials and Employees"},
            {"id": "C", "text": "Local Government Code"},
            {"id": "D", "text": "Civil Service Reform Act"}
        ],
        "correct_answer": "B",
        "category": "General Information",
        "subcategory": "Code of Conduct",
        "difficulty": "medium",
        "hint": "This law establishes the norms of conduct for public servants in the Philippines.",
        "explanation": "RA 6713 is the Code of Conduct and Ethical Standards for Public Officials and Employees, which outlines eight norms of conduct, including commitment to public interest, professionalism, and justness and sincerity.",
        "wrong_answer_explanations": {
            "A": "Incorrect. Anti-Graft and Corrupt Practices Act is RA 3019.",
            "B": "Correct! RA 6713 sets the ethical standards for public service.",
            "C": "Incorrect. The Local Government Code is RA 7160.",
            "D": "Incorrect. RA 6713 specifically addresses ethical standards and conduct."
        },
        "tags": ["RA 6713", "ethics", "public service"],
        "source": "csc-inspired",
        "version": 1,
        "created_at": datetime.datetime.utcnow()
    }
]

def seed_db():
    app = create_app()
    with app.app_context():
        # Clear existing questions
        mongo.db.questions.delete_many({})
        # Insert new ones
        result = mongo.db.questions.insert_many(questions)
        print(f"Inserted {len(result.inserted_ids)} questions across {len(set(q['category'] for q in questions))} categories.")

if __name__ == "__main__":
    seed_db()
