# Rust Backend Service Setup Guide

## 🎯 Project Overview

This guide will help you build a high-performance, secure Rust backend service for the minimalist frontend portfolio website. The backend will handle admin authentication, content management, and provide robust APIs with excellent performance and security.

## 📋 Requirements Checklist

- ✅ Latest Rust libraries and dependencies
- ✅ Security-first approach with JWT authentication
- ✅ Performance-optimized (no ORM, raw SQL queries)
- ✅ UUID v4 for all entity identifiers
- ✅ 90%+ unit test coverage
- ✅ PostgreSQL with Redis caching
- ✅ Solid database migrations
- ✅ CI/CD with GitHub Actions
- ✅ Code formatting (rustfmt + clippy)
- ✅ Zero tech debt architecture

## 🏗️ Project Structure

```
backend/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── src/
│   ├── handlers/
│   │   ├── auth.rs
│   │   ├── posts.rs
│   │   ├── portfolio.rs
│   │   ├── services.rs
│   │   ├── comments.rs
│   │   ├── profile.rs
│   │   ├── dashboard.rs
│   │   └── mod.rs
│   ├── models/
│   │   ├── user.rs
│   │   ├── post.rs
│   │   ├── portfolio.rs
│   │   ├── service.rs
│   │   ├── comment.rs
│   │   └── mod.rs
│   ├── database/
│   │   ├── connection.rs
│   │   ├── migrations.rs
│   │   └── mod.rs
│   ├── middleware/
│   │   ├── auth.rs
│   │   ├── cors.rs
│   │   ├── rate_limit.rs
│   │   ├── security.rs
│   │   └── mod.rs
│   ├── services/
│   │   ├── auth_service.rs
│   │   ├── cache_service.rs
│   │   ├── email_service.rs
│   │   └── mod.rs
│   ├── utils/
│   │   ├── config.rs
│   │   ├── errors.rs
│   │   ├── validation.rs
│   │   ├── password.rs
│   │   └── mod.rs
│   ├── tests/
│   │   ├── integration/
│   │   ├── unit/
│   │   └── mod.rs
│   ├── main.rs
│   └── lib.rs
├── migrations/
│   ├── 001_create_users.sql
│   ├── 002_create_posts.sql
│   ├── 003_create_portfolio.sql
│   ├── 004_create_services.sql
│   ├── 005_create_comments.sql
│   └── 006_create_audit_logs.sql
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── docker-compose.dev.yml
├── scripts/
│   ├── setup.sh
│   ├── test.sh
│   └── deploy.sh
├── .env.example
├── Cargo.toml
├── Cargo.lock
├── README.md
└── rustfmt.toml
```

## 🔧 Cargo.toml Configuration

Create a `Cargo.toml` with the latest, performance-optimized dependencies:

```toml
[package]
name = "portfolio-backend"
version = "0.1.0"
edition = "2021"
authors = ["Your Name <your.email@example.com>"]
description = "High-performance Rust backend for portfolio website"

[dependencies]
# Web Framework
axum = "0.7"
tokio = { version = "1.0", features = ["full"] }
tower = "0.4"
tower-http = { version = "0.5", features = ["fs", "cors", "compression", "trace"] }
hyper = "1.0"

# Database
sqlx = { version = "0.7", features = ["runtime-tokio-rustls", "postgres", "uuid", "chrono", "json"] }
redis = { version = "0.24", features = ["tokio-comp"] }

# Serialization
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"

# Authentication & Security
jsonwebtoken = "9.0"
argon2 = "0.5"
rand = "0.8"

# UUID & Time
uuid = { version = "1.6", features = ["v4", "serde"] }
chrono = { version = "0.4", features = ["serde"] }

# Validation
validator = { version = "0.18", features = ["derive"] }
regex = "1.10"

# Configuration
config = "0.14"
dotenvy = "0.15"

# Logging & Tracing
tracing = "0.1"
tracing-subscriber = { version = "0.3", features = ["env-filter"] }
tracing-opentelemetry = "0.22"

# Error Handling
anyhow = "1.0"
thiserror = "1.0"

# HTTP Client
reqwest = { version = "0.11", features = ["json"] }

# Performance
dashmap = "5.5"
once_cell = "1.19"

[dev-dependencies]
tokio-test = "0.4"
sqlx-test = "0.7"
wiremock = "0.6"
proptest = "1.4"
criterion = { version = "0.5", features = ["html_reports"] }

[[bench]]
name = "api_benchmarks"
harness = false

[profile.release]
lto = true
codegen-units = 1
panic = "abort"
strip = true

[profile.dev]
debug = true
overflow-checks = true
```

