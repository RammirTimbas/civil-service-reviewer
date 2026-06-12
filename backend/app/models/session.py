from marshmallow import Schema, fields, validate

class ExamSessionSchema(Schema):
    id = fields.Str(dump_only=True)
    user_id = fields.Str(required=True)
    type = fields.Str(required=True, validate=validate.OneOf(['Mock', 'Practice', 'Learn']))
    status = fields.Str(validate=validate.OneOf(['active', 'completed', 'abandoned']), load_default='active') # Fixed: default -> load_default
    category = fields.Str()
    questions = fields.List(fields.Str(), required=True)
    answers = fields.Dict(keys=fields.Str(), values=fields.Int())
    score = fields.Int()
    total_questions = fields.Int()
    duration_seconds = fields.Int()
    created_at = fields.DateTime(dump_only=True)
    completed_at = fields.DateTime()
