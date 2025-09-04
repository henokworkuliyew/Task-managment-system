# Task Management System Backend

A comprehensive, production-ready task management system backend built with NestJS, PostgreSQL, Socket.io, and Cloudinary integration.

## 🚀 Features

- **User Management**: Complete CRUD operations with role-based access control
- **Authentication & Security**: JWT-based auth with refresh tokens, OTP verification, and password reset
- **Project Management**: Multi-user projects with team collaboration
- **Advanced Task Management**: Hierarchical tasks, subtasks, dependencies, and progress tracking
- **Issue Tracking**: Comprehensive bug tracking with severity levels and file attachments
- **Real-time Communication**: Socket.io integration for live notifications and updates
- **File Management**: Cloudinary integration for secure file uploads and storage
- **Time Tracking**: Built-in time logging with detailed reporting
- **Analytics & Reporting**: Comprehensive analytics with exportable reports
- **Search & Filtering**: Full-text search across all entities with advanced filtering

## 🛠 Tech Stack

- **Framework**: NestJS (Node.js framework)
- **Database**: PostgreSQL 15+ with TypeORM
- **Authentication**: JWT with Passport.js
- **Real-time**: Socket.io for WebSocket connections
- **File Storage**: Cloudinary for image and file management
- **Background Jobs**: Bull Queue with Redis
- **Email Service**: Nodemailer for notifications
- **API Documentation**: Swagger/OpenAPI 3.0
- **Validation**: Class-validator and class-transformer
- **Security**: Helmet, CORS, Rate limiting with Throttler

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher
- **PostgreSQL**: Version 15 or higher
- **Redis**: Version 6.0 or higher (optional, for background jobs)
- **Git**: For version control

## 🚀 Quick Start

### 1. Clone and Install

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd task-management-backend

# Install dependencies
npm install
\`\`\`

### 2. Environment Configuration

\`\`\`bash
# Copy environment template
cp .env.example .env
\`\`\`

Update `.env` with your configuration:

\`\`\`env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=task_manager

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration
NODEMAILER_EMAIL=your-email@gmail.com
NODEMAILER_PASSWORD=your-app-password
NODEMAILER_HOST=smtp.gmail.com
NODEMAILER_PORT=587

# Redis Configuration (optional)
REDIS_HOST=localhost
REDIS_PORT=6379

# Application Configuration
NODE_ENV=development
PORT=3000
\`\`\`

### 3. Database Setup

#### Option A: Using Docker (Recommended)

\`\`\`bash
# Start PostgreSQL with Docker
docker run --name postgres-db \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=task_manager \
  -p 5432:5432 \
  -d postgres:15

# Optional: Start Redis for background jobs
docker run --name redis-server \
  -p 6379:6379 \
  -d redis:7-alpine
\`\`\`

#### Option B: Local Installation

Install PostgreSQL locally and create a database named `task_manager`.

### 4. Start the Application

\`\`\`bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
\`\`\`

### 5. Using Docker Compose (Alternative)

\`\`\`bash
# Start all services (PostgreSQL, Redis, and the app)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
\`\`\`

## 📚 API Documentation

Once the server is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:3000/api/docs
- **API Base URL**: http://localhost:3000/api/v1
- **Health Check**: http://localhost:3000/health

### Core API Endpoints

#### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh JWT token
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password with token
- `POST /api/v1/auth/verify-otp` - Verify OTP code

#### Users
- `GET /api/v1/users` - List all users (paginated)
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user profile
- `DELETE /api/v1/users/:id` - Delete user (Admin only)

#### Projects
- `GET /api/v1/projects` - List user's projects
- `POST /api/v1/projects` - Create new project
- `GET /api/v1/projects/:id` - Get project details
- `PUT /api/v1/projects/:id` - Update project
- `DELETE /api/v1/projects/:id` - Delete project
- `POST /api/v1/projects/:id/members` - Add team member

#### Tasks
- `GET /api/v1/tasks` - List tasks with filtering
- `POST /api/v1/tasks` - Create new task
- `GET /api/v1/tasks/:id` - Get task details
- `PUT /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task
- `POST /api/v1/tasks/:id/subtasks` - Create subtask
- `PUT /api/v1/tasks/:id/status` - Update task status

