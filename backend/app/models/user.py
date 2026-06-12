from marshmallow import Schema, fields, validate

class UserSchema(Schema):
    id = fields.Str(dump_only=True)
    email = fields.Email(required=True)
    name = fields.Str(required=True)
    password = fields.Str(load_only=True)
    google_id = fields.Str()
    role = fields.Str(validate=validate.OneOf(['User', 'Admin']), load_default='User')
    profile_picture = fields.Str()
    study_streak = fields.Int(dump_only=True, dump_default=0)
    last_active = fields.DateTime(dump_only=True)
    created_at = fields.DateTime(dump_only=True)

class UserProfileSchema(Schema):
    name = fields.Str()
    profile_picture = fields.Str()
