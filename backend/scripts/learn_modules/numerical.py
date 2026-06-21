import datetime
from typing import List

def _now():
    return datetime.datetime.utcnow()

def _slug(s: str) -> str:
    return s.lower().replace(' ', '_')

def get_numerical_questions() -> List[dict]:
    topics = [
        ('Percentages', 'Percentages'),
        ('Fractions', 'Fractions'),
        ('Ratios', 'Ratios'),
        ('Word Problems', 'Word Problems'),
        ('Time & Work', 'Time and Work'),
        ('Basic Algebra', 'Algebra'),
        ('Sequences', 'Sequences'),
        ('Percent Practice', 'Percentages'),
        ('Fractions Practice', 'Fractions'),
        ('Ratios Practice', 'Ratios')
    ]

    modules = []
    for idx, (title, subcat) in enumerate(topics, start=1):
        module_id = f"learn:numerical:{idx}_{_slug(title)}"
        primary = {
            'module_id': module_id,
            'text': f'{title}: Compute the CSC-style answer succinctly.',
            'options': [
                {'id': 'A', 'text': 'Option A'},
                {'id': 'B', 'text': 'Option B'},
                {'id': 'C', 'text': 'Option C'},
                {'id': 'D', 'text': 'Option D'},
            ],
            'correct_answer': 'A',
            'category': 'Numerical',
            'subcategory': subcat,
            'difficulty': 'medium',
            'explanation': 'Work through percentage/fraction operations; A matches.',
            'tags': ['learn_module', 'numerical', module_id],
            'created_at': _now(),
            'learning_metadata': {
                'concept': {
                    'title': f'{title} - Method',
                    'rule_explanation': 'A short algorithmic rule for solving the class of problems.',
                    'key_points': ['Set up equivalence, simplify, compute accurately.'],
                    'heuristics': ['Estimate to eliminate unlikely choices.']
                },
                'worked_example': {
                    'problem': 'A short worked numeric example illustrating the method.',
                    'solution_steps': ['Translate words to equation', 'Simplify', 'Compute result and match option'],
                    'pattern_recognition_note': 'Recognize common templates like percent-of and ratio splits.'
                },
                'guided_hint': 'Write the equation and do a quick estimate to narrow options.',
                'misconception_notes': 'Watch out for unit mismatches and inverted ratios.',
                'reinforcement_questions': [
                    {
                        'text': f'Reinforcement 1 for {title}: quick numeric.',
                        'options': [
                            {'id': 'A', 'text': '1'},
                            {'id': 'B', 'text': '2'},
                            {'id': 'C', 'text': '3'},
                            {'id': 'D', 'text': '4'},
                        ],
                        'correct_answer': 'A',
                        'category': 'Numerical',
                        'subcategory': subcat,
                        'difficulty': 'easy',
                        'explanation': 'Option 1 is computed by straightforward reduction.',
                        'tags': ['learn_reinforcement', module_id],
                        'created_at': _now()
                    },
                    {
                        'text': f'Reinforcement 2 for {title}: quick practice.',
                        'options': [
                            {'id': 'A', 'text': '5'},
                            {'id': 'B', 'text': '6'},
                            {'id': 'C', 'text': '7'},
                            {'id': 'D', 'text': '8'},
                        ],
                        'correct_answer': 'A',
                        'category': 'Numerical',
                        'subcategory': subcat,
                        'difficulty': 'easy',
                        'explanation': 'A follows from reducing the expression.',
                        'tags': ['learn_reinforcement', module_id],
                        'created_at': _now()
                    }
                ]
            }
        }
        modules.append(primary)

    return modules
