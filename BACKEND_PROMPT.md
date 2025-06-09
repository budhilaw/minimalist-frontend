# Backend Project Kickstart Prompt

## 🎯 Recommended Prompt for AI Assistant

Copy and paste this prompt to your AI assistant to start building the Rust backend:

---

**CONTEXT:**
I have a complete React/TypeScript frontend portfolio website with a comprehensive admin system. I need to build a high-performance Rust backend service that will integrate perfectly with this frontend.

**PROJECT DETAILS:**
- **Frontend**: React + TypeScript + TailwindCSS v4 + Vite
- **Admin System**: Complete content management with authentication, posts, portfolio, services, comments, profile management
- **Frontend Location**: `/Users/budhilaw/Dev/Personal/Javascript/minimalist-frontend`
- **Target Backend Location**: `/Users/budhilaw/Dev/Personal/Javascript/minimalist-backend` (will be created)

**REQUIREMENTS:**
I have a detailed backend setup guide (`BACKEND_SETUP.md`) that specifies all requirements:

```markdown
[Include the full BACKEND_SETUP.md content here]
```

**TASK:**
Please help me start building this Rust backend service by:

1. **Project Initialization**:
   - Create the backend project structure as specified in the guide
   - Set up `Cargo.toml` with all the latest dependencies
   - Initialize git repository with proper .gitignore

2. **Database Setup**:
   - Create all 6 migration files with exact SQL schemas
   - Set up database connection with connection pooling
   - Create model structs that match the frontend TypeScript interfaces

3. **Authentication System**:
   - Implement JWT authentication with Argon2 password hashing
   - Create login/logout endpoints
   - Set up middleware for protected routes
   - Implement session validation

4. **Core API Endpoints**:
   - Posts management (CRUD with search/filter/pagination)
   - Portfolio projects management
   - Services management  
   - Comments management
   - Profile management
   - Dashboard analytics

5. **Development Setup**:
   - Docker configuration for PostgreSQL and Redis
   - Environment configuration
   - Basic testing setup
   - CI/CD workflow files

**CONSTRAINTS:**
- Use **UUID v4** for all entity IDs (no auto-incrementing integers)
- **No ORM** - use raw SQL with SQLx for performance
- **Security-first** approach with proper validation
- **Performance-optimized** with connection pooling and Redis caching
- **Latest Rust libraries** only
- Follow **Rust best practices** for code organization
- Set up for **90%+ test coverage**

**INTEGRATION REQUIREMENTS:**
The backend must match these frontend admin features:
- Admin login form that posts to `/api/auth/login`
- Posts management with categories, tags, SEO, featured flags
- Portfolio projects with technologies arrays, status tracking
- Services with features arrays, pricing, active/inactive status
- Comments moderation system
- Profile updates (name, username, email, phone, password)
- Dashboard with stats (posts count, projects count, comments, analytics)

**OUTPUT FORMAT:**
Please provide:
1. **Step-by-step commands** to set up the project
2. **Complete file contents** for the initial setup
3. **Database migration files** with the exact schemas
4. **Core Rust files** (main.rs, lib.rs, models, handlers)
5. **Configuration files** (Cargo.toml, Docker, .env.example)
6. **Next steps** for continuing development

**GOAL:**
Create a production-ready foundation that I can immediately start developing on, with all the boilerplate and configuration done correctly according to Rust best practices.

Start with the project initialization and basic structure setup. Let's build this step by step!

---

## 🚀 Alternative Shorter Prompt

If you prefer a more concise prompt:

---

**TASK:** Build a high-performance Rust backend for my React portfolio admin system.

**SETUP GUIDE:** I have a complete specification in `BACKEND_SETUP.md`:
```
[Paste BACKEND_SETUP.md content]
```

**REQUIREMENTS:**
- Latest Rust + Axum + SQLx + PostgreSQL + Redis
- JWT auth, UUID v4 IDs, no ORM, 90% test coverage
- Must integrate with existing React admin (posts, portfolio, services, comments, profile)

**REQUEST:**
1. Create complete project structure
2. Set up Cargo.toml with dependencies 
3. Database migrations (6 files)
4. Authentication system
5. Core API endpoints
6. Docker + CI/CD setup

Please start with project initialization and provide complete file contents for immediate development.

---

## 📋 Pre-Prompt Checklist

Before using the prompt, ensure you have:

- [ ] The complete `BACKEND_SETUP.md` content ready to paste
- [ ] Decided on the backend project location
- [ ] PostgreSQL and Redis available (or Docker installed)
- [ ] Rust toolchain installed (`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`)
- [ ] Git configured for the new repository

## 💡 Prompt Usage Tips

1. **Include the full BACKEND_SETUP.md**: The AI needs the complete context
2. **Specify your OS**: Mention if you're on macOS/Linux/Windows for specific commands
3. **Ask for explanations**: Add "explain your choices" if you want to understand the decisions
4. **Request specific first steps**: Ask for "complete Cargo.toml first" if you want to start there
5. **Mention your experience level**: "I'm new to Rust" or "I'm experienced" helps tailor the response

## 🎯 Expected Outcome

Using this prompt should give you:
- ✅ Complete project structure with proper organization
- ✅ All configuration files ready for development
- ✅ Database schemas that match your frontend models
- ✅ Authentication system ready for your admin login
- ✅ API endpoints that integrate with your React components
- ✅ Testing and CI/CD setup for professional development
- ✅ Docker configuration for easy deployment

The result will be a production-ready Rust backend foundation that you can immediately start building upon! 