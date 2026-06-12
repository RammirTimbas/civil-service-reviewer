from marshmallow import Schema, fields, validate

class OptionSchema(Schema):
    id = fields.Str(required=True)
    text = fields.Str(required=True)

class QuestionSchema(Schema):
    id = fields.Str(dump_only=True)
    text = fields.Str(required=True)
    options = fields.List(fields.Nested(OptionSchema), required=True, validate=validate.Length(min=2))
    correct_answer = fields.Str(required=True)  # ID of the correct option (e.g., "A")
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
    source = fields.Str()
    version = fields.Int(dump_default=1) # Fixed: default -> dump_default
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    metadata = fields.Dict()