## 🗄️ Database Migrations

### 001_create_users.sql
```sql
-- Create users table
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'admin',
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 002_create_posts.sql
```sql
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    tags TEXT[] DEFAULT '{}',
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    publish_date TIMESTAMPTZ,
    read_time INTEGER, -- in minutes
    featured BOOLEAN NOT NULL DEFAULT false,
    published BOOLEAN NOT NULL DEFAULT false,
    meta_title VARCHAR(255),
    meta_description TEXT,
    keywords TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_published ON posts(published);
CREATE INDEX idx_posts_featured ON posts(featured);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);
CREATE INDEX idx_posts_publish_date ON posts(publish_date);

-- Trigger
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 003_create_portfolio.sql
```sql
CREATE TABLE portfolio_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT,
    category VARCHAR(50) NOT NULL,
    technologies TEXT[] NOT NULL DEFAULT '{}',
    live_url VARCHAR(500),
    github_url VARCHAR(500),
    image_url VARCHAR(500),
    featured BOOLEAN NOT NULL DEFAULT false,
    status VARCHAR(20) NOT NULL DEFAULT 'completed',
    start_date DATE NOT NULL,
    end_date DATE,
    client VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_portfolio_category ON portfolio_projects(category);
CREATE INDEX idx_portfolio_status ON portfolio_projects(status);
CREATE INDEX idx_portfolio_featured ON portfolio_projects(featured);
CREATE INDEX idx_portfolio_technologies ON portfolio_projects USING GIN(technologies);

-- Trigger
CREATE TRIGGER update_portfolio_updated_at BEFORE UPDATE ON portfolio_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 004_create_services.sql
```sql
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    features TEXT[] NOT NULL DEFAULT '{}',
    price_type VARCHAR(20), -- 'fixed', 'hourly', 'project'
    price_amount DECIMAL(10,2),
    price_currency VARCHAR(3) DEFAULT 'USD',
    delivery_time VARCHAR(100),
    category VARCHAR(100) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_active ON services(active);
CREATE INDEX idx_services_price_type ON services(price_type);

-- Trigger
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 005_create_comments.sql
```sql
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, approved, rejected
    ip_address INET,
    user_agent TEXT,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_status ON comments(status);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);

-- Trigger
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 006_create_audit_logs.sql
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

## 🔐 Authentication & Security Implementation

### src/models/user.rs
```rust
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use chrono::{DateTime, Utc};
use validator::Validate;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    #[serde(skip_serializing)]
    pub password_hash: String,
    pub full_name: Option<String>,
    pub phone: Option<String>,
    pub role: String,
    pub is_active: bool,
    pub last_login: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Validate)]
pub struct LoginRequest {
    #[validate(length(min = 3, max = 50))]
    pub username: String,
    #[validate(length(min = 8))]
    pub password: String,
}

#[derive(Debug, Deserialize, Validate)]
pub struct UpdateProfileRequest {
    #[validate(length(min = 1, max = 255))]
    pub full_name: String,
    #[validate(length(min = 3, max = 50))]
    pub username: String,
    #[validate(email)]
    pub email: String,
    #[validate(phone)]
    pub phone: Option<String>,
}

#[derive(Debug, Deserialize, Validate)]
pub struct ChangePasswordRequest {
    #[validate(length(min = 8))]
    pub current_password: String,
    #[validate(length(min = 8))]
    pub new_password: String,
}
```

### src/services/auth_service.rs
```rust
use anyhow::{Context, Result};
use argon2::{Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use argon2::password_hash::{rand_core::OsRng, SaltString};
use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use uuid::Uuid;

use crate::models::user::{User, LoginRequest};
use crate::utils::errors::AppError;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String, // user_id
    pub username: String,
    pub role: String,
    pub exp: i64,
    pub iat: i64,
}

pub struct AuthService {
    pool: PgPool,
    jwt_secret: String,
}

impl AuthService {
    pub fn new(pool: PgPool, jwt_secret: String) -> Self {
        Self { pool, jwt_secret }
    }

