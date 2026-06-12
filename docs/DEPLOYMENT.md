# Production Deployment Strategy

## 1. Backend (Flask + MongoDB)
- **Host**: Render, Heroku, or AWS EC2/App Runner.
- **Database**: MongoDB Atlas (Free Tier for MVP, Dedicated Cluster for Production).
- **Environment Variables**:
  - `FLASK_CONFIG`: `production`
  - `MONGO_URI`: Atlas connection string
  - `SECRET_KEY`: Long random string
  - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
  - `FRONTEND_URL`: Production URL of the Next.js app

## 2. Frontend (Next.js)
- **Host**: Vercel (recommended) or Netlify.
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL`: Backend API URL

## 3. Infrastructure Checklist
- [ ] **SSL/TLS**: Ensure all traffic is over HTTPS.
- [ ] **CORS**: Restrict `FRONTEND_URL` in Flask config.
- [ ] **Logging**: Use a service like Sentry or Logtail for production error tracking.
- [ ] **Monitoring**: Set up UptimeRobot or similar to monitor health check endpoints.
- [ ] **CI/CD**: GitHub Actions for automated testing and deployment.

## 4. Scaling
- **Horizontal Scaling**: Flask can be scaled using Gunicorn/Nginx in Docker containers.
- **Database Indexing**: Ensure all query patterns (category, difficulty, user_id) are indexed in MongoDB.
- **CDN**: Next.js automatically uses Vercel's Edge Network for static assets.
