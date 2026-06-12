# Engineering Standards & Maintainability Guide

## 1. Clean Architecture Principles
- **Separation of Concerns**: Keep business logic in `services/`, database logic in `repositories/`, and request handling in `controllers/`.
- **Dependency Inversion**: High-level modules should not depend on low-level modules. Both should depend on abstractions.
- **Single Responsibility**: Each component, function, or class should do one thing well.

## 2. Frontend Best Practices
- **Feature-Based Structure**: Organize code by domain (e.g., `features/exam`) rather than type (e.g., `components/`).
- **Strict Typing**: No `any` types. Use interface inheritance for shared props.
- **Custom Hooks**: Abstract complex logic (API calls, state transitions) into hooks to keep components declarative.
- **Design System**: Use ShadCN UI as the base. Don't re-invent the wheel for basic components like buttons or inputs.
- **Accessibility (A11y)**: Use semantic HTML, ARIA labels, and ensure keyboard navigability.

## 3. Backend Best Practices
- **Middleware first**: Use decorators for authentication, logging, and rate limiting to keep routes clean.
- **Input Validation**: Never trust client input. Use Marshmallow schemas to validate all POST/PUT requests.
- **Centralized Error Handling**: Use the Flask error handler to return consistent JSON responses for all exceptions.
- **Structured Logging**: Use Python's `logging` module with different levels (INFO, WARNING, ERROR).

## 4. Testing Strategy
- **Unit Tests**: Test utility functions and individual service methods.
- **Integration Tests**: Test API endpoints with a test database (using `mongomock`).
- **E2E Tests**: Use Playwright or Cypress for critical user flows like taking an exam.

## 5. Security Checklist
- [ ] JWT tokens stored in HTTP-only cookies (or secure localStorage for MVPs).
- [ ] API Rate limiting to prevent brute-force and DoS.
- [ ] Environment variables for all secrets.
- [ ] Sanitize HTML inputs to prevent XSS.
- [ ] Use Bcrypt for password hashing.