    pub async fn authenticate_user(&self, request: LoginRequest) -> Result<(User, String), AppError> {
        // Rate limiting should be handled at middleware level
        
        let user = sqlx::query_as::<_, User>(
            "SELECT * FROM users WHERE username = $1 AND is_active = true"
        )
        .bind(&request.username)
        .fetch_optional(&self.pool)
        .await
        .context("Failed to fetch user")?
        .ok_or(AppError::Unauthorized("Invalid credentials".to_string()))?;

        // Verify password
        let argon2 = Argon2::default();
        let parsed_hash = PasswordHash::new(&user.password_hash)
            .map_err(|_| AppError::Internal("Invalid password hash".to_string()))?;

        argon2
            .verify_password(request.password.as_bytes(), &parsed_hash)
            .map_err(|_| AppError::Unauthorized("Invalid credentials".to_string()))?;

        // Update last login
        sqlx::query("UPDATE users SET last_login = NOW() WHERE id = $1")
            .bind(user.id)
            .execute(&self.pool)
            .await
            .context("Failed to update last login")?;

        // Generate JWT token
        let token = self.generate_token(&user)?;

        Ok((user, token))
    }

    pub fn generate_token(&self, user: &User) -> Result<String, AppError> {
        let now = Utc::now();
        let expiration = now + Duration::hours(24); // 24 hour expiration

        let claims = Claims {
            sub: user.id.to_string(),
            username: user.username.clone(),
            role: user.role.clone(),
            exp: expiration.timestamp(),
            iat: now.timestamp(),
        };

        encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(self.jwt_secret.as_ref()),
        )
        .map_err(|_| AppError::Internal("Failed to generate token".to_string()))
    }

    pub fn validate_token(&self, token: &str) -> Result<Claims, AppError> {
        decode::<Claims>(
            token,
            &DecodingKey::from_secret(self.jwt_secret.as_ref()),
            &Validation::default(),
        )
        .map(|data| data.claims)
        .map_err(|_| AppError::Unauthorized("Invalid token".to_string()))
    }

    pub fn hash_password(&self, password: &str) -> Result<String, AppError> {
        let salt = SaltString::generate(&mut OsRng);
        let argon2 = Argon2::default();
        
        argon2
            .hash_password(password.as_bytes(), &salt)
            .map(|hash| hash.to_string())
            .map_err(|_| AppError::Internal("Failed to hash password".to_string()))
    }
}
```

## 🚀 Performance-Optimized Handlers

### src/handlers/posts.rs
```rust
use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::Json,
};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use uuid::Uuid;
use validator::Validate;

use crate::models::post::*;
use crate::utils::errors::AppError;
use crate::middleware::auth::Claims;

#[derive(Debug, Deserialize)]
pub struct PostQuery {
    pub page: Option<u32>,
    pub limit: Option<u32>,
    pub category: Option<String>,
    pub search: Option<String>,
    pub published: Option<bool>,
}

#[derive(Debug, Serialize)]
pub struct PostsResponse {
    pub posts: Vec<Post>,
    pub total: i64,
    pub page: u32,
    pub limit: u32,
    pub total_pages: u32,
}

pub async fn get_posts(
    State(pool): State<PgPool>,
    Query(query): Query<PostQuery>,
    _claims: Claims, // Authenticated admin only
) -> Result<Json<PostsResponse>, AppError> {
    let page = query.page.unwrap_or(1);
    let limit = query.limit.unwrap_or(10).min(100); // Cap at 100
    let offset = (page - 1) * limit;

    // Build dynamic query with proper SQL injection prevention
    let mut sql = "SELECT * FROM posts WHERE 1=1".to_string();
    let mut count_sql = "SELECT COUNT(*) FROM posts WHERE 1=1".to_string();
    let mut params: Vec<String> = vec![];
    let mut param_count = 1;

    if let Some(category) = &query.category {
        sql.push_str(&format!(" AND category = ${}", param_count));
        count_sql.push_str(&format!(" AND category = ${}", param_count));
        params.push(category.clone());
        param_count += 1;
    }

    if let Some(search) = &query.search {
        sql.push_str(&format!(" AND (title ILIKE ${} OR content ILIKE ${})", param_count, param_count));
        count_sql.push_str(&format!(" AND (title ILIKE ${} OR content ILIKE ${})", param_count, param_count));
        params.push(format!("%{}%", search));
        param_count += 1;
    }

    if let Some(published) = query.published {
        sql.push_str(&format!(" AND published = ${}", param_count));
        count_sql.push_str(&format!(" AND published = ${}", param_count));
        params.push(published.to_string());
        param_count += 1;
    }

    sql.push_str(" ORDER BY created_at DESC LIMIT $");
    sql.push_str(&param_count.to_string());
    param_count += 1;
    sql.push_str(" OFFSET $");
    sql.push_str(&param_count.to_string());

    // Execute queries concurrently for better performance
    let (posts_result, count_result) = tokio::try_join!(
        sqlx::query_as::<_, Post>(&sql)
            .bind(&params.get(0).unwrap_or(&String::new()))
            .bind(&params.get(1).unwrap_or(&String::new()))
            .bind(limit as i32)
            .bind(offset as i32)
            .fetch_all(&pool),
        sqlx::query_scalar::<_, i64>(&count_sql)
            .bind(&params.get(0).unwrap_or(&String::new()))
            .bind(&params.get(1).unwrap_or(&String::new()))
            .fetch_one(&pool)
    )?;

    let total_pages = (count_result as f64 / limit as f64).ceil() as u32;

    Ok(Json(PostsResponse {
        posts: posts_result,
        total: count_result,
        page,
        limit,
        total_pages,
    }))
}

