# Task Management System

A comprehensive full-stack task management application built with modern technologies, featuring real-time collaboration, project management, and team communication.

## 🚀 Features

### Core Functionality
- **Project Management**: Create, edit, and manage projects with detailed information
- **Task Management**: Comprehensive task tracking with status updates and progress monitoring
- **Issue Tracking**: Bug reporting and issue management system
- **Team Collaboration**: Multi-user project collaboration with role-based access
- **Real-time Chat**: Project-based messaging system for team communication
- **Calendar Integration**: Event scheduling and calendar management
- **Time Tracking**: Track time spent on tasks and projects
- **Progress Monitoring**: Real-time progress bars based on task completion status

### Advanced Features
- **Search & Filtering**: Advanced search across projects, tasks, and issues
- **Pagination**: Efficient data loading with pagination support
- **Notifications**: Real-time notification system for project updates
- **File Management**: Upload and manage project attachments
- **Responsive Design**: Mobile-friendly interface with modern UI/UX
- **Authentication**: Secure JWT-based authentication system
- **Role Management**: User roles and permissions system

## 🛠 Technology Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with refresh tokens
- **File Storage**: Cloudinary integration
- **Email Service**: Nodemailer with SMTP
- **API Documentation**: Swagger/OpenAPI
- **Validation**: Class-validator and class-transformer
- **Security**: Helmet, CORS, rate limiting with Throttler

### Frontend
- **Framework**: Next.js 14 (React)
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Icons**: React Icons (Feather Icons)
- **HTTP Client**: Axios with interceptors
- **Routing**: Next.js App Router
- **UI Components**: Custom components with Tailwind

### Database Schema
- **Users**: Authentication and profile management
- **Projects**: Project information and settings
- **Tasks**: Task details with status tracking
- **Issues**: Bug tracking and issue management
- **Messages**: Project-based chat system
- **Calendar Events**: Event scheduling
- **Comments**: Threaded commenting system
- **Notifications**: User notification system
- **Time Logs**: Time tracking records

## 📁 Project Structure

### Backend Structure
```
back/
├── src/
│   ├── entities/           # TypeORM entities
│   ├── modules/           # Feature modules
│   │   ├── auth/          # Authentication
│   │   ├── users/         # User management
│   │   ├── projects/      # Project management
│   │   ├── tasks/         # Task management
│   │   ├── issues/        # Issue tracking
│   │   ├── messages/      # Chat system
│   │   ├── comments/      # Comment system
│   │   ├── notifications/ # Notification system
│   │   └── ...
│   ├── calendar/          # Calendar module
│   ├── config/           # Configuration files
│   ├── common/           # Shared utilities
│   └── main.ts           # Application entry point
├── .env                  # Environment variables
└── package.json
```

### Frontend Structure
```
frontend/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── projects/     # Project pages
│   │   ├── tasks/        # Task pages
│   │   ├── chat/         # Chat pages
│   │   └── ...
│   ├── components/       # Reusable components
│   ├── redux/           # State management
│   │   ├── slices/      # Redux slices
│   │   └── store.ts     # Store configuration
│   ├── services/        # API services
│   ├── types/           # TypeScript types
│   ├── hooks/           # Custom React hooks
│   └── utils/           # Utility functions
├── public/              # Static assets
└── package.json
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- Cloudinary account (for file uploads)
- SMTP email service

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd task-management-system/back
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create a `.env` file in the backend directory:
```env
# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database"
DIRECT_URL="postgresql://username:password@host:port/database"

DB_HOST=your-db-host
DB_PORT=5432
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_DATABASE=your-database

# JWT Configuration
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration
NODEMAILER_EMAIL=your-email@gmail.com
NODEMAILER_PASSWORD=your-app-password
NODEMAILER_HOST=smtp.gmail.com
NODEMAILER_PORT=587

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com

# Application Configuration
PORT=3002
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=10

# Redis Configuration (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
```

4. **Database Setup**
```bash
# Run database migrations
npm run migration:run

# Start the development server
npm run start:dev
```

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3002
```

4. **Start the development server**
```bash
npm run dev
```

## 🚀 Deployment

### Backend Deployment (Render)

1. **Prepare for deployment**
   - Ensure all environment variables are set in Render dashboard
   - Database should be accessible from Render
   - Set `NODE_ENV=production`

2. **Build command**: `npm install && npm run build`
3. **Start command**: `npm run start:prod`

