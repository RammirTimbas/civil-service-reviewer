from marshmallow import Schema, fields, validate

class OptionSchema(Schema):
    id = fields.Str(required=True)
    text = fields.Str(required=True)

class ConceptSchema(Schema):
    title = fields.Str(required=True)
    rule_explanation = fields.Str(required=True)
    key_points = fields.List(fields.Str())
    heuristics = fields.List(fields.Str())

class WorkedExampleSchema(Schema):
    problem = fields.Str(required=True)
    solution_steps = fields.List(fields.Str(), required=True)
    pattern_recognition_note = fields.Str()

class LearningMetadataSchema(Schema):
    concept = fields.Nested(ConceptSchema, required=True)
    worked_example = fields.Nested(WorkedExampleSchema, required=True)
    guided_hint = fields.Str(required=True)
    misconception_notes = fields.Str()
    reinforcement_question_ids = fields.List(fields.Str()) # References to other question IDs

class QuestionSchema(Schema):
    id = fields.Str(dump_only=True)
    text = fields.Str(required=True)
    options = fields.List(fields.Nested(OptionSchema), required=True, validate=validate.Length(min=2))
    correct_answer = fields.Str(required=True)
    category = fields.Str(required=True, validate=validate.OneOf([
        'Verbal Ability', 'Numerical Reasoning', 'Analytical Ability',
        'Clerical Operations', 'General Information'
    ]))
    subcategory = fields.Str()
    difficulty = fields.Str(required=True, validate=validate.OneOf(['easy', 'medium', 'hard']))
    hint = fields.Str()
    explanation = fields.Str(required=True)
    wrong_answer_explanations = fields.Dict(keys=fields.Str(), values=fields.Str())
    tags = fields.List(fields.Str())
    learning_metadata = fields.Nested(LearningMetadataSchema, allow_none=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