// Additional handlers: create_post, update_post, delete_post, get_post_by_id
```

## 🧪 Comprehensive Testing

### src/tests/integration/auth_tests.rs
```rust
use axum::http::StatusCode;
use serde_json::json;
use sqlx::PgPool;
use uuid::Uuid;

use crate::tests::helpers::TestApp;

#[sqlx::test]
async fn test_login_success(pool: PgPool) {
    let app = TestApp::new(pool).await;
    
    // Create test user
    let user_id = app.create_test_user().await;
    
    let response = app
        .post("/api/auth/login")
        .json(&json!({
            "username": "testuser",
            "password": "testpassword123"
        }))
        .send()
        .await;

    assert_eq!(response.status(), StatusCode::OK);
    
    let body: serde_json::Value = response.json().await;
    assert!(body["token"].is_string());
    assert_eq!(body["user"]["username"], "testuser");
}

#[sqlx::test]
async fn test_login_invalid_credentials(pool: PgPool) {
    let app = TestApp::new(pool).await;
    
    let response = app
        .post("/api/auth/login")
        .json(&json!({
            "username": "nonexistent",
            "password": "wrongpassword"
        }))
        .send()
        .await;

    assert_eq!(response.status(), StatusCode::UNAUTHORIZED);
}

#[sqlx::test]
async fn test_protected_route_without_token(pool: PgPool) {
    let app = TestApp::new(pool).await;
    
    let response = app
        .get("/api/posts")
        .send()
        .await;

    assert_eq!(response.status(), StatusCode::UNAUTHORIZED);
}
```

## 🔄 CI/CD Configuration

### .github/workflows/ci.yml
```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  CARGO_TERM_COLOR: always
  SQLX_OFFLINE: true

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: portfolio_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
    - uses: actions/checkout@v4
    
    - name: Install Rust
      uses: dtolnay/rust-toolchain@stable
      with:
        components: rustfmt, clippy

    - name: Cache dependencies
      uses: actions/cache@v3
      with:
        path: |
          ~/.cargo/registry
          ~/.cargo/git
          target
        key: ${{ runner.os }}-cargo-${{ hashFiles('**/Cargo.lock') }}

    - name: Install sqlx-cli
      run: cargo install sqlx-cli --no-default-features --features postgres

    - name: Run migrations
      run: sqlx migrate run
      env:
        DATABASE_URL: postgres://postgres:postgres@localhost:5432/portfolio_test

    - name: Check formatting
      run: cargo fmt --all -- --check

    - name: Run Clippy
      run: cargo clippy --all-targets --all-features -- -D warnings

    - name: Run tests
      run: cargo test --all-features
      env:
        DATABASE_URL: postgres://postgres:postgres@localhost:5432/portfolio_test
        REDIS_URL: redis://localhost:6379

    - name: Generate test coverage
      run: |
        cargo install cargo-tarpaulin
        cargo tarpaulin --verbose --all-features --workspace --timeout 120 --out Xml

    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./cobertura.xml
        fail_ci_if_error: true

  security:
    name: Security Audit
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: dtolnay/rust-toolchain@stable
    - name: Install cargo audit
      run: cargo install cargo-audit
    - name: Run security audit
      run: cargo audit

  benchmarks:
    name: Performance Benchmarks
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: dtolnay/rust-toolchain@stable
    - name: Run benchmarks
      run: cargo bench
```

## 🐳 Docker Configuration

### docker/Dockerfile
```dockerfile
# Multi-stage build for optimal image size
FROM rust:1.75-slim as builder

WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy manifests
COPY Cargo.toml Cargo.lock ./

# Build dependencies (cached layer)
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release
RUN rm -f target/release/deps/portfolio_backend*

# Copy source code
COPY src/ src/

# Build application
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y \
    ca-certificates \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy binary
COPY --from=builder /app/target/release/portfolio-backend .

# Copy migrations
COPY migrations/ migrations/

# Create non-root user
RUN useradd -m -u 1001 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

