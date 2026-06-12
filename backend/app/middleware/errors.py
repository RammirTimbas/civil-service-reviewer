from flask import jsonify
from werkzeug.exceptions import HTTPException
import logging

def register_error_handlers(app):
    @app.errorhandler(Exception)
    def handle_exception(e):
        # Log the error
        logging.error(f"Unhandled Exception: {str(e)}", exc_info=True)

        # Pass through HTTP errors
        if isinstance(e, HTTPException):
            return jsonify({
                "error": e.name,
                "message": e.description
            }), e.code

        # Handle non-HTTP exceptions
        return jsonify({
            "error": "Internal Server Error",
            "message": "An unexpected error occurred on the server."
        }), 500

    @app.errorhandler(404)
    def handle_404(e):
        return jsonify({"error": "Not Found", "message": "The requested resource was not found."}), 404

    @app.errorhandler(400)
    def handle_400(e):
        return jsonify({"error": "Bad Request", "message": str(e.description)}), 400
