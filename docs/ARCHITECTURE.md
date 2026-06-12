# Civil Service Reviewer - Project Architecture

## 1. High-Level Architecture
This platform follows a decoupled Client-Server architecture.

- **Frontend**: Next.js (App Router) for SSR and client-side interactivity, TailwindCSS for styling, and ShadCN UI for accessible components.
- **Backend**: Flask RESTful API using a layered architecture (Routes -> Controllers -> Services -> Repositories).
- **Database**: MongoDB Atlas for flexible document storage (ideal for diverse question types).
- **Auth**: JWT-based authentication with Google OAuth 2.0 integration.

## 2. Folder Structure

### Frontend (`/frontend`)
```text
src/
├── app/                  # Next.js App Router (pages & layouts)
├── components/           # Shared UI components (ShadCN + Custom)
│   ├── ui/               # Atomic ShadCN components
│   ├── forms/            # Form-specific components
│   └── shared/           # Common layouts, navigation
├── features/             # Feature-based modules (Domain Driven)
│   ├── auth/             # Login, Register, Google Auth
│   ├── dashboard/        # Stats, Recent Activity
│   ├── exam/             # Mock Exam & Practice Mode logic
│   ├── learning/         # Learn Mode & Tutorials
│   └── admin/            # Question CRUD & Analytics
├── hooks/                # Global reusable hooks
├── lib/                  # Utils, API clients, constants
├── store/                # Zustand stores (auth, user preference)
└── types/                # TypeScript definitions
```

### Backend (`/backend`)
```text
app/
├── api/                  # Route definitions (Blueprints)
├── controllers/          # Request handling logic
├── services/             # Core business logic
├── repositories/         # Database access layer
├── models/               # Marshmallow schemas & logic
├── middleware/           # Auth, logging, error handling
├── utils/                # Helpers (JWT, OAuth)
└── __init__.py           # App factory
```

## 3. Database Schema (MongoDB)

### `users`
- `_id`: ObjectId
- `email`: String (unique)
- `name`: String
- `password`: String (hashed, optional for OAuth users)
- `google_id`: String (optional)
- `role`: String ('User' | 'Admin')
- `stats`: Object (accuracy, streak, total_questions)
- `created_at`: Date

### `questions`
- `_id`: ObjectId
- `text`: String
- `options`: Array[String]
- `correct_answer`: Number (index)
- `category`: String (e.g., 'Verbal Ability')
- `subcategory`: String
- `difficulty`: String ('Easy', 'Medium', 'Hard')
- `explanation`: Object { text, steps, wrong_answers: [] }
- `tags`: Array[String]
- `metadata`: Object

### `user_progress`
- `user_id`: ObjectId
- `question_id`: ObjectId
- `status`: String ('correct', 'incorrect', 'skipped')
- `attempts`: Number
- `last_attempt_at`: Date

### `exam_sessions`
- `user_id`: ObjectId
- `type`: String ('Mock', 'Practice')
- `score`: Number
- `total_questions`: Number
- `answers`: Array[{ question_id, chosen_index, is_correct }]
- `duration_ms`: Number
- `completed_at`: Date