CMD ["./portfolio-backend"]
```

## ⚙️ Configuration Management

### src/utils/config.rs
```rust
use config::{Config, ConfigError, Environment, File};
use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct DatabaseConfig {
    pub url: String,
    pub max_connections: u32,
    pub min_connections: u32,
    pub connect_timeout: u64,
    pub idle_timeout: u64,
}

#[derive(Debug, Deserialize)]
pub struct RedisConfig {
    pub url: String,
    pub pool_size: u32,
    pub timeout: u64,
}

#[derive(Debug, Deserialize)]
pub struct AuthConfig {
    pub jwt_secret: String,
    pub token_expiry: i64,
    pub bcrypt_cost: u32,
}

#[derive(Debug, Deserialize)]
pub struct ServerConfig {
    pub host: String,
    pub port: u16,
    pub workers: usize,
}

#[derive(Debug, Deserialize)]
pub struct AppConfig {
    pub database: DatabaseConfig,
    pub redis: RedisConfig,
    pub auth: AuthConfig,
    pub server: ServerConfig,
    pub environment: String,
    pub log_level: String,
}

impl AppConfig {
    pub fn from_env() -> Result<Self, ConfigError> {
        let mut builder = Config::builder()
            .add_source(File::with_name("config/default"))
            .add_source(
                Environment::with_prefix("APP")
                    .prefix_separator("_")
                    .separator("__")
            );

        if let Ok(env) = std::env::var("APP_ENVIRONMENT") {
            builder = builder.add_source(File::with_name(&format!("config/{}", env)).required(false));
        }

        builder.build()?.try_deserialize()
    }
}
```

## 📊 Performance Monitoring

### src/middleware/metrics.rs
```rust
use axum::{
    extract::MatchedPath,
    http::Request,
    middleware::Next,
    response::Response,
};
use std::time::Instant;
use tracing::info;

pub async fn track_metrics<B>(
    MatchedPath(path): MatchedPath,
    req: Request<B>,
    next: Next<B>,
) -> Response {
    let start = Instant::now();
    let method = req.method().clone();
    
    let response = next.run(req).await;
    
    let latency = start.elapsed();
    let status = response.status();

    info!(
        method = %method,
        path = %path,
        status = %status,
        latency_ms = %latency.as_millis(),
        "HTTP request completed"
    );

    // Here you could send metrics to your monitoring system
    // (Prometheus, DataDog, etc.)

    response
}
```

## 🚀 Getting Started

### 1. Environment Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd backend

# Copy environment file
cp .env.example .env

# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install required tools
cargo install sqlx-cli --no-default-features --features postgres
cargo install cargo-watch
cargo install cargo-audit
cargo install cargo-tarpaulin
```

### 2. Database Setup
```bash
# Start PostgreSQL and Redis
docker-compose up -d postgres redis

# Run migrations
sqlx migrate run

# Create admin user (run this SQL)
INSERT INTO users (username, email, password_hash, full_name, role) 
VALUES ('admin', 'admin@example.com', '$argon2id$v=19$m=65536,t=3,p=4$...', 'Admin User', 'admin');
```

### 3. Development
```bash
# Run in development mode with auto-reload
cargo watch -x run

# Run tests
cargo test

# Run with coverage
cargo tarpaulin --verbose --all-features --workspace --timeout 120

# Format code
cargo fmt

# Lint code
cargo clippy
```

### 4. Production Deployment
```bash
# Build optimized binary
cargo build --release

# Run migrations in production
DATABASE_URL=postgresql://... sqlx migrate run

# Start server
./target/release/portfolio-backend
```

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/me` - Get current user info

### Content Management Endpoints
- `GET /api/posts` - List posts with pagination
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Similar patterns for:
- `/api/portfolio` - Portfolio projects
- `/api/services` - Services management
- `/api/comments` - Comments management
- `/api/profile` - User profile management
- `/api/dashboard` - Dashboard analytics

## 🔒 Security Checklist

- ✅ JWT token authentication
- ✅ Password hashing with Argon2
- ✅ SQL injection prevention with parameterized queries
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Input validation
- ✅ Security headers
- ✅ Audit logging
- ✅ Environment-based configuration
- ✅ Dependency security scanning

## 🎯 Performance Features

- ✅ Connection pooling with SQLx
- ✅ Redis caching for frequently accessed data
- ✅ Concurrent database queries with tokio::try_join!
- ✅ Optimized SQL indexes
- ✅ Database query optimization
- ✅ Minimal allocations with careful string handling
- ✅ Response compression
- ✅ Async/await throughout

This backend service will provide a robust, secure, and high-performance foundation for your portfolio website admin system! 