### Frontend Deployment (Vercel)

1. **Connect repository to Vercel**
2. **Set environment variables**:
3. **Deploy**: Vercel will automatically build and deploy

### Environment Variables for Production

**Backend (Render)**:
- All `.env` variables with production values
- Ensure `FRONTEND_URL` points to your Vercel domain
- Use production database credentials

**Frontend (Vercel)**:
- `NEXT_PUBLIC_API_URL`: Your backend URL on Render

## 🔐 Authentication Flow

1. **Registration**: Users register with email/password
2. **Login**: JWT access token (15min) + refresh token (7 days)
3. **Token Refresh**: Automatic token refresh using interceptors
4. **Protected Routes**: JWT validation on all protected endpoints

## 📊 Key Features Implementation

### Progress Tracking
- **Task Status Mapping**: 
  - `todo`: 0%
  - `in_progress`: 50%
  - `blocked`: 25%
  - `review`: 80%
  - `done`: 100%
- **Project Progress**: Calculated from completed vs total tasks

### Search & Pagination
- **Backend**: SQL LIKE queries with TypeORM query builder
- **Frontend**: Real-time search with debouncing
- **Pagination**: Page-based pagination with configurable limits

### Chat System
- **Project-based**: Messages are scoped to specific projects
- **Real-time UI**: Grouped by date with sender information
- **Permissions**: Only project members can send/view messages

### Notification System
- **Real-time**: Updates for project activities
- **Unread Count**: Badge showing unread notifications
- **Dropdown**: Quick access notification panel

## 🔧 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Token refresh
- `POST /auth/logout` - User logout

### Projects
- `GET /projects` - List projects (with search & pagination)
- `POST /projects` - Create project
- `GET /projects/:id` - Get project details
- `PATCH /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Tasks
- `GET /tasks` - List tasks (with search & pagination)
- `POST /tasks` - Create task
- `GET /tasks/:id` - Get task details
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

### Messages
- `POST /messages` - Send message
- `GET /messages/project/:projectId` - Get project messages
- `PUT /messages/:id` - Edit message
- `DELETE /messages/:id` - Delete message

### Calendar
- `GET /calendar/events` - List events
- `POST /calendar/events` - Create event
- `PATCH /calendar/events/:id` - Update event
- `DELETE /calendar/events/:id` - Delete event

## 🛡 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Rate Limiting**: Throttling to prevent abuse
- **CORS**: Configured for frontend domain
- **Input Validation**: Class-validator for all inputs
- **SQL Injection Prevention**: TypeORM query builder
- **XSS Protection**: Helmet middleware

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Mobile-first design approach
- **Dark/Light Theme**: Consistent color scheme
- **Interactive Elements**: Hover effects and transitions
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Success/error feedback

## 📱 Mobile Responsiveness

- **Breakpoints**: Tailwind CSS responsive utilities
- **Touch-friendly**: Optimized button sizes and spacing
- **Mobile Navigation**: Collapsible menus and layouts
- **Viewport Optimization**: Proper meta tags and scaling

## 🔄 State Management

- **Redux Toolkit**: Efficient state management
- **Async Thunks**: API call handling
- **Local Storage**: Persistent state storage
- **Error States**: Comprehensive error handling
- **Loading States**: UI feedback during operations

## 📈 Performance Optimizations

- **Code Splitting**: Next.js automatic code splitting
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: Component-level lazy loading
- **Caching**: API response caching
- **Bundle Analysis**: Webpack bundle analyzer

## 🧪 Testing & Quality

- **TypeScript**: Full type safety
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Validation**: Runtime validation with class-validator
- **Error Boundaries**: React error handling

## 📞 Support & Maintenance

For issues, feature requests, or deployment support:
1. Check the documentation above
2. Review environment variable configuration
3. Ensure database connectivity
4. Verify API endpoints are accessible
5. Check browser console for frontend errors

## 🔮 Future Enhancements

- **Real-time Updates**: WebSocket integration
- **Mobile App**: React Native implementation
- **Advanced Analytics**: Project metrics and reporting
- **Integration APIs**: Third-party service integrations
- **Advanced Permissions**: Granular role-based access
- **Workflow Automation**: Task automation rules
- **Advanced Search**: Full-text search with Elasticsearch

---

**Built with ❤️ using modern web technologies for efficient project management and team collaboration.**
