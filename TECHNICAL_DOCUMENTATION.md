# Technical Documentation - Task Management System

## Architecture Overview

This is a full-stack web application built with a modern microservices-inspired architecture, featuring a NestJS backend API and a Next.js frontend client.

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (Next.js)     │◄──►│   (NestJS)      │◄──►│  (PostgreSQL)   │
│   Port: 3000    │    │   Port: 3002    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel        │    │   Render        │    │   Supabase      │
│   (Deployment)  │    │   (Deployment)  │    │   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Backend Implementation (NestJS)

### Core Technologies
- **NestJS Framework**: Modular, scalable Node.js framework
- **TypeScript**: Full type safety and modern JavaScript features
- **TypeORM**: Object-Relational Mapping with PostgreSQL
- **JWT Authentication**: Secure token-based authentication
- **Class Validator**: Runtime validation and transformation
- **Swagger/OpenAPI**: Automatic API documentation

### Module Structure

#### 1. Authentication Module (`/modules/auth/`)
```typescript
// Key Components:
- AuthController: Login, register, refresh endpoints
- AuthService: Business logic for authentication
- JwtStrategy: JWT token validation strategy
- Guards: Route protection with JWT validation
- DTOs: Login, register, refresh token data structures
```

**Features:**
- JWT access tokens (15 minutes expiry)
- Refresh tokens (7 days expiry)
- Password hashing with bcrypt
- Role-based access control

#### 2. Users Module (`/modules/users/`)
```typescript
// Key Components:
- UsersController: User CRUD operations
- UsersService: User management business logic
- User Entity: Database schema definition
- Profile management and team relationships
```

**Features:**
- User profile management
- Team member relationships
- Avatar upload with Cloudinary
- User search and filtering

#### 3. Projects Module (`/modules/projects/`)
```typescript
// Key Components:
- ProjectsController: Project CRUD with search/pagination
- ProjectsService: Project business logic
- Project Entity: Project schema with relationships
- Progress calculation based on task completion
```

**Features:**
- Project lifecycle management
- Member assignment and permissions
- Real-time progress calculation
- Search functionality across name/description
- Pagination support

#### 4. Tasks Module (`/modules/tasks/`)
```typescript
// Key Components:
- TasksController: Task CRUD operations
- TasksService: Task management with status tracking
- Task Entity: Task schema with dependencies
- Progress mapping: status → percentage
```

**Progress Calculation Logic:**
```typescript
calculateProgressFromStatus(status: TaskStatus): number {
  const progressMap = {
    'todo': 0,
    'in_progress': 50,
    'blocked': 25,
    'review': 80,
    'done': 100
  };
  return progressMap[status] || 0;
}
```

#### 5. Messages Module (`/modules/messages/`)
```typescript
// Key Components:
- MessagesController: Chat message CRUD
- MessagesService: Message business logic with permissions
- Message Entity: Message schema with project relationships
- Real-time project-based messaging
```

**Features:**
- Project-scoped messaging
- Message editing and deletion
- File attachment support
- Permission validation (project members only)

#### 6. Calendar Module (`/calendar/`)
```typescript
// Key Components:
- CalendarController: Event management
- CalendarService: Event business logic with validation
- CalendarEvent Entity: Event schema
- Date validation and conflict checking
```

### Database Schema Design

#### Entity Relationships
```sql
Users (1) ──── (N) Projects (Owner)
Users (N) ──── (N) Projects (Members) [Many-to-Many]
Projects (1) ──── (N) Tasks
Projects (1) ──── (N) Messages
Projects (1) ──── (N) CalendarEvents
Users (1) ──── (N) Messages (Sender)
Tasks (1) ──── (N) Comments
Users (1) ──── (N) TimeLog
```

#### Key Entities

**User Entity:**
```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) email: string;
  @Column() name: string;
  @Column() password: string; // bcrypt hashed
  @Column({ type: 'enum', enum: UserRole }) role: UserRole;
  @OneToMany(() => Project, project => project.owner) ownedProjects: Project[];
  @ManyToMany(() => Project, project => project.members) projects: Project[];
  // ... other relationships
}
```

**Project Entity:**
```typescript
@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column('text', { nullable: true }) description: string;
  @Column({ type: 'enum', enum: Priority }) priority: Priority;
  @Column({ type: 'enum', enum: ProjectStatus }) status: ProjectStatus;
  @Column({ type: 'int', default: 0 }) progress: number;
  @ManyToOne(() => User, user => user.ownedProjects) owner: User;
  @ManyToMany(() => User, user => user.projects) members: User[];
  @OneToMany(() => Task, task => task.project) tasks: Task[];
  @OneToMany(() => Message, message => message.project) messages: Message[];
}
```

