import datetime
from typing import List

def _now():
    return datetime.datetime.utcnow()

def _slug(s: str) -> str:
    return s.lower().replace(' ', '_')

def get_clerical_questions() -> List[dict]:
    topics = [
        ('Alphabetizing', 'Alphabetizing'),
        ('Filing', 'Filing Principles'),
        ('Error Detection', 'Error Detection'),
        ('Table Interpretation', 'Tables'),
        ('Following Instructions', 'Procedural'),
        ('Alphabet Practice', 'Alphabetizing'),
        ('Filing Practice', 'Filing Principles'),
        ('Error Find', 'Error Detection'),
        ('Table Read', 'Tables'),
        ('Procedural II', 'Procedural')
    ]

    modules = []
    for idx, (title, subcat) in enumerate(topics, start=1):
        module_id = f"learn:clerical:{idx}_{_slug(title)}"
        primary = {
            'module_id': module_id,
            'text': f'{title}: Short clerical task styled as CSC item.',
            'options': [
                {'id': 'A', 'text': 'Choice A'},
                {'id': 'B', 'text': 'Choice B'},
                {'id': 'C', 'text': 'Choice C'},
                {'id': 'D', 'text': 'Choice D'},
            ],
            'correct_answer': 'A',
            'category': 'Clerical',
            'subcategory': subcat,
            'difficulty': 'easy',
            'explanation': 'A is the correct clerical operation result.',
            'tags': ['learn_module', 'clerical', module_id],
            'created_at': _now(),
            'learning_metadata': {
                'concept': {
                    'title': f'{title} - Practical Rule',
                    'rule_explanation': 'Apply ordering or inspection principles as described.',
                    'key_points': ['Order alphanumerically', 'Check labels and indices'],
                    'heuristics': ['Scan for anomalies quickly']
                },
                'worked_example': {
                    'problem': 'A brief example of sorting or error detection.',
                    'solution_steps': ['Identify key column', 'Apply ordering', 'Confirm result'],
                    'pattern_recognition_note': 'Tables often hide simple transposition errors.'
                },
                'guided_hint': 'Mark the key field and proceed step by step.',
                'misconception_notes': 'Do not assume visual order equals alphabetical order.',
                'reinforcement_questions': [
                    {
                        'text': f'Reinforcement 1 for {title}: clerical quick.',
                        'options': [
                            {'id': 'A', 'text': 'Yes'},
                            {'id': 'B', 'text': 'No'},
                            {'id': 'C', 'text': 'Maybe'},
                            {'id': 'D', 'text': 'N/A'},
                        ],
                        'correct_answer': 'A',
                        'category': 'Clerical',
                        'subcategory': subcat,
                        'difficulty': 'easy',
                        'explanation': 'Following correct clerical rule yields A.',
                        'tags': ['learn_reinforcement', module_id],
                        'created_at': _now()
                    },
                    {
                        'text': f'Reinforcement 2 for {title}: quick clerical check.',
                        'options': [
                            {'id': 'A', 'text': '1'},
                            {'id': 'B', 'text': '2'},
                            {'id': 'C', 'text': '3'},
                            {'id': 'D', 'text': '4'},
                        ],
                        'correct_answer': 'A',
                        'category': 'Clerical',
                        'subcategory': subcat,
                        'difficulty': 'easy',
                        'explanation': 'Result follows simple ordering.',
                        'tags': ['learn_reinforcement', module_id],
                        'created_at': _now()
                    }
                ]
            }
        }
        modules.append(primary)

    return modules
