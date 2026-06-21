import datetime
from typing import List

def _now():
    return datetime.datetime.utcnow()

def _slug(s: str) -> str:
    return s.lower().replace(' ', '_')

def get_general_questions() -> List[dict]:
    topics = [
        ('Philippine Constitution', 'Constitution'),
        ('RA 6713', 'Code of Conduct'),
        ('Government Branches', 'Government Structure'),
        ('Ethics in Public Service', 'Ethics'),
        ('Philippine Civics', 'Civics'),
        ('CSC Roles', 'CSC Topics'),
        ('Civil Service Rules', 'Regulation'),
        ('Public Accountability', 'Accountability'),
        ('Administrative Law', 'Admin Law'),
        ('Public Service Ethics II', 'Ethics')
    ]

    modules = []
    for idx, (title, subcat) in enumerate(topics, start=1):
        module_id = f"learn:general:{idx}_{_slug(title)}"
        primary = {
            'module_id': module_id,
            'text': f'{title}: Short civics-style learning question.',
            'options': [
                {'id': 'A', 'text': 'Choice A'},
                {'id': 'B', 'text': 'Choice B'},
                {'id': 'C', 'text': 'Choice C'},
                {'id': 'D', 'text': 'Choice D'},
            ],
            'correct_answer': 'A',
            'category': 'General Information',
            'subcategory': subcat,
            'difficulty': 'medium',
            'explanation': 'A matches the principle or statute referenced.',
            'tags': ['learn_module', 'general', module_id],
            'created_at': _now(),
            'learning_metadata': {
                'concept': {
                    'title': f'{title} - Core Principle',
                    'rule_explanation': 'A short statement of the relevant law or principle.',
                    'key_points': ['Scope of law', 'Responsible agencies', 'Key obligations'],
                    'heuristics': ['Read the stem for jurisdiction and timeframe.']
                },
                'worked_example': {
                    'problem': 'A brief example applying legal principle to fact pattern.',
                    'solution_steps': ['Identify legal provision', 'Apply elements to facts', 'Conclude and select option'],
                    'pattern_recognition_note': 'Spot keywords that trigger statutory rules.'
                },
                'guided_hint': 'Identify which provision or ethical standard is at play.',
                'misconception_notes': 'Do not conflate administrative sanctions with criminal penalties.',
                'reinforcement_questions': [
                    {
                        'text': f'Reinforcement 1 for {title}: quick civics check.',
                        'options': [
                            {'id': 'A', 'text': 'Yes'},
                            {'id': 'B', 'text': 'No'},
                            {'id': 'C', 'text': 'Depends'},
                            {'id': 'D', 'text': 'Irrelevant'},
                        ],
                        'correct_answer': 'A',
                        'category': 'General Information',
                        'subcategory': subcat,
                        'difficulty': 'easy',
                        'explanation': 'A corresponds to the doctrine.',
                        'tags': ['learn_reinforcement', module_id],
                        'created_at': _now()
                    },
                    {
                        'text': f'Reinforcement 2 for {title}: quick law/ethics practice.',
                        'options': [
                            {'id': 'A', 'text': '1'},
                            {'id': 'B', 'text': '2'},
                            {'id': 'C', 'text': '3'},
                            {'id': 'D', 'text': '4'},
                        ],
                        'correct_answer': 'A',
                        'category': 'General Information',
                        'subcategory': subcat,
                        'difficulty': 'easy',
                        'explanation': 'A best reflects the statute.',
                        'tags': ['learn_reinforcement', module_id],
                        'created_at': _now()
                    }
                ]
            }
        }
        modules.append(primary)

    return modules
