from flask import request, jsonify
import time
from functools import wraps
from collections import defaultdict

# Simple in-memory rate limiter
# In production, use Redis
class RateLimiter:
    def __init__(self, requests_per_minute=60):
        self.requests_per_minute = requests_per_minute
        self.hits = defaultdict(list)

    def is_allowed(self, key):
        now = time.time()
        # Remove old hits
        self.hits[key] = [t for t in self.hits[key] if now - t < 60]

        if len(self.hits[key]) < self.requests_per_minute:
            self.hits[key].append(now)
            return True
        return False

limiter = RateLimiter(requests_per_minute=100)

def rate_limit(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Use IP address as key
        key = request.remote_addr
        if not limiter.is_allowed(key):
            return jsonify({"error": "Too many requests", "message": "Rate limit exceeded. Please try again later."}), 429
        return f(*args, **kwargs)
    return decorated_function