### API Design Patterns

#### RESTful Endpoints
```typescript
// Standard CRUD pattern for all resources
GET    /api/resource          // List with pagination/search
POST   /api/resource          // Create new resource
GET    /api/resource/:id      // Get single resource
PATCH  /api/resource/:id      // Update resource
DELETE /api/resource/:id      // Delete resource
```

#### Response Format
```typescript
// Standardized API response structure
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

// Paginated responses
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

#### Error Handling
```typescript
// Global exception filter
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Standardized error responses
    // Logging and monitoring
    // Security-safe error messages
  }
}
```

### Security Implementation

#### Authentication Flow
1. **Registration**: Password hashing with bcrypt (12 rounds)
2. **Login**: JWT token generation with user payload
3. **Token Validation**: JwtStrategy with passport
4. **Refresh**: Secure token refresh mechanism

#### Authorization Patterns
```typescript
// Route-level protection
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  
  // Method-level permission checking
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.projectsService.findOne(id, req.user.id);
  }
}
```

#### Data Validation
```typescript
// DTO validation with class-validator
export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsEnum(Priority)
  priority: Priority;
}
```

## Frontend Implementation (Next.js)

### Core Technologies
- **Next.js 14**: React framework with App Router
- **TypeScript**: Full type safety
- **Redux Toolkit**: State management with RTK Query
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client with interceptors

### Architecture Patterns

#### Component Structure
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group
│   ├── projects/          # Project pages
│   ├── tasks/             # Task pages
│   ├── chat/[projectId]/  # Dynamic chat routes
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form components
│   ├── projects/         # Project-specific components
│   └── tasks/            # Task-specific components
├── redux/                # State management
│   ├── slices/           # Feature slices
│   └── store.ts          # Store configuration
├── services/             # API services
├── types/                # TypeScript definitions
└── utils/                # Utility functions
```

#### State Management with Redux Toolkit

**Store Configuration:**
```typescript
export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    tasks: taskReducer,
    messages: messageReducer,
    notifications: notificationReducer,
    calendar: calendarReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // For Date objects
    }),
});
```

**Async Thunk Pattern:**
```typescript
export const fetchProjects = createAsyncThunk<
  { data: Project[]; totalCount: number },
  PaginationParams
>(
  'projects/fetchProjects',
  async (params, { rejectWithValue }) => {
    try {
      const response = await projectService.getAllProjects(params);
      return {
        data: response.data,
        totalCount: response.total
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

#### Service Layer Architecture

**API Service Pattern:**
```typescript
// Base API configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

// Request interceptor for auth tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token refresh logic
      await refreshToken();
      return api.request(error.config);
    }
    return Promise.reject(error);
  }
);
```

**Feature Service Example:**
```typescript
const projectService = {
  getAllProjects: async (params: any = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get<ApiResponse<PaginatedResponse<Project>>>(
      `/projects${queryString ? `?${queryString}` : ''}`
    );
    return response.data.data;
  },

  createProject: async (projectData: CreateProjectData) => {
    const response = await api.post<ApiResponse<Project>>('/projects', projectData);
    return response.data.data;
  },
  // ... other methods
};
```

### UI/UX Implementation

#### Design System
```typescript
// Tailwind configuration for consistent theming
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        // ... other colors
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
```

#### Component Patterns

**Compound Component Pattern:**
```typescript
// ProjectCard with multiple interactive elements
const ProjectCard = ({ project, onEdit }: ProjectCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/projects/${project.id}`);
  };

  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/chat/${project.id}`);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300" onClick={handleCardClick}>
      {/* Card content with interactive elements */}
    </div>
  );
};
```

**Form Handling Pattern:**
```typescript
const TaskForm = ({ task, onSubmit }: TaskFormProps) => {
  const [formData, setFormData] = useState<CreateTaskData>({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'todo',
    priority: task?.priority || 'medium',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (error) {
      // Error handling
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields */}
    </form>
  );
};
```

#### Responsive Design Implementation

**Mobile-First Approach:**
```css
/* Tailwind responsive utilities */
.container {
  @apply px-4 sm:px-6 lg:px-8; /* Progressive spacing */
}

.grid-responsive {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4; /* Responsive grid */
}

.text-responsive {
  @apply text-sm sm:text-base lg:text-lg; /* Responsive typography */
}
```

### Performance Optimizations

#### Code Splitting
```typescript
// Dynamic imports for heavy components
const ChatComponent = dynamic(() => import('@/components/chat/ChatComponent'), {
  loading: () => <ChatSkeleton />,
  ssr: false,
});

// Route-based code splitting (automatic with Next.js App Router)
```

#### Image Optimization
```typescript
import Image from 'next/image';

// Optimized image component
<Image
  src={user.avatar}
  alt={user.name}
  width={40}
  height={40}
  className="rounded-full"
  priority={false} // Lazy loading
/>
```

#### Caching Strategies
```typescript
// Redux state persistence
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'projects'], // Only persist specific slices
};