#### Issues
- `GET /api/v1/issues` - List issues with filtering
- `POST /api/v1/issues` - Create new issue
- `GET /api/v1/issues/:id` - Get issue details
- `PUT /api/v1/issues/:id` - Update issue
- `DELETE /api/v1/issues/:id` - Delete issue

## 🏗 Project Structure

\`\`\`
src/
├── app.module.ts                 # Root application module
├── main.ts                       # Application entry point
├── common/                       # Shared utilities and components
│   ├── decorators/              # Custom decorators (roles, api-property)
│   ├── dtos/                    # Shared DTOs (pagination, response)
│   ├── enums/                   # Application enums (roles, status, priority)
│   ├── filters/                 # Exception filters (global error handling)
│   ├── guards/                  # Authentication and authorization guards
│   └── interceptors/            # Request/response interceptors (logging)
├── config/                      # Configuration modules
│   ├── database.config.ts       # TypeORM database configuration
│   └── cloudinary.config.ts     # Cloudinary setup
├── entities/                    # TypeORM database entities
│   ├── user.entity.ts          # User entity with relationships
│   ├── project.entity.ts       # Project entity
│   ├── task.entity.ts          # Task entity with subtasks
│   ├── issue.entity.ts         # Issue tracking entity
│   ├── comment.entity.ts       # Comments for tasks/issues
│   ├── notification-log.entity.ts # Notification history
│   ├── time-log.entity.ts      # Time tracking records
│   ├── audit-log.entity.ts     # System audit trail
│   └── webhook.entity.ts       # Webhook configurations
└── modules/                     # Feature modules
    ├── auth/                    # Authentication & authorization
    │   ├── auth.controller.ts   # Auth endpoints
    │   ├── auth.service.ts      # Auth business logic
    │   ├── auth.module.ts       # Auth module configuration
    │   ├── guards/              # JWT and roles guards
    │   ├── decorators/          # Auth decorators
    │   └── strategies/          # Passport strategies
    ├── users/                   # User management
    ├── projects/                # Project management
    ├── tasks/                   # Task management
    ├── issues/                  # Issue tracking
    ├── comments/                # Comment system
    ├── notifications/           # Notification system
    ├── time-tracking/           # Time logging
    ├── reports/                 # Analytics and reporting
    └── webhooks/                # Webhook management
\`\`\`

## 🔐 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication with configurable expiration
- **Refresh Tokens**: Long-lived tokens for seamless user experience
- **Role-Based Access Control**: Four user roles (Admin, Manager, Contributor, Viewer)
- **Password Security**: bcrypt hashing with 12 salt rounds
- **OTP Verification**: Two-factor authentication support
- **Password Reset**: Secure email-based password recovery

### API Security
- **Rate Limiting**: Configurable request throttling (10 requests/minute by default)
- **Input Validation**: Comprehensive validation using class-validator
- **SQL Injection Prevention**: TypeORM parameterized queries
- **CORS Configuration**: Cross-origin request handling
- **Helmet Integration**: Security headers for production
- **Request Sanitization**: Input cleaning and validation

## ⚡ Performance Optimizations

### Database Optimizations
- **Indexing**: Strategic indexes on frequently queried fields (email, project_id, etc.)
- **Connection Pooling**: Efficient database connection management
- **Eager Loading**: Optimized relationship loading to prevent N+1 queries
- **Pagination**: Built-in pagination for large datasets

### Application Performance
- **Background Jobs**: Bull queue for email sending and heavy operations
- **Caching Strategy**: Redis-based caching for frequently accessed data
- **Response Compression**: Gzip compression for API responses
- **Lazy Loading**: On-demand loading of heavy resources

## 🧪 Testing

### Running Tests

\`\`\`bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage report
npm run test:cov

# Watch mode for development
npm run test:watch
\`\`\`

### Test Structure
- **Unit Tests**: Individual service and controller testing
- **Integration Tests**: Module-level testing with database
- **E2E Tests**: Full application flow testing
- **Coverage Reports**: Detailed code coverage analysis

## 🚀 Production Deployment

### Environment Setup

1. **Build the application**:
\`\`\`bash
npm run build
\`\`\`

2. **Set production environment variables**:
\`\`\`env
NODE_ENV=production
DB_SSL=true
JWT_SECRET=production-secret-key
# ... other production configs
\`\`\`

3. **Start in production mode**:
\`\`\`bash
npm run start:prod
\`\`\`

### Docker Deployment

\`\`\`bash
# Build production image
docker build -t task-manager-backend .

# Run with docker-compose
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

### Cloud Deployment Options

#### Vercel (Recommended)
- Automatic deployments from Git
- Built-in PostgreSQL integration
- Environment variable management

#### AWS/Google Cloud/Azure
- Container deployment with Docker
- Managed database services
- Auto-scaling capabilities

## 🔧 Configuration

### Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Application environment | `development` | No |
| `PORT` | Server port | `3000` | No |
| `DB_HOST` | PostgreSQL host | `localhost` | Yes |
| `DB_PORT` | PostgreSQL port | `5432` | Yes |
| `DB_USERNAME` | Database username | - | Yes |
| `DB_PASSWORD` | Database password | - | Yes |
| `DB_DATABASE` | Database name | - | Yes |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | - | Yes |
| `JWT_REFRESH_SECRET` | Refresh token secret | - | Yes |
| `JWT_EXPIRES_IN` | JWT expiration time | `15m` | No |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | `7d` | No |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | - | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | - | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | - | Yes |
| `NODEMAILER_EMAIL` | SMTP email address | - | Yes |
| `NODEMAILER_PASSWORD` | SMTP password/app password | - | Yes |
| `NODEMAILER_HOST` | SMTP host | `smtp.gmail.com` | No |
| `NODEMAILER_PORT` | SMTP port | `587` | No |
| `REDIS_HOST` | Redis host | `localhost` | No |
| `REDIS_PORT` | Redis port | `6379` | No |

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Issues
\`\`\`bash
# Check PostgreSQL is running
docker ps | grep postgres

# Test database connection
psql -h localhost -U postgres -d task_manager
\`\`\`

#### JWT Token Issues
- Ensure JWT secrets are at least 32 characters long
- Check token expiration settings
- Verify refresh token implementation

#### File Upload Issues
- Verify Cloudinary credentials
- Check file size limits (default: 10MB)
- Ensure proper CORS configuration

#### Performance Issues
- Enable database query logging in development
- Monitor Redis connection for background jobs
- Check database indexes on frequently queried fields

### Debug Mode

Enable detailed logging:
\`\`\`env
NODE_ENV=development
LOG_LEVEL=debug
\`\`\`

### Health Checks

Monitor application health:
- `GET /health` - Basic health check
- `GET /health/database` - Database connectivity
- `GET /health/redis` - Redis connectivity (if configured)

## 📈 Monitoring & Logging

### Application Logging
- Structured logging with Winston
- Request/response logging
- Error tracking and stack traces
- Performance metrics

### Database Monitoring
- Query performance logging
- Connection pool monitoring
- Slow query identification

## 🤝 Contributing

### Development Setup

1. **Fork and clone the repository**
2. **Create a feature branch**:
\`\`\`bash
git checkout -b feature/your-feature-name
\`\`\`

3. **Make your changes and add tests**
4. **Run the test suite**:
\`\`\`bash
npm run test
npm run test:e2e
\`\`\`

5. **Submit a pull request**

### Code Standards
- Follow NestJS best practices
- Use TypeScript strict mode
- Write comprehensive tests
- Document new features
- Follow conventional commit messages

### Pull Request Guidelines
- Provide clear description of changes
- Include tests for new features
- Update documentation as needed
- Ensure all CI checks pass

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation
- Contact the development team

---

**Built with ❤️ using NestJS, PostgreSQL, and modern web technologies.**
