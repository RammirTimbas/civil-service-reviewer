import datetime
from typing import List

def _now():
    return datetime.datetime.utcnow()

def _slug(s: str) -> str:
    return s.lower().replace(' ', '_')

def get_analytical_questions() -> List[dict]:
    topics = [
        ('Syllogisms', 'Syllogisms'),
        ('Logical Reasoning', 'Logical Reasoning'),
        ('Pattern Recognition', 'Patterns'),
        ('Deductive Reasoning', 'Deduction'),
        ('Number Patterns', 'Number Patterns'),
        ('Syllogisms II', 'Syllogisms'),
        ('Logic Practice', 'Logical Reasoning'),
        ('Pattern II', 'Patterns'),
        ('Deduction II', 'Deduction'),
        ('Sequences II', 'Number Patterns')
    ]

    modules = []
    for idx, (title, subcat) in enumerate(topics, start=1):
        module_id = f"learn:analytical:{idx}_{_slug(title)}"
        primary = {
            'module_id': module_id,
            'text': f'{title}: Analyze the argument and pick the best choice.',
            'options': [
                {'id': 'A', 'text': 'Option A'},
                {'id': 'B', 'text': 'Option B'},
                {'id': 'C', 'text': 'Option C'},
                {'id': 'D', 'text': 'Option D'},
            ],
            'correct_answer': 'A',
            'category': 'Analytical',
            'subcategory': subcat,
            'difficulty': 'medium',
            'explanation': 'A is the logically valid conclusion.',
            'tags': ['learn_module', 'analytical', module_id],
            'created_at': _now(),
            'learning_metadata': {
                'concept': {
                    'title': f'{title} - Core Reasoning',
                    'rule_explanation': 'Identify premises and valid conclusions; avoid illicit generalizations.',
                    'key_points': ['Separate assumptions from conclusions', 'Check quantifiers'],
                    'heuristics': ['Diagram syllogisms when possible']
                },
                'worked_example': {
                    'problem': 'A short example tracing premises to a conclusion.',
                    'solution_steps': ['Extract premises', 'Test for counterexamples', 'Infer valid conclusion'],
                    'pattern_recognition_note': 'Recognize common invalid argument forms.'
                },
                'guided_hint': 'List premises and test each option against them.',
                'misconception_notes': 'Do not overgeneralize from a single premise.',
                'reinforcement_questions': [
                    {
                        'text': f'Reinforcement 1 for {title}: short logic item.',
                        'options': [
                            {'id': 'A', 'text': 'True'},
                            {'id': 'B', 'text': 'False'},
                            {'id': 'C', 'text': 'Cannot Tell'},
                            {'id': 'D', 'text': 'Irrelevant'},
                        ],
                        'correct_answer': 'A',
                        'category': 'Analytical',
                        'subcategory': subcat,
                        'difficulty': 'easy',
                        'explanation': 'Deduction supports A.',
                        'tags': ['learn_reinforcement', module_id],
                        'created_at': _now()
                    },
                    {
                        'text': f'Reinforcement 2 for {title}: quick reasoning.',
                        'options': [
                            {'id': 'A', 'text': '1'},
                            {'id': 'B', 'text': '2'},
                            {'id': 'C', 'text': '3'},
                            {'id': 'D', 'text': '4'},
                        ],
                        'correct_answer': 'A',
                        'category': 'Analytical',
                        'subcategory': subcat,
                        'difficulty': 'easy',
                        'explanation': 'A follows by pattern.',
                        'tags': ['learn_reinforcement', module_id],
                        'created_at': _now()
                    }
                ]
            }
        }
        modules.append(primary)

    return modules