// API response caching
const cachedResponse = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);
```

### Error Handling & Loading States

#### Error Boundaries
```typescript
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

#### Loading States
```typescript
// Skeleton loading components
const ProjectSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
  </div>
);

// Loading state management
const ProjectList = () => {
  const { projects, isLoading, error } = useSelector((state: RootState) => state.projects);

  if (isLoading) return <ProjectSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};
```

## Data Flow Architecture

### Request/Response Cycle

1. **User Interaction** → Component event handler
2. **Action Dispatch** → Redux action creator
3. **Async Thunk** → API service call
4. **HTTP Request** → Backend controller
5. **Business Logic** → Service layer processing
6. **Database Query** → TypeORM entity operations
7. **Response** → Standardized API response
8. **State Update** → Redux slice reducer
9. **UI Re-render** → React component update

### Search & Pagination Flow

**Frontend Implementation:**
```typescript
const [searchQuery, setSearchQuery] = useState('');
const [currentPage, setCurrentPage] = useState(1);

useEffect(() => {
  dispatch(fetchProjects({
    search: searchQuery,
    page: currentPage,
    limit: 10
  }));
}, [searchQuery, currentPage, dispatch]);
```

**Backend Implementation:**
```typescript
async findAll(params: FindAllParams) {
  const queryBuilder = this.projectRepository.createQueryBuilder('project');
  
  if (params.search) {
    queryBuilder.where(
      'project.name ILIKE :search OR project.description ILIKE :search',
      { search: `%${params.search}%` }
    );
  }
  
  const [projects, total] = await queryBuilder
    .skip((params.page - 1) * params.limit)
    .take(params.limit)
    .getManyAndCount();
    
  return {
    data: projects,
    total,
    page: params.page,
    limit: params.limit,
    totalPages: Math.ceil(total / params.limit)
  };
}
```

## Security Architecture

### Authentication Security
- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Security**: Short-lived access tokens with secure refresh mechanism
- **Token Storage**: httpOnly cookies for refresh tokens (production)
- **CSRF Protection**: SameSite cookie attributes

### Authorization Patterns
- **Route Guards**: JWT validation on protected routes
- **Resource Ownership**: User can only access owned/member resources
- **Role-Based Access**: Different permissions for different user roles

### Input Validation
- **Backend**: Class-validator with DTO validation
- **Frontend**: Form validation with real-time feedback
- **SQL Injection**: TypeORM query builder prevents injection
- **XSS Protection**: Helmet middleware and input sanitization

### Rate Limiting
```typescript
// Throttler configuration
@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 10,  // 10 requests per minute
    }]),
  ],
})
```

## Deployment Architecture

### Development Environment
```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./back
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=development
    depends_on:
      - postgres
      
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3002
      
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: taskmanagement
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
```

### Production Deployment

**Backend (Render):**
- **Build**: `npm install && npm run build`
- **Start**: `npm run start:prod`
- **Health Check**: `/health` endpoint
- **Environment**: Production environment variables

**Frontend (Vercel):**
- **Build**: Automatic Next.js build
- **Deploy**: Edge network deployment
- **Environment**: `NEXT_PUBLIC_API_URL` pointing to Render backend

**Database (Supabase):**
- **PostgreSQL**: Managed database service
- **Connection Pooling**: Built-in connection management
- **Backups**: Automatic daily backups

## Monitoring & Observability

### Logging Strategy
```typescript
// Structured logging
import { Logger } from '@nestjs/common';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  async create(createProjectDto: CreateProjectDto, userId: string) {
    this.logger.log(`Creating project: ${createProjectDto.name} for user: ${userId}`);
    try {
      const project = await this.projectRepository.save({
        ...createProjectDto,
        ownerId: userId
      });
      this.logger.log(`Project created successfully: ${project.id}`);
      return project;
    } catch (error) {
      this.logger.error(`Failed to create project: ${error.message}`, error.stack);
      throw error;
    }
  }
}
```

### Error Tracking
- **Backend**: Global exception filter with structured error logging
- **Frontend**: Error boundaries with error reporting
- **API Monitoring**: Response time and error rate tracking

### Performance Metrics
- **Database**: Query performance monitoring
- **API**: Response time tracking
- **Frontend**: Core Web Vitals monitoring
- **User Experience**: Error rate and success metrics

This technical documentation provides a comprehensive overview of the system architecture, implementation patterns, and deployment strategies used in the Task Management System.
