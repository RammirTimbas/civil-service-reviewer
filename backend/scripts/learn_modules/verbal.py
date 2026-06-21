import datetime
from typing import List

def _now():
    return datetime.datetime.utcnow()

def _slug(s: str) -> str:
    return s.lower().replace(' ', '_').replace('&', 'and')

def get_verbal_questions() -> List[dict]:
    """Generate 10 verbal learn modules programmatically.
    Each module contains one primary guided question and two reinforcement questions.
    """
    topics = [
        ('Analogies', 'Analogies'),
        ('Grammar', 'Grammar Usage'),
        ('Vocabulary', 'Vocabulary in Context'),
        ('Reading Comprehension', 'Short Passage RC'),
        ('Sentence Completion', 'Sentence Completion'),
        ('Analogies (Practice)', 'Analogies'),
        ('Grammar (Agreement)', 'Subject-Verb Agreement'),
        ('Vocabulary (Synonyms)', 'Synonyms'),
        ('Reading (Inference)', 'Inference'),
        ('Sentence (Context Clues)', 'Context Clues')
    ]

    modules = []
    for idx, (title, subcat) in enumerate(topics, start=1):
        module_id = f"learn:verbal:{idx}_{_slug(title)}"
        primary = {
            'module_id': module_id,
            'text': f"{title}: Identify the best CSC-style answer.",
            'options': [
                {'id': 'A', 'text': 'Option A'},
                {'id': 'B', 'text': 'Option B'},
                {'id': 'C', 'text': 'Option C'},
                {'id': 'D', 'text': 'Option D'},
            ],
            'correct_answer': 'A',
            'category': 'Verbal',
            'subcategory': subcat,
            'difficulty': 'medium',
            'explanation': f'The best choice is A because it follows the intended {subcat} rule.',
            'tags': ['learn_module', 'verbal', module_id],
            'created_at': _now(),
            'learning_metadata': {
                'concept': {
                    'title': f'{title} - Core Rule',
                    'rule_explanation': f'A concise rule for {title.lower()}.',
                    'key_points': [
                        'Identify relation or grammatical role.',
                        'Eliminate distractors that mismatch function.',
                        'Prefer professional or precise wording in CSC items.'
                    ],
                    'heuristics': [
                        'Map tool-to-user for analogies.',
                        'For vocabulary, check register and collocation.'
                    ]
                },
                'worked_example': {
                    'problem': f'Example problem demonstrating {title.lower()}.',
                    'solution_steps': [
                        'Read carefully and identify role.',
                        'Match semantic function between stems and options.',
                        'Select the most precise answer.'
                    ],
                    'pattern_recognition_note': 'Look for functionally parallel pairs.'
                },
                'guided_hint': 'Think of the relationship or grammatical function first.',
                'misconception_notes': 'Avoid selecting choices that are related but not parallel in function.',
                'reinforcement_questions': [
                    {
                        'text': f'Reinforcement 1 for {title}: choose best option.',
                        'options': [
                            {'id': 'A', 'text': 'A1'},
                            {'id': 'B', 'text': 'B1'},
                            {'id': 'C', 'text': 'C1'},
                            {'id': 'D', 'text': 'D1'},
                        ],
                        'correct_answer': 'A',
                        'category': 'Verbal',
                        'subcategory': subcat,
                        'difficulty': 'easy',
                        'explanation': 'A1 is the precise parallel.',
                        'tags': ['learn_reinforcement', module_id],
                        'created_at': _now(),
                    },
                    {
                        'text': f'Reinforcement 2 for {title}: short practice.',
                        'options': [
                            {'id': 'A', 'text': 'X'},
                            {'id': 'B', 'text': 'Y'},
                            {'id': 'C', 'text': 'Z'},
                            {'id': 'D', 'text': 'W'},
                        ],
                        'correct_answer': 'A',
                        'category': 'Verbal',
                        'subcategory': subcat,
                        'difficulty': 'easy',
                        'explanation': 'X matches the stem.',
                        'tags': ['learn_reinforcement', module_id],
                        'created_at': _now(),
                    }
                ]
            }
        }
        modules.append(primary)

    return modules
