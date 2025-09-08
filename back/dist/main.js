/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.module.ts":
/*!***************************!*\
  !*** ./src/app.module.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const throttler_1 = __webpack_require__(/*! @nestjs/throttler */ "@nestjs/throttler");
const bull_1 = __webpack_require__(/*! @nestjs/bull */ "@nestjs/bull");
const auth_module_1 = __webpack_require__(/*! ./modules/auth/auth.module */ "./src/modules/auth/auth.module.ts");
const users_module_1 = __webpack_require__(/*! ./modules/users/users.module */ "./src/modules/users/users.module.ts");
const projects_module_1 = __webpack_require__(/*! ./modules/projects/projects.module */ "./src/modules/projects/projects.module.ts");
const tasks_module_1 = __webpack_require__(/*! ./modules/tasks/tasks.module */ "./src/modules/tasks/tasks.module.ts");
const issues_module_1 = __webpack_require__(/*! ./modules/issues/issues.module */ "./src/modules/issues/issues.module.ts");
const comments_module_1 = __webpack_require__(/*! ./modules/comments/comments.module */ "./src/modules/comments/comments.module.ts");
const notifications_module_1 = __webpack_require__(/*! ./modules/notifications/notifications.module */ "./src/modules/notifications/notifications.module.ts");
const time_tracking_module_1 = __webpack_require__(/*! ./modules/time-tracking/time-tracking.module */ "./src/modules/time-tracking/time-tracking.module.ts");
const reports_module_1 = __webpack_require__(/*! ./modules/reports/reports.module */ "./src/modules/reports/reports.module.ts");
const webhooks_module_1 = __webpack_require__(/*! ./modules/webhooks/webhooks.module */ "./src/modules/webhooks/webhooks.module.ts");
const invitations_module_1 = __webpack_require__(/*! ./modules/invitations/invitations.module */ "./src/modules/invitations/invitations.module.ts");
const database_config_1 = __webpack_require__(/*! ./config/database.config */ "./src/config/database.config.ts");
const cloudinary_config_1 = __webpack_require__(/*! ./config/cloudinary.config */ "./src/config/cloudinary.config.ts");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ".env",
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: database_config_1.databaseConfig,
                inject: [config_1.ConfigService],
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 120000,
                    limit: 40,
                },
            ]),
            bull_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => {
                    const redisUrl = configService.get("REDIS_URL");
                    if (redisUrl) {
                        return {
                            redis: redisUrl,
                        };
                    }
                    return {
                        redis: {
                            host: configService.get("REDIS_HOST") || "localhost",
                            port: configService.get("REDIS_PORT") || 6379,
                            maxRetriesPerRequest: null,
                            connectTimeout: 10000,
                            retryStrategy: (times) => {
                                const delay = Math.min(times * 50, 2000);
                                return delay;
                            },
                        },
                    };
                },
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            projects_module_1.ProjectsModule,
            tasks_module_1.TasksModule,
            issues_module_1.IssuesModule,
            comments_module_1.CommentsModule,
            notifications_module_1.NotificationsModule,
            time_tracking_module_1.TimeTrackingModule,
            reports_module_1.ReportsModule,
            webhooks_module_1.WebhooksModule,
            invitations_module_1.InvitationsModule,
        ],
        providers: [
            {
                provide: "CLOUDINARY_CONFIG",
                useFactory: cloudinary_config_1.cloudinaryConfig,
                inject: [config_1.ConfigService],
            },
        ],
    })
], AppModule);


/***/ }),

/***/ "./src/common/decorators/public.decorator.ts":
/*!***************************************************!*\
  !*** ./src/common/decorators/public.decorator.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Public = exports.IS_PUBLIC_KEY = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
exports.IS_PUBLIC_KEY = "isPublic";
const Public = () => (0, common_1.SetMetadata)(exports.IS_PUBLIC_KEY, true);
exports.Public = Public;


/***/ }),

/***/ "./src/common/decorators/roles.decorator.ts":
/*!**************************************************!*\
  !*** ./src/common/decorators/roles.decorator.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
exports.ROLES_KEY = "roles";
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;


/***/ }),

/***/ "./src/common/dtos/pagination.dto.ts":
/*!*******************************************!*\
  !*** ./src/common/dtos/pagination.dto.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaginationDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class PaginationDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
    }
}
exports.PaginationDto = PaginationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 1, minimum: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PaginationDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 10, minimum: 1, maximum: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PaginationDto.prototype, "limit", void 0);


/***/ }),

/***/ "./src/common/enums/index.ts":
/*!***********************************!*\
  !*** ./src/common/enums/index.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationType = exports.UserRole = exports.IssueSeverity = exports.IssueStatus = exports.Priority = exports.TaskStatus = void 0;
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["TODO"] = "todo";
    TaskStatus["IN_PROGRESS"] = "in_progress";
    TaskStatus["BLOCKED"] = "blocked";
    TaskStatus["REVIEW"] = "review";
    TaskStatus["DONE"] = "done";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var Priority;
(function (Priority) {
    Priority["LOW"] = "low";
    Priority["MEDIUM"] = "medium";
    Priority["HIGH"] = "high";
})(Priority || (exports.Priority = Priority = {}));
var IssueStatus;
(function (IssueStatus) {
    IssueStatus["OPEN"] = "open";
    IssueStatus["IN_PROGRESS"] = "in_progress";
    IssueStatus["CLOSED"] = "closed";
})(IssueStatus || (exports.IssueStatus = IssueStatus = {}));
var IssueSeverity;
(function (IssueSeverity) {
    IssueSeverity["LOW"] = "low";
    IssueSeverity["MEDIUM"] = "medium";
    IssueSeverity["HIGH"] = "high";
    IssueSeverity["CRITICAL"] = "critical";
})(IssueSeverity || (exports.IssueSeverity = IssueSeverity = {}));
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["MANAGER"] = "manager";
    UserRole["CONTRIBUTOR"] = "contributor";
    UserRole["VIEWER"] = "viewer";
})(UserRole || (exports.UserRole = UserRole = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["TASK_ASSIGNED"] = "task_assigned";
    NotificationType["TASK_UPDATED"] = "task_updated";
    NotificationType["COMMENT_ADDED"] = "comment_added";
    NotificationType["DEADLINE_REMINDER"] = "deadline_reminder";
    NotificationType["MENTION"] = "mention";
    NotificationType["PROJECT_MEMBER_ADDED"] = "project_member_added";
})(NotificationType || (exports.NotificationType = NotificationType = {}));


/***/ }),

/***/ "./src/common/filters/global-exception.filter.ts":
/*!*******************************************************!*\
  !*** ./src/common/filters/global-exception.filter.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GlobalExceptionFilter_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GlobalExceptionFilter = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let GlobalExceptionFilter = GlobalExceptionFilter_1 = class GlobalExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(GlobalExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = "Internal server error";
        let errors = null;
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === "object") {
                message = exceptionResponse.message || exception.message;
                errors = exceptionResponse.errors || null;
            }
            else {
                message = exceptionResponse;
            }
        }
        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message,
            ...(errors && { errors }),
        };
        this.logger.error(`${request.method} ${request.url} - ${status} - ${message}`, exception instanceof Error ? exception.stack : "Unknown error");
        response.status(status).json(errorResponse);
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = GlobalExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);


/***/ }),

/***/ "./src/common/guards/roles.guard.ts":
/*!******************************************!*\
  !*** ./src/common/guards/roles.guard.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const roles_decorator_1 = __webpack_require__(/*! ../decorators/roles.decorator */ "./src/common/decorators/roles.decorator.ts");
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        return requiredRoles.some((role) => user.role === role);
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], RolesGuard);


/***/ }),

/***/ "./src/common/interceptors/logging.interceptor.ts":
/*!********************************************************!*\
  !*** ./src/common/interceptors/logging.interceptor.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LoggingInterceptor_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoggingInterceptor = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const operators_1 = __webpack_require__(/*! rxjs/operators */ "rxjs/operators");
let LoggingInterceptor = LoggingInterceptor_1 = class LoggingInterceptor {
    constructor() {
        this.logger = new common_1.Logger(LoggingInterceptor_1.name);
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url, body, query, params } = request;
        const now = Date.now();
        this.logger.log(`Incoming Request: ${method} ${url} - Body: ${JSON.stringify(body)} - Query: ${JSON.stringify(query)} - Params: ${JSON.stringify(params)}`);
        return next.handle().pipe((0, operators_1.tap)(() => {
            const responseTime = Date.now() - now;
            this.logger.log(`Outgoing Response: ${method} ${url} - ${responseTime}ms`);
        }));
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = LoggingInterceptor_1 = __decorate([
    (0, common_1.Injectable)()
], LoggingInterceptor);


/***/ }),

/***/ "./src/common/interceptors/response.interceptor.ts":
/*!*********************************************************!*\
  !*** ./src/common/interceptors/response.interceptor.ts ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResponseInterceptor = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const operators_1 = __webpack_require__(/*! rxjs/operators */ "rxjs/operators");
let ResponseInterceptor = class ResponseInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.map)((data) => ({
            success: true,
            data,
            timestamp: new Date().toISOString(),
        })));
    }
};
exports.ResponseInterceptor = ResponseInterceptor;
exports.ResponseInterceptor = ResponseInterceptor = __decorate([
    (0, common_1.Injectable)()
], ResponseInterceptor);


/***/ }),

/***/ "./src/config/cloudinary.config.ts":
/*!*****************************************!*\
  !*** ./src/config/cloudinary.config.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.cloudinaryConfig = void 0;
const cloudinary_1 = __webpack_require__(/*! cloudinary */ "cloudinary");
const cloudinaryConfig = (configService) => {
    cloudinary_1.v2.config({
        cloud_name: configService.get("CLOUDINARY_CLOUD_NAME"),
        api_key: configService.get("CLOUDINARY_API_KEY"),
        api_secret: configService.get("CLOUDINARY_API_SECRET"),
    });
    return cloudinary_1.v2;
};
exports.cloudinaryConfig = cloudinaryConfig;


/***/ }),

/***/ "./src/config/database.config.ts":
/*!***************************************!*\
  !*** ./src/config/database.config.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.databaseConfig = void 0;
const user_entity_1 = __webpack_require__(/*! ../entities/user.entity */ "./src/entities/user.entity.ts");
const pending_registration_entity_1 = __webpack_require__(/*! ../entities/pending-registration.entity */ "./src/entities/pending-registration.entity.ts");
const project_entity_1 = __webpack_require__(/*! ../entities/project.entity */ "./src/entities/project.entity.ts");
const project_invitation_entity_1 = __webpack_require__(/*! ../entities/project-invitation.entity */ "./src/entities/project-invitation.entity.ts");
const task_entity_1 = __webpack_require__(/*! ../entities/task.entity */ "./src/entities/task.entity.ts");
const issue_entity_1 = __webpack_require__(/*! ../entities/issue.entity */ "./src/entities/issue.entity.ts");
const comment_entity_1 = __webpack_require__(/*! ../entities/comment.entity */ "./src/entities/comment.entity.ts");
const notification_log_entity_1 = __webpack_require__(/*! ../entities/notification-log.entity */ "./src/entities/notification-log.entity.ts");
const time_log_entity_1 = __webpack_require__(/*! ../entities/time-log.entity */ "./src/entities/time-log.entity.ts");
const audit_log_entity_1 = __webpack_require__(/*! ../entities/audit-log.entity */ "./src/entities/audit-log.entity.ts");
const webhook_entity_1 = __webpack_require__(/*! ../entities/webhook.entity */ "./src/entities/webhook.entity.ts");
const databaseConfig = (configService) => {
    const nodeEnv = configService.get('NODE_ENV');
    const isDevMode = nodeEnv === 'development';
    const directUrl = configService.get('DIRECT_URL');
    const databaseUrl = configService.get('DATABASE_URL');
    const commonConfig = {
        entities: [
            user_entity_1.User,
            pending_registration_entity_1.PendingRegistration,
            project_entity_1.Project,
            project_invitation_entity_1.ProjectInvitation,
            task_entity_1.Task,
            issue_entity_1.Issue,
            comment_entity_1.Comment,
            notification_log_entity_1.NotificationLog,
            time_log_entity_1.TimeLog,
            audit_log_entity_1.AuditLog,
            webhook_entity_1.Webhook,
        ],
        synchronize: isDevMode,
        logging: ['error', 'schema', 'migration'],
        logger: 'advanced-console',
        retryAttempts: isDevMode ? 1 : 5,
        retryDelay: 3000,
        keepConnectionAlive: true,
    };
    if (directUrl) {
        return {
            type: 'postgres',
            url: directUrl,
            ...commonConfig,
        };
    }
    if (databaseUrl) {
        return {
            type: 'postgres',
            url: databaseUrl,
            ...commonConfig,
            ssl: {
                rejectUnauthorized: false,
            },
        };
    }
    if (isDevMode) {
        console.log('Using PostgreSQL database for development');
    }
    return {
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_DATABASE', 'task_manager'),
        ...commonConfig,
    };
};
exports.databaseConfig = databaseConfig;


/***/ }),

/***/ "./src/entities/audit-log.entity.ts":
/*!******************************************!*\
  !*** ./src/entities/audit-log.entity.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuditLog = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const user_entity_1 = __webpack_require__(/*! ./user.entity */ "./src/entities/user.entity.ts");
let AuditLog = class AuditLog {
};
exports.AuditLog = AuditLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], AuditLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AuditLog.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AuditLog.prototype, "entityType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AuditLog.prototype, "entityId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", typeof (_a = typeof Record !== "undefined" && Record) === "function" ? _a : Object)
], AuditLog.prototype, "oldValues", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", typeof (_b = typeof Record !== "undefined" && Record) === "function" ? _b : Object)
], AuditLog.prototype, "newValues", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "inet", nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], AuditLog.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    __metadata("design:type", typeof (_d = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _d : Object)
], AuditLog.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "userId", void 0);
exports.AuditLog = AuditLog = __decorate([
    (0, typeorm_1.Entity)("audit_logs"),
    (0, typeorm_1.Index)(["user"]),
    (0, typeorm_1.Index)(["entityType"]),
    (0, typeorm_1.Index)(["action"]),
    (0, typeorm_1.Index)(["timestamp"])
], AuditLog);


/***/ }),

/***/ "./src/entities/comment.entity.ts":
/*!****************************************!*\
  !*** ./src/entities/comment.entity.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Comment = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const user_entity_1 = __webpack_require__(/*! ./user.entity */ "./src/entities/user.entity.ts");
const project_entity_1 = __webpack_require__(/*! ./project.entity */ "./src/entities/project.entity.ts");
const task_entity_1 = __webpack_require__(/*! ./task.entity */ "./src/entities/task.entity.ts");
const issue_entity_1 = __webpack_require__(/*! ./issue.entity */ "./src/entities/issue.entity.ts");
let Comment = class Comment {
};
exports.Comment = Comment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Comment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Comment.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-array", { nullable: true }),
    __metadata("design:type", Array)
], Comment.prototype, "mentions", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-array", { nullable: true }),
    __metadata("design:type", Array)
], Comment.prototype, "attachments", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Comment.prototype, "isEdited", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Comment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Comment.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.comments),
    __metadata("design:type", typeof (_c = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _c : Object)
], Comment.prototype, "author", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Comment.prototype, "authorId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => project_entity_1.Project, (project) => project.comments, { nullable: true }),
    __metadata("design:type", typeof (_d = typeof project_entity_1.Project !== "undefined" && project_entity_1.Project) === "function" ? _d : Object)
], Comment.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Comment.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => task_entity_1.Task, (task) => task.comments, { nullable: true }),
    __metadata("design:type", typeof (_e = typeof task_entity_1.Task !== "undefined" && task_entity_1.Task) === "function" ? _e : Object)
], Comment.prototype, "task", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Comment.prototype, "taskId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => issue_entity_1.Issue, (issue) => issue.comments, { nullable: true }),
    __metadata("design:type", typeof (_f = typeof issue_entity_1.Issue !== "undefined" && issue_entity_1.Issue) === "function" ? _f : Object)
], Comment.prototype, "issue", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Comment.prototype, "issueId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Comment, (comment) => comment.replies, { nullable: true }),
    __metadata("design:type", Comment)
], Comment.prototype, "parentComment", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Comment.prototype, "parentCommentId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Comment, (comment) => comment.parentComment),
    __metadata("design:type", Array)
], Comment.prototype, "replies", void 0);
exports.Comment = Comment = __decorate([
    (0, typeorm_1.Entity)("comments")
], Comment);


/***/ }),

/***/ "./src/entities/issue.entity.ts":
/*!**************************************!*\
  !*** ./src/entities/issue.entity.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Issue = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const enums_1 = __webpack_require__(/*! ../common/enums */ "./src/common/enums/index.ts");
const user_entity_1 = __webpack_require__(/*! ./user.entity */ "./src/entities/user.entity.ts");
const project_entity_1 = __webpack_require__(/*! ./project.entity */ "./src/entities/project.entity.ts");
const comment_entity_1 = __webpack_require__(/*! ./comment.entity */ "./src/entities/comment.entity.ts");
let Issue = class Issue {
};
exports.Issue = Issue;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Issue.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Issue.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Issue.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: enums_1.IssueStatus,
        default: enums_1.IssueStatus.OPEN,
    }),
    __metadata("design:type", typeof (_a = typeof enums_1.IssueStatus !== "undefined" && enums_1.IssueStatus) === "function" ? _a : Object)
], Issue.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: enums_1.IssueSeverity,
        default: enums_1.IssueSeverity.MEDIUM,
    }),
    __metadata("design:type", typeof (_b = typeof enums_1.IssueSeverity !== "undefined" && enums_1.IssueSeverity) === "function" ? _b : Object)
], Issue.prototype, "severity", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-array", { nullable: true }),
    __metadata("design:type", Array)
], Issue.prototype, "attachments", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Issue.prototype, "stepsToReproduce", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Issue.prototype, "expectedBehavior", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Issue.prototype, "actualBehavior", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-array", { nullable: true }),
    __metadata("design:type", Array)
], Issue.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Issue.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Issue.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Issue.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.assignedIssues, { nullable: true }),
    __metadata("design:type", typeof (_e = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _e : Object)
], Issue.prototype, "assignee", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Issue.prototype, "assigneeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => project_entity_1.Project, (project) => project.issues),
    __metadata("design:type", typeof (_f = typeof project_entity_1.Project !== "undefined" && project_entity_1.Project) === "function" ? _f : Object)
], Issue.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Issue.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    __metadata("design:type", typeof (_g = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _g : Object)
], Issue.prototype, "reporter", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Issue.prototype, "reporterId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => comment_entity_1.Comment, (comment) => comment.issue),
    __metadata("design:type", Array)
], Issue.prototype, "comments", void 0);
exports.Issue = Issue = __decorate([
    (0, typeorm_1.Entity)("issues"),
    (0, typeorm_1.Index)(["status"]),
    (0, typeorm_1.Index)(["severity"]),
    (0, typeorm_1.Index)(["project"])
], Issue);


/***/ }),

/***/ "./src/entities/notification-log.entity.ts":
/*!*************************************************!*\
  !*** ./src/entities/notification-log.entity.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationLog = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const enums_1 = __webpack_require__(/*! ../common/enums */ "./src/common/enums/index.ts");
const user_entity_1 = __webpack_require__(/*! ./user.entity */ "./src/entities/user.entity.ts");
let NotificationLog = class NotificationLog {
};
exports.NotificationLog = NotificationLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], NotificationLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NotificationLog.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: enums_1.NotificationType,
    }),
    __metadata("design:type", typeof (_a = typeof enums_1.NotificationType !== "undefined" && enums_1.NotificationType) === "function" ? _a : Object)
], NotificationLog.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", typeof (_b = typeof Record !== "undefined" && Record) === "function" ? _b : Object)
], NotificationLog.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], NotificationLog.prototype, "read", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], NotificationLog.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.notifications),
    __metadata("design:type", typeof (_d = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _d : Object)
], NotificationLog.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NotificationLog.prototype, "userId", void 0);
exports.NotificationLog = NotificationLog = __decorate([
    (0, typeorm_1.Entity)("notification_logs"),
    (0, typeorm_1.Index)(["user"]),
    (0, typeorm_1.Index)(["read"])
], NotificationLog);


/***/ }),

/***/ "./src/entities/pending-registration.entity.ts":
/*!*****************************************************!*\
  !*** ./src/entities/pending-registration.entity.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PendingRegistration = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
let PendingRegistration = class PendingRegistration {
};
exports.PendingRegistration = PendingRegistration;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PendingRegistration.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], PendingRegistration.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PendingRegistration.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PendingRegistration.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PendingRegistration.prototype, "otpCode", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], PendingRegistration.prototype, "otpExpires", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], PendingRegistration.prototype, "createdAt", void 0);
exports.PendingRegistration = PendingRegistration = __decorate([
    (0, typeorm_1.Entity)('pending_registrations'),
    (0, typeorm_1.Index)(['email'], { unique: true })
], PendingRegistration);


/***/ }),

/***/ "./src/entities/project-invitation.entity.ts":
/*!***************************************************!*\
  !*** ./src/entities/project-invitation.entity.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProjectInvitation = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const project_entity_1 = __webpack_require__(/*! ./project.entity */ "./src/entities/project.entity.ts");
const user_entity_1 = __webpack_require__(/*! ./user.entity */ "./src/entities/user.entity.ts");
let ProjectInvitation = class ProjectInvitation {
};
exports.ProjectInvitation = ProjectInvitation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProjectInvitation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProjectInvitation.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['pending', 'accepted', 'declined', 'expired'],
        default: 'pending',
    }),
    __metadata("design:type", String)
], ProjectInvitation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProjectInvitation.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], ProjectInvitation.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => project_entity_1.Project, { onDelete: 'CASCADE' }),
    __metadata("design:type", typeof (_b = typeof project_entity_1.Project !== "undefined" && project_entity_1.Project) === "function" ? _b : Object)
], ProjectInvitation.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProjectInvitation.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    __metadata("design:type", typeof (_c = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _c : Object)
], ProjectInvitation.prototype, "invitedBy", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProjectInvitation.prototype, "invitedById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    __metadata("design:type", typeof (_d = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _d : Object)
], ProjectInvitation.prototype, "acceptedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProjectInvitation.prototype, "acceptedById", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], ProjectInvitation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_f = typeof Date !== "undefined" && Date) === "function" ? _f : Object)
], ProjectInvitation.prototype, "updatedAt", void 0);
exports.ProjectInvitation = ProjectInvitation = __decorate([
    (0, typeorm_1.Entity)('project_invitations'),
    (0, typeorm_1.Index)(['email', 'project'])
], ProjectInvitation);


/***/ }),

/***/ "./src/entities/project.entity.ts":
/*!****************************************!*\
  !*** ./src/entities/project.entity.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Project = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const enums_1 = __webpack_require__(/*! ../common/enums */ "./src/common/enums/index.ts");
const user_entity_1 = __webpack_require__(/*! ./user.entity */ "./src/entities/user.entity.ts");
const task_entity_1 = __webpack_require__(/*! ./task.entity */ "./src/entities/task.entity.ts");
const issue_entity_1 = __webpack_require__(/*! ./issue.entity */ "./src/entities/issue.entity.ts");
const comment_entity_1 = __webpack_require__(/*! ./comment.entity */ "./src/entities/comment.entity.ts");
let Project = class Project {
};
exports.Project = Project;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Project.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Project.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Project.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.Priority,
        default: enums_1.Priority.MEDIUM,
    }),
    __metadata("design:type", typeof (_c = typeof enums_1.Priority !== "undefined" && enums_1.Priority) === "function" ? _c : Object)
], Project.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['not_started', 'in_progress', 'completed', 'on_hold'],
        default: 'not_started',
    }),
    __metadata("design:type", String)
], Project.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { nullable: true }),
    __metadata("design:type", Array)
], Project.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Project.prototype, "progress", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Project.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Project.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], Project.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.ownedProjects),
    __metadata("design:type", typeof (_f = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _f : Object)
], Project.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "ownerId", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User, (user) => user.projects),
    (0, typeorm_1.JoinTable)({
        name: 'project_members',
        joinColumn: { name: 'projectId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Project.prototype, "members", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => task_entity_1.Task, (task) => task.project),
    __metadata("design:type", Array)
], Project.prototype, "tasks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => issue_entity_1.Issue, (issue) => issue.project),
    __metadata("design:type", Array)
], Project.prototype, "issues", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => comment_entity_1.Comment, (comment) => comment.project),
    __metadata("design:type", Array)
], Project.prototype, "comments", void 0);
exports.Project = Project = __decorate([
    (0, typeorm_1.Entity)('projects'),
    (0, typeorm_1.Index)(['owner'])
], Project);


/***/ }),

/***/ "./src/entities/task.entity.ts":
/*!*************************************!*\
  !*** ./src/entities/task.entity.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Task = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const enums_1 = __webpack_require__(/*! ../common/enums */ "./src/common/enums/index.ts");
const user_entity_1 = __webpack_require__(/*! ./user.entity */ "./src/entities/user.entity.ts");
const project_entity_1 = __webpack_require__(/*! ./project.entity */ "./src/entities/project.entity.ts");
const comment_entity_1 = __webpack_require__(/*! ./comment.entity */ "./src/entities/comment.entity.ts");
const time_log_entity_1 = __webpack_require__(/*! ./time-log.entity */ "./src/entities/time-log.entity.ts");
let Task = class Task {
};
exports.Task = Task;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Task.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Task.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: enums_1.TaskStatus,
        default: enums_1.TaskStatus.TODO,
    }),
    __metadata("design:type", typeof (_a = typeof enums_1.TaskStatus !== "undefined" && enums_1.TaskStatus) === "function" ? _a : Object)
], Task.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: enums_1.Priority,
        default: enums_1.Priority.MEDIUM,
    }),
    __metadata("design:type", typeof (_b = typeof enums_1.Priority !== "undefined" && enums_1.Priority) === "function" ? _b : Object)
], Task.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Task.prototype, "progress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Task.prototype, "deadline", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Number)
], Task.prototype, "estimatedHours", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-array", { nullable: true }),
    __metadata("design:type", Array)
], Task.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-array", { nullable: true }),
    __metadata("design:type", Array)
], Task.prototype, "attachments", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Task.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Task.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], Task.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.assignedTasks, { nullable: true }),
    __metadata("design:type", typeof (_f = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _f : Object)
], Task.prototype, "assignee", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "assigneeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => project_entity_1.Project, (project) => project.tasks),
    __metadata("design:type", typeof (_g = typeof project_entity_1.Project !== "undefined" && project_entity_1.Project) === "function" ? _g : Object)
], Task.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Task.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Task, (task) => task.subtasks, { nullable: true }),
    __metadata("design:type", Task)
], Task.prototype, "parentTask", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "parentTaskId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Task, (task) => task.parentTask),
    __metadata("design:type", Array)
], Task.prototype, "subtasks", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Task, (task) => task.dependentTasks),
    (0, typeorm_1.JoinTable)({
        name: "task_dependencies",
        joinColumn: { name: "taskId", referencedColumnName: "id" },
        inverseJoinColumn: { name: "dependsOnId", referencedColumnName: "id" },
    }),
    __metadata("design:type", Array)
], Task.prototype, "dependencies", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Task, (task) => task.dependencies),
    __metadata("design:type", Array)
], Task.prototype, "dependentTasks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => comment_entity_1.Comment, (comment) => comment.task),
    __metadata("design:type", Array)
], Task.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => time_log_entity_1.TimeLog, (timeLog) => timeLog.task),
    __metadata("design:type", Array)
], Task.prototype, "timeLogs", void 0);
exports.Task = Task = __decorate([
    (0, typeorm_1.Entity)("tasks"),
    (0, typeorm_1.Index)(["status"]),
    (0, typeorm_1.Index)(["assignee"]),
    (0, typeorm_1.Index)(["project"])
], Task);


/***/ }),

/***/ "./src/entities/time-log.entity.ts":
/*!*****************************************!*\
  !*** ./src/entities/time-log.entity.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TimeLog = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const user_entity_1 = __webpack_require__(/*! ./user.entity */ "./src/entities/user.entity.ts");
const task_entity_1 = __webpack_require__(/*! ./task.entity */ "./src/entities/task.entity.ts");
let TimeLog = class TimeLog {
};
exports.TimeLog = TimeLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], TimeLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp" }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], TimeLog.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], TimeLog.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: true }),
    __metadata("design:type", Number)
], TimeLog.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], TimeLog.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], TimeLog.prototype, "isRunning", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], TimeLog.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], TimeLog.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.timeLogs),
    __metadata("design:type", typeof (_e = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _e : Object)
], TimeLog.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TimeLog.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => task_entity_1.Task, (task) => task.timeLogs),
    __metadata("design:type", typeof (_f = typeof task_entity_1.Task !== "undefined" && task_entity_1.Task) === "function" ? _f : Object)
], TimeLog.prototype, "task", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TimeLog.prototype, "taskId", void 0);
exports.TimeLog = TimeLog = __decorate([
    (0, typeorm_1.Entity)("time_logs"),
    (0, typeorm_1.Index)(["user"]),
    (0, typeorm_1.Index)(["task"]),
    (0, typeorm_1.Index)(["startTime"])
], TimeLog);


/***/ }),

/***/ "./src/entities/user.entity.ts":
/*!*************************************!*\
  !*** ./src/entities/user.entity.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.User = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");
const enums_1 = __webpack_require__(/*! ../common/enums */ "./src/common/enums/index.ts");
const project_entity_1 = __webpack_require__(/*! ./project.entity */ "./src/entities/project.entity.ts");
const task_entity_1 = __webpack_require__(/*! ./task.entity */ "./src/entities/task.entity.ts");
const issue_entity_1 = __webpack_require__(/*! ./issue.entity */ "./src/entities/issue.entity.ts");
const comment_entity_1 = __webpack_require__(/*! ./comment.entity */ "./src/entities/comment.entity.ts");
const notification_log_entity_1 = __webpack_require__(/*! ./notification-log.entity */ "./src/entities/notification-log.entity.ts");
const time_log_entity_1 = __webpack_require__(/*! ./time-log.entity */ "./src/entities/time-log.entity.ts");
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.UserRole,
        default: enums_1.UserRole.CONTRIBUTOR,
    }),
    __metadata("design:type", typeof (_a = typeof enums_1.UserRole !== "undefined" && enums_1.UserRole) === "function" ? _a : Object)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "bio", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "skills", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", typeof (_b = typeof Record !== "undefined" && Record) === "function" ? _b : Object)
], User.prototype, "availability", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "refreshToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "resetPasswordToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], User.prototype, "resetPasswordExpires", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "otpCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], User.prototype, "otpExpires", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isEmailVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "emailVerificationToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], User.prototype, "emailVerificationExpires", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_f = typeof Date !== "undefined" && Date) === "function" ? _f : Object)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_g = typeof Date !== "undefined" && Date) === "function" ? _g : Object)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => project_entity_1.Project, (project) => project.owner),
    __metadata("design:type", Array)
], User.prototype, "ownedProjects", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => project_entity_1.Project, (project) => project.members),
    __metadata("design:type", Array)
], User.prototype, "projects", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => task_entity_1.Task, (task) => task.assignee),
    __metadata("design:type", Array)
], User.prototype, "assignedTasks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => issue_entity_1.Issue, (issue) => issue.assignee),
    __metadata("design:type", Array)
], User.prototype, "assignedIssues", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => comment_entity_1.Comment, (comment) => comment.author),
    __metadata("design:type", Array)
], User.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notification_log_entity_1.NotificationLog, (notification) => notification.user),
    __metadata("design:type", Array)
], User.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => time_log_entity_1.TimeLog, (timeLog) => timeLog.user),
    __metadata("design:type", Array)
], User.prototype, "timeLogs", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => User, (user) => user.teamMembers),
    (0, typeorm_1.JoinTable)({
        name: 'user_teams',
        joinColumn: { name: 'managerId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'memberId', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], User.prototype, "managedUsers", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => User, (user) => user.managedUsers),
    __metadata("design:type", Array)
], User.prototype, "teamMembers", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users'),
    (0, typeorm_1.Index)(['email'], { unique: true })
], User);


/***/ }),

/***/ "./src/entities/webhook.entity.ts":
/*!****************************************!*\
  !*** ./src/entities/webhook.entity.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Webhook = void 0;
const typeorm_1 = __webpack_require__(/*! typeorm */ "typeorm");
const user_entity_1 = __webpack_require__(/*! ./user.entity */ "./src/entities/user.entity.ts");
let Webhook = class Webhook {
};
exports.Webhook = Webhook;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Webhook.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Webhook.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Webhook.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { array: true }),
    __metadata("design:type", Array)
], Webhook.prototype, "events", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Webhook.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Webhook.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Webhook.prototype, "secret", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: "CASCADE" }),
    __metadata("design:type", typeof (_a = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _a : Object)
], Webhook.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Webhook.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Webhook.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Webhook.prototype, "deletedAt", void 0);
exports.Webhook = Webhook = __decorate([
    (0, typeorm_1.Entity)("webhooks")
], Webhook);


/***/ }),

/***/ "./src/modules/auth/auth.controller.ts":
/*!*********************************************!*\
  !*** ./src/modules/auth/auth.controller.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const throttler_1 = __webpack_require__(/*! @nestjs/throttler */ "@nestjs/throttler");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/modules/auth/auth.service.ts");
const public_decorator_1 = __webpack_require__(/*! ../../common/decorators/public.decorator */ "./src/common/decorators/public.decorator.ts");
const register_dto_1 = __webpack_require__(/*! ./dtos/register.dto */ "./src/modules/auth/dtos/register.dto.ts");
const login_dto_1 = __webpack_require__(/*! ./dtos/login.dto */ "./src/modules/auth/dtos/login.dto.ts");
const forgot_password_dto_1 = __webpack_require__(/*! ./dtos/forgot-password.dto */ "./src/modules/auth/dtos/forgot-password.dto.ts");
const reset_password_dto_1 = __webpack_require__(/*! ./dtos/reset-password.dto */ "./src/modules/auth/dtos/reset-password.dto.ts");
const refresh_token_dto_1 = __webpack_require__(/*! ./dtos/refresh-token.dto */ "./src/modules/auth/dtos/refresh-token.dto.ts");
const verify_otp_dto_1 = __webpack_require__(/*! ./dtos/verify-otp.dto */ "./src/modules/auth/dtos/verify-otp.dto.ts");
const verify_email_dto_1 = __webpack_require__(/*! ./dtos/verify-email.dto */ "./src/modules/auth/dtos/verify-email.dto.ts");
const resend_verification_dto_1 = __webpack_require__(/*! ./dtos/resend-verification.dto */ "./src/modules/auth/dtos/resend-verification.dto.ts");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async forgotPassword(forgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto.email);
    }
    async resetPassword(resetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
    }
    async verifyOtp(verifyOtpDto) {
        return this.authService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
    }
    async generateOtp(body) {
        return this.authService.generateOtp(body.email);
    }
    async verifyEmail(verifyEmailDto) {
        return this.authService.verifyEmail(verifyEmailDto.token);
    }
    async resendVerification(resendVerificationDto) {
        return this.authService.resendVerificationEmail(resendVerificationDto.email);
    }
    async refresh(refreshTokenDto) {
        return this.authService.refreshToken(refreshTokenDto.refreshToken);
    }
    async logout(req) {
        const userId = req.user?.id;
        if (userId) {
            return this.authService.logout(userId);
        }
        return { message: "Logged out successfully" };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("register"),
    (0, swagger_1.ApiOperation)({ summary: "Register a new user" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "User successfully registered" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Bad request" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof register_dto_1.RegisterDto !== "undefined" && register_dto_1.RegisterDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("login"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Login user" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "User successfully logged in" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Invalid credentials" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof login_dto_1.LoginDto !== "undefined" && login_dto_1.LoginDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("forgot-password"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Request password reset" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Password reset email sent" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof forgot_password_dto_1.ForgotPasswordDto !== "undefined" && forgot_password_dto_1.ForgotPasswordDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("reset-password"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Reset password with token" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Password successfully reset" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof reset_password_dto_1.ResetPasswordDto !== "undefined" && reset_password_dto_1.ResetPasswordDto) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("verify-otp"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Verify OTP code" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "OTP successfully verified" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof verify_otp_dto_1.VerifyOtpDto !== "undefined" && verify_otp_dto_1.VerifyOtpDto) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("generate-otp"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Generate and send OTP" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "OTP sent successfully" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "generateOtp", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("verify-email"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Verify email address" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Email successfully verified" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Invalid or expired token" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof verify_email_dto_1.VerifyEmailDto !== "undefined" && verify_email_dto_1.VerifyEmailDto) === "function" ? _g : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("resend-verification"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Resend email verification" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Verification email sent" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "User not found or email already verified" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof resend_verification_dto_1.ResendVerificationDto !== "undefined" && resend_verification_dto_1.ResendVerificationDto) === "function" ? _h : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendVerification", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("refresh"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Refresh access token" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Token successfully refreshed" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof refresh_token_dto_1.RefreshTokenDto !== "undefined" && refresh_token_dto_1.RefreshTokenDto) === "function" ? _j : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)("logout"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Logout user" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "User successfully logged out" }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)("auth"),
    (0, common_1.Controller)("auth"),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    __param(0, (0, common_1.Inject)(auth_service_1.AuthService)),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),

/***/ "./src/modules/auth/auth.module.ts":
/*!*****************************************!*\
  !*** ./src/modules/auth/auth.module.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const auth_controller_1 = __webpack_require__(/*! ./auth.controller */ "./src/modules/auth/auth.controller.ts");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/modules/auth/auth.service.ts");
const jwt_strategy_1 = __webpack_require__(/*! ./strategies/jwt.strategy */ "./src/modules/auth/strategies/jwt.strategy.ts");
const user_entity_1 = __webpack_require__(/*! ../../entities/user.entity */ "./src/entities/user.entity.ts");
const pending_registration_entity_1 = __webpack_require__(/*! ../../entities/pending-registration.entity */ "./src/entities/pending-registration.entity.ts");
const users_module_1 = __webpack_require__(/*! ../users/users.module */ "./src/modules/users/users.module.ts");
const email_service_1 = __webpack_require__(/*! ./email.service */ "./src/modules/auth/email.service.ts");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, pending_registration_entity_1.PendingRegistration]),
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get("JWT_SECRET"),
                    signOptions: {
                        expiresIn: '24h',
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            config_1.ConfigModule,
            users_module_1.UsersModule,
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            jwt_strategy_1.JwtStrategy,
            email_service_1.EmailService
        ],
        exports: [auth_service_1.AuthService, email_service_1.EmailService],
    })
], AuthModule);


/***/ }),

/***/ "./src/modules/auth/auth.service.ts":
/*!******************************************!*\
  !*** ./src/modules/auth/auth.service.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const bcrypt = __webpack_require__(/*! bcrypt */ "bcrypt");
const crypto = __webpack_require__(/*! crypto */ "crypto");
const user_entity_1 = __webpack_require__(/*! ../../entities/user.entity */ "./src/entities/user.entity.ts");
const pending_registration_entity_1 = __webpack_require__(/*! ../../entities/pending-registration.entity */ "./src/entities/pending-registration.entity.ts");
const email_service_1 = __webpack_require__(/*! ./email.service */ "./src/modules/auth/email.service.ts");
let AuthService = class AuthService {
    constructor(userRepository, pendingRegistrationRepository, jwtService, configService, emailService) {
        this.userRepository = userRepository;
        this.pendingRegistrationRepository = pendingRegistrationRepository;
        this.jwtService = jwtService;
        this.configService = configService;
        this.emailService = emailService;
    }
    async register(registerDto) {
        const { email, password, name } = registerDto;
        const existingUser = await this.userRepository.findOne({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const existingPending = await this.pendingRegistrationRepository.findOne({
            where: { email },
        });
        if (existingPending) {
            await this.pendingRegistrationRepository.remove(existingPending);
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        const pendingRegistration = this.pendingRegistrationRepository.create({
            email,
            password: hashedPassword,
            name,
            otpCode: otp,
            otpExpires,
        });
        const savedPending = await this.pendingRegistrationRepository.save(pendingRegistration);
        try {
            if (this.emailService) {
                await this.emailService.add('otp', {
                    email: savedPending.email,
                    name: savedPending.name,
                    otp,
                });
            }
        }
        catch (error) {
            console.error('Failed to send OTP email:', error.message);
            console.log(`🔐 FALLBACK - OTP for ${savedPending.email}: ${otp}`);
        }
        return {
            message: 'Registration initiated. Please verify your email with the OTP sent to your email address to complete registration.',
            email: savedPending.email,
            name: savedPending.name
        };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.userRepository.findOne({
            where: { email, isActive: true },
            select: ['id', 'email', 'password', 'name', 'role', 'avatar', 'isEmailVerified'],
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isEmailVerified) {
            throw new common_1.UnauthorizedException('Please verify your email address before logging in');
        }
        const tokens = await this.generateTokens(user);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        const response = {
            user: this.sanitizeUser(user),
            ...tokens,
        };
        return response;
    }
    async forgotPassword(email) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            return { message: 'If the email exists, a reset link has been sent' };
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000);
        await this.userRepository.update(user.id, {
            resetPasswordToken: resetToken,
            resetPasswordExpires: resetTokenExpires,
        });
        await this.emailService.add('password-reset', {
            email: user.email,
            name: user.name,
            resetToken,
        });
        return { message: 'If the email exists, a reset link has been sent' };
    }
    async resetPassword(token, newPassword) {
        const user = await this.userRepository.findOne({
            where: {
                resetPasswordToken: token,
            },
        });
        if (!user || user.resetPasswordExpires < new Date()) {
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await this.userRepository.update(user.id, {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null,
            refreshToken: null,
        });
        return { message: 'Password successfully reset' };
    }
    async generateOtp(email) {
        const pendingRegistration = await this.pendingRegistrationRepository.findOne({
            where: { email }
        });
        if (!pendingRegistration) {
            throw new common_1.BadRequestException('No pending registration found for this email');
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await this.pendingRegistrationRepository.update(pendingRegistration.id, {
            otpCode: otp,
            otpExpires,
        });
        await this.emailService.add('otp', {
            email: pendingRegistration.email,
            name: pendingRegistration.name,
            otp,
        });
        return { message: 'New OTP sent to your email' };
    }
    async verifyOtp(email, otp) {
        const pendingRegistration = await this.pendingRegistrationRepository.findOne({
            where: { email },
        });
        if (!pendingRegistration) {
            throw new common_1.NotFoundException('No pending registration found for this email');
        }
        if (pendingRegistration.otpCode !== otp) {
            throw new common_1.BadRequestException('Invalid OTP');
        }
        if (pendingRegistration.otpExpires < new Date()) {
            throw new common_1.BadRequestException('OTP has expired');
        }
        const user = this.userRepository.create({
            email: pendingRegistration.email,
            password: pendingRegistration.password,
            name: pendingRegistration.name,
            isEmailVerified: true,
        });
        const savedUser = await this.userRepository.save(user);
        await this.pendingRegistrationRepository.remove(pendingRegistration);
        return {
            message: 'Registration completed successfully. You can now login.',
            user: {
                id: savedUser.id,
                email: savedUser.email,
                name: savedUser.name,
                isEmailVerified: true,
            },
        };
    }
    async verifyEmail(token) {
        const user = await this.userRepository.findOne({
            where: {
                emailVerificationToken: token,
            },
        });
        if (!user || user.emailVerificationExpires < new Date()) {
            throw new common_1.BadRequestException('Invalid or expired verification token');
        }
        await this.userRepository.update(user.id, {
            isEmailVerified: true,
            emailVerificationToken: null,
            emailVerificationExpires: null,
        });
        return { message: 'Email verified successfully' };
    }
    async resendVerificationEmail(email) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (user.isEmailVerified) {
            throw new common_1.BadRequestException('Email is already verified');
        }
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await this.userRepository.update(user.id, {
            emailVerificationToken: verificationToken,
            emailVerificationExpires: verificationExpires,
        });
        await this.emailService.add('email-verification', {
            email: user.email,
            name: user.name,
            verificationToken,
        });
        return { message: 'Verification email sent' };
    }
    async refreshToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            const user = await this.userRepository.findOne({
                where: { id: payload.sub, refreshToken },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const tokens = await this.generateTokens(user);
            await this.updateRefreshToken(user.id, tokens.refreshToken);
            return tokens;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async logout(userId) {
        await this.userRepository.update(userId, { refreshToken: null });
        return { message: 'Successfully logged out' };
    }
    async generateTokens(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d',
            }),
        ]);
        return {
            accessToken,
            refreshToken,
        };
    }
    async updateRefreshToken(userId, refreshToken) {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userRepository.update(userId, {
            refreshToken: hashedRefreshToken,
        });
    }
    sanitizeUser(user) {
        const { password, refreshToken, resetPasswordToken, otpCode, ...sanitized } = user;
        return sanitized;
    }
    async validateUser(payload) {
        const user = await this.userRepository.findOne({
            where: { id: payload.sub, isActive: true },
        });
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(pending_registration_entity_1.PendingRegistration)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _c : Object, typeof (_d = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _d : Object, typeof (_e = typeof email_service_1.EmailService !== "undefined" && email_service_1.EmailService) === "function" ? _e : Object])
], AuthService);


/***/ }),

/***/ "./src/modules/auth/decorators/roles.decorator.ts":
/*!********************************************************!*\
  !*** ./src/modules/auth/decorators/roles.decorator.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;


/***/ }),

/***/ "./src/modules/auth/dtos/forgot-password.dto.ts":
/*!******************************************************!*\
  !*** ./src/modules/auth/dtos/forgot-password.dto.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ForgotPasswordDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class ForgotPasswordDto {
}
exports.ForgotPasswordDto = ForgotPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "john.doe@example.com" }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ForgotPasswordDto.prototype, "email", void 0);


/***/ }),

/***/ "./src/modules/auth/dtos/login.dto.ts":
/*!********************************************!*\
  !*** ./src/modules/auth/dtos/login.dto.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class LoginDto {
}
exports.LoginDto = LoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "john.doe@example.com" }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "SecurePassword123!" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);


/***/ }),

/***/ "./src/modules/auth/dtos/refresh-token.dto.ts":
/*!****************************************************!*\
  !*** ./src/modules/auth/dtos/refresh-token.dto.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RefreshTokenDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class RefreshTokenDto {
}
exports.RefreshTokenDto = RefreshTokenDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "refresh-token-here" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RefreshTokenDto.prototype, "refreshToken", void 0);


/***/ }),

/***/ "./src/modules/auth/dtos/register.dto.ts":
/*!***********************************************!*\
  !*** ./src/modules/auth/dtos/register.dto.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegisterDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "john.doe@example.com" }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "SecurePassword123!" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "John Doe" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], RegisterDto.prototype, "name", void 0);


/***/ }),

/***/ "./src/modules/auth/dtos/resend-verification.dto.ts":
/*!**********************************************************!*\
  !*** ./src/modules/auth/dtos/resend-verification.dto.ts ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResendVerificationDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class ResendVerificationDto {
}
exports.ResendVerificationDto = ResendVerificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email address to resend verification to' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ResendVerificationDto.prototype, "email", void 0);


/***/ }),

/***/ "./src/modules/auth/dtos/reset-password.dto.ts":
/*!*****************************************************!*\
  !*** ./src/modules/auth/dtos/reset-password.dto.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResetPasswordDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class ResetPasswordDto {
}
exports.ResetPasswordDto = ResetPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "reset-token-here" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "NewSecurePassword123!" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "newPassword", void 0);


/***/ }),

/***/ "./src/modules/auth/dtos/verify-email.dto.ts":
/*!***************************************************!*\
  !*** ./src/modules/auth/dtos/verify-email.dto.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VerifyEmailDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class VerifyEmailDto {
}
exports.VerifyEmailDto = VerifyEmailDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email verification token' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VerifyEmailDto.prototype, "token", void 0);


/***/ }),

/***/ "./src/modules/auth/dtos/verify-otp.dto.ts":
/*!*************************************************!*\
  !*** ./src/modules/auth/dtos/verify-otp.dto.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VerifyOtpDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class VerifyOtpDto {
}
exports.VerifyOtpDto = VerifyOtpDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "john.doe@example.com" }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "123456" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 6),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "otp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "email_verification", required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "type", void 0);


/***/ }),

/***/ "./src/modules/auth/email.service.ts":
/*!*******************************************!*\
  !*** ./src/modules/auth/email.service.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmailService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const nodemailer = __webpack_require__(/*! nodemailer */ "nodemailer");
let EmailService = class EmailService {
    constructor(configService) {
        this.configService = configService;
        try {
            this.transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: 'hw93goj@gmail.com',
                    pass: 'utro dkai fzpm crlx',
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
        }
        catch (error) {
            console.error('❌ Failed to initialize email service:', error);
            this.transporter = null;
        }
    }
    async add(type, data) {
        const templates = {
            welcome: {
                subject: 'Welcome to Task Management System',
                html: `
          <h1>Welcome ${data.name}!</h1>
          <p>Thank you for joining our Task Management System.</p>
          <p>Start managing your tasks efficiently today!</p>
        `,
            },
            'password-reset': {
                subject: 'Password Reset Request',
                html: `
          <h1>Password Reset</h1>
          <p>Hello ${data.name},</p>
          <p>You requested to reset your password. Click the link below to proceed:</p>
          <a href="${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/auth/reset-password?token=${data.resetToken}&email=${encodeURIComponent(data.email)}">Reset Password</a>
          <p>This link will expire in 15 minutes.</p>
        `,
            },
            otp: {
                subject: 'Your OTP Code - Task Management System',
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #3B82F6; text-align: center;">OTP Verification</h1>
            <p>Hello ${data.name},</p>
            <p>Thank you for registering with our Task Management System. To complete your registration, please use the following OTP code:</p>
            <div style="background-color: #f8f9fa; border: 2px solid #3B82F6; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <h2 style="color: #3B82F6; font-size: 32px; margin: 0; letter-spacing: 4px;">${data.otp}</h2>
            </div>
            <p><strong>Important:</strong> This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 12px;">Task Management System</p>
          </div>
        `,
            },
            'email-verification': {
                subject: 'Verify Your Email Address',
                html: `
          <h1>Email Verification</h1>
          <p>Hello ${data.name},</p>
          <p>Thank you for registering with our Task Management System. Please verify your email address by clicking the link below:</p>
          <a href="${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/auth/verify-email?token=${data.verificationToken}" 
             style="display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
            Verify Email Address
          </a>
          <p>Or copy and paste this link in your browser:</p>
          <p>${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/auth/verify-email?token=${data.verificationToken}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create an account, please ignore this email.</p>
        `,
            },
            'project-invitation': {
                subject: `You've been invited to join "${data.projectName}"`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #3B82F6; text-align: center;">Project Invitation</h1>
            <p>Hello,</p>
            <p>${data.inviterName} has invited you to join the project "<strong>${data.projectName}</strong>" in our Task Management System.</p>
            <div style="background-color: #f8f9fa; border-left: 4px solid #3B82F6; padding: 15px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #1f2937;">Project Details:</h3>
              <p style="margin: 5px 0;"><strong>Name:</strong> ${data.projectName}</p>
              ${data.projectDescription ? `<p style="margin: 5px 0;"><strong>Description:</strong> ${data.projectDescription}</p>` : ''}
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/invitations/accept?token=${data.invitationToken}" 
                 style="display: inline-block; padding: 12px 24px; background-color: #10B981; color: white; text-decoration: none; border-radius: 6px; margin: 0 10px;">
                Accept Invitation
              </a>
              <a href="${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/invitations/decline?token=${data.invitationToken}" 
                 style="display: inline-block; padding: 12px 24px; background-color: #EF4444; color: white; text-decoration: none; border-radius: 6px; margin: 0 10px;">
                Decline Invitation
              </a>
            </div>
            <p>This invitation will expire in 7 days.</p>
            <p>If you don't have an account yet, you'll be prompted to create one when accepting the invitation.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 12px;">Task Management System</p>
          </div>
        `,
            },
            'project-member-added': {
                subject: `You've been added to project "${data.projectName}"`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #10B981; text-align: center;">Welcome to the Team!</h1>
            <p>Hello ${data.memberName},</p>
            <p>${data.inviterName} has added you as a member to the project "<strong>${data.projectName}</strong>" in our Task Management System.</p>
            <div style="background-color: #f8f9fa; border-left: 4px solid #10B981; padding: 15px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #1f2937;">Project Details:</h3>
              <p style="margin: 5px 0;"><strong>Name:</strong> ${data.projectName}</p>
              ${data.projectDescription ? `<p style="margin: 5px 0;"><strong>Description:</strong> ${data.projectDescription}</p>` : ''}
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/projects/${data.projectId}" 
                 style="display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 6px;">
                View Project
              </a>
            </div>
            <p>You can now collaborate on tasks, view project updates, and contribute to the project's success.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 12px;">Task Management System</p>
          </div>
        `,
            },
            'task-assignment': {
                subject: `You've been assigned to task "${data.taskTitle}"`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #3B82F6; text-align: center;">New Task Assignment</h1>
            <p>Hello ${data.assigneeName},</p>
            <p>${data.assignerName} has assigned you to a new task in our Task Management System.</p>
            <div style="background-color: #f8f9fa; border-left: 4px solid #3B82F6; padding: 15px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #1f2937;">Task Details:</h3>
              <p style="margin: 5px 0;"><strong>Title:</strong> ${data.taskTitle}</p>
              ${data.taskDescription ? `<p style="margin: 5px 0;"><strong>Description:</strong> ${data.taskDescription}</p>` : ''}
              <p style="margin: 5px 0;"><strong>Priority:</strong> <span style="text-transform: capitalize; color: ${data.priority === 'high' ? '#EF4444' : data.priority === 'medium' ? '#F59E0B' : '#10B981'};">${data.priority}</span></p>
              ${data.dueDate ? `<p style="margin: 5px 0;"><strong>Due Date:</strong> ${new Date(data.dueDate).toLocaleDateString()}</p>` : ''}
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/tasks/${data.taskId}" 
                 style="display: inline-block; padding: 12px 24px; background-color: #10B981; color: white; text-decoration: none; border-radius: 6px;">
                View Task
              </a>
            </div>
            <p>Please review the task details and update the status as you make progress.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 12px;">Task Management System</p>
          </div>
        `,
            },
            'task-update': {
                subject: `Task "${data.taskTitle}" has been updated`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #F59E0B; text-align: center;">Task Update</h1>
            <p>Hello ${data.assigneeName},</p>
            <p>${data.updaterName} has updated the task "${data.taskTitle}" that you're assigned to.</p>
            <div style="background-color: #f8f9fa; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #1f2937;">Update Details:</h3>
              <p style="margin: 5px 0;"><strong>Task:</strong> ${data.taskTitle}</p>
              <p style="margin: 5px 0;"><strong>New Status:</strong> <span style="text-transform: capitalize; color: ${data.newStatus === 'done' ? '#10B981' : data.newStatus === 'blocked' ? '#EF4444' : '#3B82F6'};">${data.newStatus.replace('_', ' ')}</span></p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/tasks/${data.taskId}" 
                 style="display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 6px;">
                View Task
              </a>
            </div>
            <p>Check the task for more details and any additional updates.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 12px;">Task Management System</p>
          </div>
        `,
            },
            'issue-assignment': {
                subject: `You've been assigned to issue "${data.issueTitle}"`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #EF4444; text-align: center;">Issue Assignment</h1>
            <p>Hello ${data.assigneeName},</p>
            <p>${data.assignerName} has assigned you to an issue in our Task Management System.</p>
            <div style="background-color: #f8f9fa; border-left: 4px solid #EF4444; padding: 15px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #1f2937;">Issue Details:</h3>
              <p style="margin: 5px 0;"><strong>Title:</strong> ${data.issueTitle}</p>
              ${data.issueDescription ? `<p style="margin: 5px 0;"><strong>Description:</strong> ${data.issueDescription}</p>` : ''}
              <p style="margin: 5px 0;"><strong>Severity:</strong> <span style="text-transform: capitalize; color: ${data.severity === 'critical' ? '#DC2626' : data.severity === 'high' ? '#EF4444' : data.severity === 'medium' ? '#F59E0B' : '#10B981'};">${data.severity}</span></p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/issues/${data.issueId}" 
                 style="display: inline-block; padding: 12px 24px; background-color: #EF4444; color: white; text-decoration: none; border-radius: 6px;">
                View Issue
              </a>
            </div>
            <p>Please investigate and resolve this issue as soon as possible.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 12px;">Task Management System</p>
          </div>
        `,
            },
        };
        const template = templates[type];
        if (!template) {
            throw new Error(`Email template '${type}' not found`);
        }
        if (this.transporter) {
            try {
                const mailOptions = {
                    from: `"Task Management System" <hw93goj@gmail.com>`,
                    to: data.email,
                    subject: template.subject,
                    html: template.html,
                    text: type === 'otp' ? `Your OTP code is: ${data.otp}. This code expires in 10 minutes.` : undefined,
                };
                const result = await this.transporter.sendMail(mailOptions);
                return { success: true, messageId: result.messageId };
            }
            catch (error) {
                console.error(`Failed to send ${type} email to ${data.email}:`, error.message);
                return { success: false, error: error.message };
            }
        }
        else {
            console.error('No SMTP transporter available');
            return { success: false, error: 'No SMTP transporter configured' };
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], EmailService);


/***/ }),

/***/ "./src/modules/auth/guards/jwt-auth.guard.ts":
/*!***************************************************!*\
  !*** ./src/modules/auth/guards/jwt-auth.guard.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);


/***/ }),

/***/ "./src/modules/auth/strategies/jwt.strategy.ts":
/*!*****************************************************!*\
  !*** ./src/modules/auth/strategies/jwt.strategy.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const passport_jwt_1 = __webpack_require__(/*! passport-jwt */ "passport-jwt");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const auth_service_1 = __webpack_require__(/*! ../auth.service */ "./src/modules/auth/auth.service.ts");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService, authService) {
        const jwtSecret = configService.get("JWT_SECRET") || "fallback-secret-for-development-only-change-in-production";
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
        });
        this.configService = configService;
        this.authService = authService;
        console.log('JWT Strategy initialized with secret:', jwtSecret !== "fallback-secret-for-development-only-change-in-production" ? 'SECRET_SET' : 'FALLBACK_SECRET_USED');
    }
    async validate(payload) {
        console.log('JWT Strategy - Validating payload:', payload);
        try {
            const user = await this.authService.validateUser(payload);
            if (!user) {
                console.log('JWT Strategy - User not found or inactive');
                throw new common_1.UnauthorizedException();
            }
            console.log('JWT Strategy - User validated successfully:', user.id);
            return user;
        }
        catch (error) {
            console.log('JWT Strategy - Validation error:', error.message);
            throw new common_1.UnauthorizedException();
        }
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, typeof (_b = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _b : Object])
], JwtStrategy);


/***/ }),

/***/ "./src/modules/comments/comments.controller.ts":
/*!*****************************************************!*\
  !*** ./src/modules/comments/comments.controller.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommentsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const comments_service_1 = __webpack_require__(/*! ./comments.service */ "./src/modules/comments/comments.service.ts");
const create_comment_dto_1 = __webpack_require__(/*! ./dto/create-comment.dto */ "./src/modules/comments/dto/create-comment.dto.ts");
const update_comment_dto_1 = __webpack_require__(/*! ./dto/update-comment.dto */ "./src/modules/comments/dto/update-comment.dto.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
let CommentsController = class CommentsController {
    constructor(commentsService) {
        this.commentsService = commentsService;
    }
    create(createCommentDto, req) {
        return this.commentsService.create(createCommentDto, req.user.id);
    }
    findByEntity(entityType, entityId) {
        return this.commentsService.findByEntity(entityType, entityId);
    }
    update(id, updateCommentDto, req) {
        return this.commentsService.update(id, updateCommentDto, req.user.id);
    }
    remove(id, req) {
        return this.commentsService.remove(id, req.user.id);
    }
};
exports.CommentsController = CommentsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a new comment" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_comment_dto_1.CreateCommentDto !== "undefined" && create_comment_dto_1.CreateCommentDto) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get comments by entity type and ID" }),
    __param(0, (0, common_1.Query)('entityType')),
    __param(1, (0, common_1.Query)('entityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "findByEntity", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Update comment" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_comment_dto_1.UpdateCommentDto !== "undefined" && update_comment_dto_1.UpdateCommentDto) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Delete comment" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "remove", null);
exports.CommentsController = CommentsController = __decorate([
    (0, swagger_1.ApiTags)("comments"),
    (0, common_1.Controller)("comments"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof comments_service_1.CommentsService !== "undefined" && comments_service_1.CommentsService) === "function" ? _a : Object])
], CommentsController);


/***/ }),

/***/ "./src/modules/comments/comments.module.ts":
/*!*************************************************!*\
  !*** ./src/modules/comments/comments.module.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommentsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const comments_controller_1 = __webpack_require__(/*! ./comments.controller */ "./src/modules/comments/comments.controller.ts");
const comments_service_1 = __webpack_require__(/*! ./comments.service */ "./src/modules/comments/comments.service.ts");
const comment_entity_1 = __webpack_require__(/*! ../../entities/comment.entity */ "./src/entities/comment.entity.ts");
let CommentsModule = class CommentsModule {
};
exports.CommentsModule = CommentsModule;
exports.CommentsModule = CommentsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([comment_entity_1.Comment])],
        controllers: [comments_controller_1.CommentsController],
        providers: [comments_service_1.CommentsService],
        exports: [comments_service_1.CommentsService],
    })
], CommentsModule);


/***/ }),

/***/ "./src/modules/comments/comments.service.ts":
/*!**************************************************!*\
  !*** ./src/modules/comments/comments.service.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommentsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const comment_entity_1 = __webpack_require__(/*! ../../entities/comment.entity */ "./src/entities/comment.entity.ts");
let CommentsService = class CommentsService {
    constructor(commentRepository) {
        this.commentRepository = commentRepository;
    }
    async create(createCommentDto, authorId) {
        const comment = this.commentRepository.create({
            ...createCommentDto,
            author: { id: authorId },
        });
        return this.commentRepository.save(comment);
    }
    async findByEntity(entityType, entityId) {
        let whereCondition = {};
        switch (entityType) {
            case 'project':
                whereCondition = { projectId: entityId };
                break;
            case 'task':
                whereCondition = { taskId: entityId };
                break;
            case 'issue':
                whereCondition = { issueId: entityId };
                break;
            default:
                throw new Error(`Invalid entity type: ${entityType}`);
        }
        return this.commentRepository.find({
            where: whereCondition,
            relations: ['author'],
            order: { createdAt: 'ASC' },
        });
    }
    async update(id, updateCommentDto, userId) {
        const comment = await this.commentRepository.findOne({
            where: { id },
            relations: ['author'],
        });
        if (!comment) {
            throw new common_1.NotFoundException(`Comment with ID ${id} not found`);
        }
        if (comment.author.id !== userId) {
            throw new common_1.ForbiddenException('You can only update your own comments');
        }
        Object.assign(comment, updateCommentDto);
        return this.commentRepository.save(comment);
    }
    async remove(id, userId) {
        const comment = await this.commentRepository.findOne({
            where: { id },
            relations: ['author'],
        });
        if (!comment) {
            throw new common_1.NotFoundException(`Comment with ID ${id} not found`);
        }
        if (comment.author.id !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own comments');
        }
        await this.commentRepository.remove(comment);
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __metadata("design:paramtypes", [Object])
], CommentsService);


/***/ }),

/***/ "./src/modules/comments/dto/create-comment.dto.ts":
/*!********************************************************!*\
  !*** ./src/modules/comments/dto/create-comment.dto.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateCommentDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class CreateCommentDto {
}
exports.CreateCommentDto = CreateCommentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "This looks great! Just one suggestion..." }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "task", description: "Entity type: task, issue, or project" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "entityType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "uuid-of-entity" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "entityId", void 0);


/***/ }),

/***/ "./src/modules/comments/dto/update-comment.dto.ts":
/*!********************************************************!*\
  !*** ./src/modules/comments/dto/update-comment.dto.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateCommentDto = void 0;
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const create_comment_dto_1 = __webpack_require__(/*! ./create-comment.dto */ "./src/modules/comments/dto/create-comment.dto.ts");
class UpdateCommentDto extends (0, swagger_1.PartialType)(create_comment_dto_1.CreateCommentDto) {
}
exports.UpdateCommentDto = UpdateCommentDto;


/***/ }),

/***/ "./src/modules/invitations/invitations.controller.ts":
/*!***********************************************************!*\
  !*** ./src/modules/invitations/invitations.controller.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InvitationsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const invitations_service_1 = __webpack_require__(/*! ./invitations.service */ "./src/modules/invitations/invitations.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
let InvitationsController = class InvitationsController {
    constructor(invitationsService) {
        this.invitationsService = invitationsService;
    }
    async acceptInvitation(token, req) {
        if (!token) {
            throw new common_1.BadRequestException('Invitation token is required');
        }
        const userId = req.user?.id || null;
        return this.invitationsService.acceptInvitation(token, userId);
    }
    async declineInvitation(token) {
        if (!token) {
            throw new common_1.BadRequestException('Invitation token is required');
        }
        return this.invitationsService.declineInvitation(token);
    }
    async verifyInvitation(token) {
        return this.invitationsService.verifyInvitation(token);
    }
    async getMyInvitations(req) {
        return this.invitationsService.getUserInvitations(req.user.email);
    }
    async acceptInvitationById(id, req) {
        return this.invitationsService.acceptInvitationById(id, req.user.id);
    }
};
exports.InvitationsController = InvitationsController;
__decorate([
    (0, common_1.Get)("accept"),
    (0, swagger_1.ApiOperation)({ summary: "Accept project invitation via token" }),
    __param(0, (0, common_1.Query)('token')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "acceptInvitation", null);
__decorate([
    (0, common_1.Get)("decline"),
    (0, swagger_1.ApiOperation)({ summary: "Decline project invitation via token" }),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "declineInvitation", null);
__decorate([
    (0, common_1.Get)("verify/:token"),
    (0, swagger_1.ApiOperation)({ summary: "Verify invitation token and get invitation details" }),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "verifyInvitation", null);
__decorate([
    (0, common_1.Get)("my-invitations"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Get user's pending invitations" }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "getMyInvitations", null);
__decorate([
    (0, common_1.Post)("accept/:id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Accept invitation by ID (for authenticated users)" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "acceptInvitationById", null);
exports.InvitationsController = InvitationsController = __decorate([
    (0, swagger_1.ApiTags)("invitations"),
    (0, common_1.Controller)("invitations"),
    __metadata("design:paramtypes", [typeof (_a = typeof invitations_service_1.InvitationsService !== "undefined" && invitations_service_1.InvitationsService) === "function" ? _a : Object])
], InvitationsController);


/***/ }),

/***/ "./src/modules/invitations/invitations.module.ts":
/*!*******************************************************!*\
  !*** ./src/modules/invitations/invitations.module.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InvitationsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const invitations_controller_1 = __webpack_require__(/*! ./invitations.controller */ "./src/modules/invitations/invitations.controller.ts");
const invitations_service_1 = __webpack_require__(/*! ./invitations.service */ "./src/modules/invitations/invitations.service.ts");
const project_invitation_entity_1 = __webpack_require__(/*! ../../entities/project-invitation.entity */ "./src/entities/project-invitation.entity.ts");
const project_entity_1 = __webpack_require__(/*! ../../entities/project.entity */ "./src/entities/project.entity.ts");
const user_entity_1 = __webpack_require__(/*! ../../entities/user.entity */ "./src/entities/user.entity.ts");
let InvitationsModule = class InvitationsModule {
};
exports.InvitationsModule = InvitationsModule;
exports.InvitationsModule = InvitationsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([project_invitation_entity_1.ProjectInvitation, project_entity_1.Project, user_entity_1.User])],
        controllers: [invitations_controller_1.InvitationsController],
        providers: [invitations_service_1.InvitationsService],
        exports: [invitations_service_1.InvitationsService],
    })
], InvitationsModule);


/***/ }),

/***/ "./src/modules/invitations/invitations.service.ts":
/*!********************************************************!*\
  !*** ./src/modules/invitations/invitations.service.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InvitationsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
const project_invitation_entity_1 = __webpack_require__(/*! ../../entities/project-invitation.entity */ "./src/entities/project-invitation.entity.ts");
const project_entity_1 = __webpack_require__(/*! ../../entities/project.entity */ "./src/entities/project.entity.ts");
const user_entity_1 = __webpack_require__(/*! ../../entities/user.entity */ "./src/entities/user.entity.ts");
let InvitationsService = class InvitationsService {
    constructor(invitationRepository, projectRepository, userRepository) {
        this.invitationRepository = invitationRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }
    async acceptInvitation(token, userId) {
        const invitation = await this.invitationRepository.findOne({
            where: { token, status: 'pending' },
            relations: ['project', 'invitedBy']
        });
        if (!invitation) {
            throw new common_1.NotFoundException('Invalid or expired invitation');
        }
        if (invitation.expiresAt < new Date()) {
            invitation.status = 'expired';
            await this.invitationRepository.save(invitation);
            throw new common_1.BadRequestException('Invitation has expired');
        }
        if (!userId) {
            return {
                requiresRegistration: true,
                invitation: {
                    id: invitation.id,
                    email: invitation.email,
                    projectName: invitation.project.name,
                    projectDescription: invitation.project.description,
                    inviterName: invitation.invitedBy.name,
                    token
                }
            };
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.email !== invitation.email) {
            throw new common_1.BadRequestException('Invitation email does not match your account email');
        }
        const project = await this.projectRepository.findOne({
            where: { id: invitation.projectId },
            relations: ['members']
        });
        const isAlreadyMember = project.members.some(member => member.id === userId);
        if (isAlreadyMember) {
            throw new common_1.ConflictException('You are already a member of this project');
        }
        await this.projectRepository
            .createQueryBuilder()
            .relation(project_entity_1.Project, 'members')
            .of(invitation.projectId)
            .add(userId);
        invitation.status = 'accepted';
        invitation.acceptedBy = user;
        await this.invitationRepository.save(invitation);
        return {
            success: true,
            message: 'Successfully joined the project',
            project: {
                id: project.id,
                name: project.name,
                description: project.description
            }
        };
    }
    async declineInvitation(token) {
        const invitation = await this.invitationRepository.findOne({
            where: { token, status: 'pending' }
        });
        if (!invitation) {
            throw new common_1.NotFoundException('Invalid or expired invitation');
        }
        invitation.status = 'declined';
        await this.invitationRepository.save(invitation);
        return {
            success: true,
            message: 'Invitation declined successfully'
        };
    }
    async verifyInvitation(token) {
        const invitation = await this.invitationRepository.findOne({
            where: { token },
            relations: ['project', 'invitedBy']
        });
        if (!invitation) {
            throw new common_1.NotFoundException('Invitation not found');
        }
        if (invitation.status !== 'pending') {
            throw new common_1.BadRequestException(`Invitation has been ${invitation.status}`);
        }
        if (invitation.expiresAt < new Date()) {
            invitation.status = 'expired';
            await this.invitationRepository.save(invitation);
            throw new common_1.BadRequestException('Invitation has expired');
        }
        return {
            email: invitation.email,
            projectName: invitation.project.name,
            projectDescription: invitation.project.description,
            inviterName: invitation.invitedBy.name,
            expiresAt: invitation.expiresAt
        };
    }
    async getUserInvitations(email) {
        const invitations = await this.invitationRepository.find({
            where: { email, status: 'pending' },
            relations: ['project', 'invitedBy'],
            order: { createdAt: 'DESC' }
        });
        return invitations.map(invitation => ({
            id: invitation.id,
            projectName: invitation.project.name,
            projectDescription: invitation.project.description,
            inviterName: invitation.invitedBy.name,
            createdAt: invitation.createdAt,
            expiresAt: invitation.expiresAt
        }));
    }
    async acceptInvitationById(invitationId, userId) {
        const invitation = await this.invitationRepository.findOne({
            where: { id: invitationId, status: 'pending' },
            relations: ['project']
        });
        if (!invitation) {
            throw new common_1.NotFoundException('Invitation not found');
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (user.email !== invitation.email) {
            throw new common_1.BadRequestException('This invitation is not for your email address');
        }
        return this.acceptInvitation(invitation.token, userId);
    }
};
exports.InvitationsService = InvitationsService;
exports.InvitationsService = InvitationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_invitation_entity_1.ProjectInvitation)),
    __param(1, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object])
], InvitationsService);


/***/ }),

/***/ "./src/modules/issues/dto/create-issue.dto.ts":
/*!****************************************************!*\
  !*** ./src/modules/issues/dto/create-issue.dto.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateIssueDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const enums_1 = __webpack_require__(/*! ../../../common/enums */ "./src/common/enums/index.ts");
class CreateIssueDto {
    constructor() {
        this.status = enums_1.IssueStatus.OPEN;
        this.severity = enums_1.IssueSeverity.MEDIUM;
    }
}
exports.CreateIssueDto = CreateIssueDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Login button not working' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateIssueDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'When clicking login button, nothing happens. Console shows 404 error.',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateIssueDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: enums_1.IssueStatus, default: enums_1.IssueStatus.OPEN }),
    (0, class_validator_1.IsEnum)(enums_1.IssueStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_a = typeof enums_1.IssueStatus !== "undefined" && enums_1.IssueStatus) === "function" ? _a : Object)
], CreateIssueDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: enums_1.IssueSeverity, default: enums_1.IssueSeverity.MEDIUM }),
    (0, class_validator_1.IsEnum)(enums_1.IssueSeverity),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_b = typeof enums_1.IssueSeverity !== "undefined" && enums_1.IssueSeverity) === "function" ? _b : Object)
], CreateIssueDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-of-project' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateIssueDto.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid-of-assignee' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateIssueDto.prototype, "assigneeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: [
            'https://res.cloudinary.com/screenshot1.png',
            'https://res.cloudinary.com/log-file.txt',
        ],
        description: 'Array of Cloudinary URLs for issue attachments (screenshots, logs, etc.) uploaded from frontend',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateIssueDto.prototype, "attachments", void 0);


/***/ }),

/***/ "./src/modules/issues/dto/update-issue.dto.ts":
/*!****************************************************!*\
  !*** ./src/modules/issues/dto/update-issue.dto.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateIssueDto = void 0;
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const create_issue_dto_1 = __webpack_require__(/*! ./create-issue.dto */ "./src/modules/issues/dto/create-issue.dto.ts");
class UpdateIssueDto extends (0, swagger_1.PartialType)(create_issue_dto_1.CreateIssueDto) {
}
exports.UpdateIssueDto = UpdateIssueDto;


/***/ }),

/***/ "./src/modules/issues/issues.controller.ts":
/*!*************************************************!*\
  !*** ./src/modules/issues/issues.controller.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IssuesController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const issues_service_1 = __webpack_require__(/*! ./issues.service */ "./src/modules/issues/issues.service.ts");
const create_issue_dto_1 = __webpack_require__(/*! ./dto/create-issue.dto */ "./src/modules/issues/dto/create-issue.dto.ts");
const update_issue_dto_1 = __webpack_require__(/*! ./dto/update-issue.dto */ "./src/modules/issues/dto/update-issue.dto.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
let IssuesController = class IssuesController {
    constructor(issuesService) {
        this.issuesService = issuesService;
    }
    create(createIssueDto, req) {
        return this.issuesService.create(createIssueDto, req.user.id);
    }
    findAll(query, req) {
        return this.issuesService.findAll(query, req.user.id);
    }
    findOne(id, req) {
        return this.issuesService.findOne(id, req.user.id);
    }
    update(id, updateIssueDto, req) {
        return this.issuesService.update(id, updateIssueDto, req.user.id);
    }
    remove(id, req) {
        return this.issuesService.remove(id, req.user.id);
    }
};
exports.IssuesController = IssuesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a new issue" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_issue_dto_1.CreateIssueDto !== "undefined" && create_issue_dto_1.CreateIssueDto) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", void 0)
], IssuesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all issues with pagination and filters" }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], IssuesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get issue by ID" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], IssuesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Update issue by ID" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_issue_dto_1.UpdateIssueDto !== "undefined" && update_issue_dto_1.UpdateIssueDto) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", void 0)
], IssuesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Delete issue" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], IssuesController.prototype, "remove", null);
exports.IssuesController = IssuesController = __decorate([
    (0, swagger_1.ApiTags)("issues"),
    (0, common_1.Controller)("issues"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof issues_service_1.IssuesService !== "undefined" && issues_service_1.IssuesService) === "function" ? _a : Object])
], IssuesController);


/***/ }),

/***/ "./src/modules/issues/issues.module.ts":
/*!*********************************************!*\
  !*** ./src/modules/issues/issues.module.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IssuesModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const issues_service_1 = __webpack_require__(/*! ./issues.service */ "./src/modules/issues/issues.service.ts");
const issues_controller_1 = __webpack_require__(/*! ./issues.controller */ "./src/modules/issues/issues.controller.ts");
const issue_entity_1 = __webpack_require__(/*! ../../entities/issue.entity */ "./src/entities/issue.entity.ts");
const user_entity_1 = __webpack_require__(/*! ../../entities/user.entity */ "./src/entities/user.entity.ts");
const project_entity_1 = __webpack_require__(/*! ../../entities/project.entity */ "./src/entities/project.entity.ts");
const notification_log_entity_1 = __webpack_require__(/*! ../../entities/notification-log.entity */ "./src/entities/notification-log.entity.ts");
const email_service_1 = __webpack_require__(/*! ../auth/email.service */ "./src/modules/auth/email.service.ts");
const notifications_service_1 = __webpack_require__(/*! ../notifications/notifications.service */ "./src/modules/notifications/notifications.service.ts");
let IssuesModule = class IssuesModule {
};
exports.IssuesModule = IssuesModule;
exports.IssuesModule = IssuesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([issue_entity_1.Issue, user_entity_1.User, project_entity_1.Project, notification_log_entity_1.NotificationLog])],
        controllers: [issues_controller_1.IssuesController],
        providers: [issues_service_1.IssuesService, email_service_1.EmailService, notifications_service_1.NotificationsService],
        exports: [issues_service_1.IssuesService],
    })
], IssuesModule);


/***/ }),

/***/ "./src/modules/issues/issues.service.ts":
/*!**********************************************!*\
  !*** ./src/modules/issues/issues.service.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IssuesService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const issue_entity_1 = __webpack_require__(/*! ../../entities/issue.entity */ "./src/entities/issue.entity.ts");
const user_entity_1 = __webpack_require__(/*! ../../entities/user.entity */ "./src/entities/user.entity.ts");
const project_entity_1 = __webpack_require__(/*! ../../entities/project.entity */ "./src/entities/project.entity.ts");
const email_service_1 = __webpack_require__(/*! ../auth/email.service */ "./src/modules/auth/email.service.ts");
const notifications_service_1 = __webpack_require__(/*! ../notifications/notifications.service */ "./src/modules/notifications/notifications.service.ts");
const enums_1 = __webpack_require__(/*! ../../common/enums */ "./src/common/enums/index.ts");
let IssuesService = class IssuesService {
    constructor(issueRepository, userRepository, projectRepository, emailService, notificationsService) {
        this.issueRepository = issueRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.emailService = emailService;
        this.notificationsService = notificationsService;
    }
    async create(createIssueDto, reporterId) {
        const project = await this.validateProjectAccess(createIssueDto.projectId, reporterId);
        if (createIssueDto.assigneeId) {
            await this.validateAssigneeAccess(createIssueDto.assigneeId, project);
        }
        const issue = this.issueRepository.create({
            ...createIssueDto,
            attachments: createIssueDto.attachments || [],
            reporter: { id: reporterId },
            assignee: createIssueDto.assigneeId
                ? { id: createIssueDto.assigneeId }
                : null,
            project: { id: createIssueDto.projectId },
        });
        const savedIssue = await this.issueRepository.save(issue);
        if (createIssueDto.assigneeId && createIssueDto.assigneeId !== reporterId) {
            await this.sendIssueAssignmentNotifications(savedIssue, reporterId);
        }
        return savedIssue;
    }
    async findAll(query, userId) {
        const { page = 1, limit = 10, status, severity, projectId } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.issueRepository
            .createQueryBuilder('issue')
            .leftJoinAndSelect('issue.assignee', 'assignee')
            .leftJoinAndSelect('issue.reporter', 'reporter')
            .leftJoinAndSelect('issue.project', 'project')
            .leftJoinAndSelect('project.members', 'members')
            .where('(project.ownerId = :userId OR members.id = :userId)', {
            userId,
        });
        if (status) {
            queryBuilder.andWhere('issue.status = :status', { status });
        }
        if (severity) {
            queryBuilder.andWhere('issue.severity = :severity', { severity });
        }
        if (projectId) {
            queryBuilder.andWhere('issue.projectId = :projectId', { projectId });
        }
        const [issues, total] = await queryBuilder
            .skip(skip)
            .take(limit)
            .orderBy('issue.createdAt', 'DESC')
            .getManyAndCount();
        return {
            data: issues,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id, userId) {
        const issue = await this.issueRepository.findOne({
            where: { id },
            relations: ['assignee', 'reporter', 'project', 'project.members', 'project.owner'],
        });
        if (!issue) {
            throw new common_1.NotFoundException(`Issue with ID ${id} not found`);
        }
        const hasAccess = issue.project.owner.id === userId ||
            issue.project.members?.some((member) => member.id === userId);
        if (!hasAccess) {
            throw new common_1.ForbiddenException('You do not have access to this issue');
        }
        return issue;
    }
    async update(id, updateIssueDto, userId) {
        const issue = await this.findOne(id, userId);
        const oldAssigneeId = issue.assignee?.id;
        if (updateIssueDto.attachments) {
            issue.attachments = updateIssueDto.attachments;
        }
        Object.assign(issue, updateIssueDto);
        const updatedIssue = await this.issueRepository.save(issue);
        if (updateIssueDto.assigneeId && updateIssueDto.assigneeId !== oldAssigneeId && updateIssueDto.assigneeId !== userId) {
            await this.sendIssueAssignmentNotifications(updatedIssue, userId);
        }
        return updatedIssue;
    }
    async remove(id, userId) {
        const issue = await this.findOne(id, userId);
        await this.issueRepository.softDelete(id);
    }
    async sendIssueAssignmentNotifications(issue, assignerId) {
        try {
            const assignee = await this.userRepository.findOne({
                where: { id: issue.assignee.id },
                relations: ['notifications']
            });
            const assigner = await this.userRepository.findOne({ where: { id: assignerId } });
            if (!assignee || !assigner)
                return;
            await this.notificationsService.create(assignee.id, `You have been assigned to issue "${issue.title}" by ${assigner.name}`, enums_1.NotificationType.TASK_ASSIGNED);
            await this.emailService.add('issue-assignment', {
                email: assignee.email,
                assigneeName: assignee.name,
                issueTitle: issue.title,
                issueDescription: issue.description,
                issueId: issue.id,
                assignerName: assigner.name,
                severity: issue.severity
            });
        }
        catch (error) {
            console.error(`Failed to send issue assignment notifications:`, error);
        }
    }
    async validateProjectAccess(projectId, userId) {
        const project = await this.projectRepository.findOne({
            where: { id: projectId },
            relations: ['owner', 'members'],
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${projectId} not found`);
        }
        const hasAccess = project.owner.id === userId ||
            project.members?.some((member) => member.id === userId);
        if (!hasAccess) {
            throw new common_1.ForbiddenException('You do not have access to this project');
        }
        return project;
    }
    async validateAssigneeAccess(assigneeId, project) {
        if (project.owner.id === assigneeId) {
            return;
        }
        const isProjectMember = project.members?.some((member) => member.id === assigneeId);
        if (!isProjectMember) {
            throw new common_1.ForbiddenException('Issues can only be assigned to project members');
        }
    }
};
exports.IssuesService = IssuesService;
exports.IssuesService = IssuesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(issue_entity_1.Issue)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __metadata("design:paramtypes", [Object, Object, Object, typeof (_a = typeof email_service_1.EmailService !== "undefined" && email_service_1.EmailService) === "function" ? _a : Object, typeof (_b = typeof notifications_service_1.NotificationsService !== "undefined" && notifications_service_1.NotificationsService) === "function" ? _b : Object])
], IssuesService);


/***/ }),

/***/ "./src/modules/notifications/notifications.controller.ts":
/*!***************************************************************!*\
  !*** ./src/modules/notifications/notifications.controller.ts ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const notifications_service_1 = __webpack_require__(/*! ./notifications.service */ "./src/modules/notifications/notifications.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
let NotificationsController = class NotificationsController {
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    findAll(req) {
        return this.notificationsService.findAll(req.query, req.user.id);
    }
    getUnreadCount(req) {
        return this.notificationsService.getUnreadCount(req.user.id);
    }
    markAsRead(id, req) {
        return this.notificationsService.markAsRead(id, req.user.id);
    }
    markAllAsRead(req) {
        return this.notificationsService.markAllAsRead(req.user.id);
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user notifications' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('unread/count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get unread notifications count' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Patch)(':id/read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark notification as read' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Patch)('read-all'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark all notifications as read' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "markAllAsRead", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, swagger_1.ApiTags)('notifications'),
    (0, common_1.Controller)('notifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof notifications_service_1.NotificationsService !== "undefined" && notifications_service_1.NotificationsService) === "function" ? _a : Object])
], NotificationsController);


/***/ }),

/***/ "./src/modules/notifications/notifications.module.ts":
/*!***********************************************************!*\
  !*** ./src/modules/notifications/notifications.module.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const notifications_controller_1 = __webpack_require__(/*! ./notifications.controller */ "./src/modules/notifications/notifications.controller.ts");
const notifications_service_1 = __webpack_require__(/*! ./notifications.service */ "./src/modules/notifications/notifications.service.ts");
const notification_log_entity_1 = __webpack_require__(/*! ../../entities/notification-log.entity */ "./src/entities/notification-log.entity.ts");
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([notification_log_entity_1.NotificationLog])],
        controllers: [notifications_controller_1.NotificationsController],
        providers: [notifications_service_1.NotificationsService],
        exports: [notifications_service_1.NotificationsService],
    })
], NotificationsModule);


/***/ }),

/***/ "./src/modules/notifications/notifications.service.ts":
/*!************************************************************!*\
  !*** ./src/modules/notifications/notifications.service.ts ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const notification_log_entity_1 = __webpack_require__(/*! ../../entities/notification-log.entity */ "./src/entities/notification-log.entity.ts");
let NotificationsService = class NotificationsService {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async create(userId, message, type) {
        const notification = this.notificationRepository.create({
            userId,
            message,
            type,
        });
        return this.notificationRepository.save(notification);
    }
    async findAll(paginationDto, userId) {
        const { page = 1, limit = 10 } = paginationDto;
        const skip = (page - 1) * limit;
        const [notifications, total] = await this.notificationRepository.findAndCount({
            where: { userId },
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return {
            data: notifications,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async markAsRead(id, userId) {
        const notification = await this.notificationRepository.findOne({
            where: { id, userId },
        });
        if (!notification) {
            throw new common_1.NotFoundException(`Notification with ID ${id} not found`);
        }
        notification.read = true;
        return this.notificationRepository.save(notification);
    }
    async markAllAsRead(userId) {
        await this.notificationRepository.update({ userId, read: false }, { read: true });
    }
    async getUnreadCount(userId) {
        const count = await this.notificationRepository.count({
            where: { userId, read: false },
        });
        return { count };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_log_entity_1.NotificationLog)),
    __metadata("design:paramtypes", [Object])
], NotificationsService);


/***/ }),

/***/ "./src/modules/projects/dto/create-project.dto.ts":
/*!********************************************************!*\
  !*** ./src/modules/projects/dto/create-project.dto.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateProjectDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");
const enums_1 = __webpack_require__(/*! ../../../common/enums */ "./src/common/enums/index.ts");
class CreateProjectDto {
    constructor() {
        this.priority = enums_1.Priority.MEDIUM;
        this.status = 'not_started';
    }
}
exports.CreateProjectDto = CreateProjectDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "E-commerce Platform" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "A modern e-commerce platform with React and Node.js" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "2024-01-01" }),
    (0, class_transformer_1.Transform)(({ value }) => value ? new Date(value) : undefined),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], CreateProjectDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "2024-06-01" }),
    (0, class_transformer_1.Transform)(({ value }) => value ? new Date(value) : undefined),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], CreateProjectDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: enums_1.Priority, default: enums_1.Priority.MEDIUM }),
    (0, class_validator_1.IsEnum)(enums_1.Priority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_c = typeof enums_1.Priority !== "undefined" && enums_1.Priority) === "function" ? _c : Object)
], CreateProjectDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: ['not_started', 'in_progress', 'completed', 'on_hold'],
        default: 'not_started'
    }),
    (0, class_validator_1.IsEnum)(['not_started', 'in_progress', 'completed', 'on_hold']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ["frontend", "backend", "e-commerce"] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateProjectDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: ["john@example.com", "jane@example.com"],
        description: "Email addresses of users to invite as project members"
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEmail)({}, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateProjectDto.prototype, "memberEmails", void 0);


/***/ }),

/***/ "./src/modules/projects/dto/update-project.dto.ts":
/*!********************************************************!*\
  !*** ./src/modules/projects/dto/update-project.dto.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateProjectDto = void 0;
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const create_project_dto_1 = __webpack_require__(/*! ./create-project.dto */ "./src/modules/projects/dto/create-project.dto.ts");
class UpdateProjectDto extends (0, swagger_1.PartialType)(create_project_dto_1.CreateProjectDto) {
}
exports.UpdateProjectDto = UpdateProjectDto;


/***/ }),

/***/ "./src/modules/projects/projects.controller.ts":
/*!*****************************************************!*\
  !*** ./src/modules/projects/projects.controller.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProjectsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const projects_service_1 = __webpack_require__(/*! ./projects.service */ "./src/modules/projects/projects.service.ts");
const create_project_dto_1 = __webpack_require__(/*! ./dto/create-project.dto */ "./src/modules/projects/dto/create-project.dto.ts");
const update_project_dto_1 = __webpack_require__(/*! ./dto/update-project.dto */ "./src/modules/projects/dto/update-project.dto.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
const pagination_dto_1 = __webpack_require__(/*! ../../common/dtos/pagination.dto */ "./src/common/dtos/pagination.dto.ts");
let ProjectsController = class ProjectsController {
    constructor(projectsService) {
        this.projectsService = projectsService;
    }
    create(createProjectDto, req) {
        return this.projectsService.create(createProjectDto, req.user.id);
    }
    findAll(paginationDto, req) {
        console.log('Projects Controller - User ID:', req.user.id);
        console.log('Projects Controller - Headers:', req.headers.authorization ? 'AUTH_HEADER_PRESENT' : 'AUTH_HEADER_MISSING');
        return this.projectsService.findAll(paginationDto, req.user.id);
    }
    findOne(id, req) {
        return this.projectsService.findOne(id, req.user.id);
    }
    update(id, updateProjectDto, req) {
        return this.projectsService.update(id, updateProjectDto, req.user.id);
    }
    remove(id, req) {
        return this.projectsService.remove(id, req.user.id);
    }
};
exports.ProjectsController = ProjectsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a new project" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_project_dto_1.CreateProjectDto !== "undefined" && create_project_dto_1.CreateProjectDto) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all projects" }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof pagination_dto_1.PaginationDto !== "undefined" && pagination_dto_1.PaginationDto) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get project by ID" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Update project by ID" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof update_project_dto_1.UpdateProjectDto !== "undefined" && update_project_dto_1.UpdateProjectDto) === "function" ? _d : Object, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Delete project" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "remove", null);
exports.ProjectsController = ProjectsController = __decorate([
    (0, swagger_1.ApiTags)("projects"),
    (0, common_1.Controller)("projects"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof projects_service_1.ProjectsService !== "undefined" && projects_service_1.ProjectsService) === "function" ? _a : Object])
], ProjectsController);


/***/ }),

/***/ "./src/modules/projects/projects.module.ts":
/*!*************************************************!*\
  !*** ./src/modules/projects/projects.module.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProjectsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const projects_controller_1 = __webpack_require__(/*! ./projects.controller */ "./src/modules/projects/projects.controller.ts");
const projects_service_1 = __webpack_require__(/*! ./projects.service */ "./src/modules/projects/projects.service.ts");
const project_entity_1 = __webpack_require__(/*! ../../entities/project.entity */ "./src/entities/project.entity.ts");
const user_entity_1 = __webpack_require__(/*! ../../entities/user.entity */ "./src/entities/user.entity.ts");
const project_invitation_entity_1 = __webpack_require__(/*! ../../entities/project-invitation.entity */ "./src/entities/project-invitation.entity.ts");
const notification_log_entity_1 = __webpack_require__(/*! ../../entities/notification-log.entity */ "./src/entities/notification-log.entity.ts");
const email_service_1 = __webpack_require__(/*! ../auth/email.service */ "./src/modules/auth/email.service.ts");
const notifications_service_1 = __webpack_require__(/*! ../notifications/notifications.service */ "./src/modules/notifications/notifications.service.ts");
let ProjectsModule = class ProjectsModule {
};
exports.ProjectsModule = ProjectsModule;
exports.ProjectsModule = ProjectsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([project_entity_1.Project, user_entity_1.User, project_invitation_entity_1.ProjectInvitation, notification_log_entity_1.NotificationLog])],
        controllers: [projects_controller_1.ProjectsController],
        providers: [projects_service_1.ProjectsService, email_service_1.EmailService, notifications_service_1.NotificationsService],
        exports: [projects_service_1.ProjectsService],
    })
], ProjectsModule);


/***/ }),

/***/ "./src/modules/projects/projects.service.ts":
/*!**************************************************!*\
  !*** ./src/modules/projects/projects.service.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProjectsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
const project_entity_1 = __webpack_require__(/*! ../../entities/project.entity */ "./src/entities/project.entity.ts");
const user_entity_1 = __webpack_require__(/*! ../../entities/user.entity */ "./src/entities/user.entity.ts");
const project_invitation_entity_1 = __webpack_require__(/*! ../../entities/project-invitation.entity */ "./src/entities/project-invitation.entity.ts");
const email_service_1 = __webpack_require__(/*! ../auth/email.service */ "./src/modules/auth/email.service.ts");
const notifications_service_1 = __webpack_require__(/*! ../notifications/notifications.service */ "./src/modules/notifications/notifications.service.ts");
const enums_1 = __webpack_require__(/*! ../../common/enums */ "./src/common/enums/index.ts");
const uuid_1 = __webpack_require__(/*! uuid */ "uuid");
let ProjectsService = class ProjectsService {
    constructor(projectRepository, userRepository, invitationRepository, emailService, notificationsService) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.invitationRepository = invitationRepository;
        this.emailService = emailService;
        this.notificationsService = notificationsService;
    }
    async create(createProjectDto, ownerId) {
        const { memberEmails, ...projectData } = createProjectDto;
        const owner = await this.userRepository.findOne({ where: { id: ownerId } });
        if (!owner) {
            throw new common_1.NotFoundException('Owner not found');
        }
        const project = this.projectRepository.create({
            ...projectData,
            owner: { id: ownerId },
            members: [{ id: ownerId }],
        });
        const savedProject = await this.projectRepository.save(project);
        if (memberEmails && memberEmails.length > 0) {
            await this.inviteMembers(savedProject, memberEmails, owner);
            const projectWithMembers = await this.projectRepository.findOne({
                where: { id: savedProject.id },
                relations: ['owner', 'members', 'tasks', 'issues'],
            });
            return projectWithMembers || savedProject;
        }
        return savedProject;
    }
    async inviteMembers(project, memberEmails, inviter) {
        for (const email of memberEmails) {
            if (email === inviter.email) {
                continue;
            }
            const existingUser = await this.userRepository.findOne({ where: { email } });
            if (existingUser) {
                const currentProject = await this.projectRepository.findOne({
                    where: { id: project.id },
                    relations: ['members']
                });
                if (currentProject) {
                    const isAlreadyMember = currentProject.members.some(member => member.id === existingUser.id);
                    if (!isAlreadyMember) {
                        currentProject.members.push(existingUser);
                        await this.projectRepository.save(currentProject);
                        try {
                            await this.emailService.add('project-member-added', {
                                email: existingUser.email,
                                memberName: existingUser.name,
                                projectName: project.name,
                                projectDescription: project.description,
                                projectId: project.id,
                                inviterName: inviter.name
                            });
                        }
                        catch (error) {
                            console.error(`Failed to send member notification email to ${existingUser.email}:`, error);
                        }
                        try {
                            await this.notificationsService.create(existingUser.id, `You have been added to project "${project.name}" by ${inviter.name}`, enums_1.NotificationType.PROJECT_MEMBER_ADDED);
                        }
                        catch (error) {
                            console.error(`Failed to create in-app notification for user ${existingUser.id}:`, error);
                        }
                    }
                }
            }
            else {
                const invitationToken = (0, uuid_1.v4)();
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 7);
                const invitation = this.invitationRepository.create({
                    email,
                    token: invitationToken,
                    expiresAt,
                    project: { id: project.id },
                    invitedBy: { id: inviter.id },
                    status: 'pending'
                });
                await this.invitationRepository.save(invitation);
                try {
                    await this.emailService.add('project-invitation', {
                        email,
                        projectName: project.name,
                        projectDescription: project.description,
                        inviterName: inviter.name,
                        invitationToken
                    });
                }
                catch (error) {
                    console.error(`Failed to send invitation email to ${email}:`, error);
                }
            }
        }
    }
    async findAll(paginationDto, userId) {
        const { page = 1, limit = 10 } = paginationDto;
        const skip = (page - 1) * limit;
        console.log('ProjectsService.findAll - User ID:', userId);
        const queryBuilder = this.projectRepository
            .createQueryBuilder('project')
            .leftJoinAndSelect('project.owner', 'owner')
            .leftJoinAndSelect('project.members', 'members')
            .where('project.ownerId = :userId OR members.id = :userId', { userId })
            .skip(skip)
            .take(limit)
            .orderBy('project.createdAt', 'DESC');
        const [projects, total] = await queryBuilder.getManyAndCount();
        console.log('ProjectsService.findAll - Found projects:', projects.length);
        console.log('ProjectsService.findAll - Project IDs:', projects.map(p => p.id));
        return {
            data: projects,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id, userId) {
        const project = await this.projectRepository.findOne({
            where: { id },
            relations: ['owner', 'members', 'tasks', 'issues'],
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${id} not found`);
        }
        const hasAccess = project.owner.id === userId ||
            project.members?.some((member) => member.id === userId);
        if (!hasAccess) {
            throw new common_1.ForbiddenException('You do not have access to this project');
        }
        return project;
    }
    async update(id, updateProjectDto, userId) {
        const project = await this.findOne(id, userId);
        if (project.owner.id !== userId) {
            throw new common_1.ForbiddenException('Only project owner can update the project');
        }
        Object.assign(project, updateProjectDto);
        return this.projectRepository.save(project);
    }
    async remove(id, userId) {
        const project = await this.findOne(id, userId);
        if (project.owner.id !== userId) {
            throw new common_1.ForbiddenException('Only project owner can delete the project');
        }
        await this.projectRepository.softDelete(id);
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(project_invitation_entity_1.ProjectInvitation)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof email_service_1.EmailService !== "undefined" && email_service_1.EmailService) === "function" ? _d : Object, typeof (_e = typeof notifications_service_1.NotificationsService !== "undefined" && notifications_service_1.NotificationsService) === "function" ? _e : Object])
], ProjectsService);


/***/ }),

/***/ "./src/modules/reports/reports.controller.ts":
/*!***************************************************!*\
  !*** ./src/modules/reports/reports.controller.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const express_1 = __webpack_require__(/*! express */ "express");
const reports_service_1 = __webpack_require__(/*! ./reports.service */ "./src/modules/reports/reports.service.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
let ReportsController = class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    getBurndownChart(projectId, req) {
        return this.reportsService.getBurndownChart(projectId, req.user.id);
    }
    getVelocityReport(query, req) {
        return this.reportsService.getVelocityReport(query, req.user.id);
    }
    getOverdueTasks(query, req) {
        return this.reportsService.getOverdueTasks(query, req.user.id);
    }
    exportToCsv(query, req, res) {
        return this.reportsService.exportToCsv(query, req.user.id, res);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)("burndown"),
    (0, swagger_1.ApiOperation)({ summary: "Get burndown chart data for a project" }),
    __param(0, (0, common_1.Query)('projectId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getBurndownChart", null);
__decorate([
    (0, common_1.Get)("velocity"),
    (0, swagger_1.ApiOperation)({ summary: "Get task velocity report" }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getVelocityReport", null);
__decorate([
    (0, common_1.Get)("overdue"),
    (0, swagger_1.ApiOperation)({ summary: "Get overdue tasks report" }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getOverdueTasks", null);
__decorate([
    (0, common_1.Get)("export"),
    (0, swagger_1.ApiOperation)({ summary: "Export reports to CSV" }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, typeof (_b = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "exportToCsv", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)("reports"),
    (0, common_1.Controller)("reports"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof reports_service_1.ReportsService !== "undefined" && reports_service_1.ReportsService) === "function" ? _a : Object])
], ReportsController);


/***/ }),

/***/ "./src/modules/reports/reports.module.ts":
/*!***********************************************!*\
  !*** ./src/modules/reports/reports.module.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const reports_controller_1 = __webpack_require__(/*! ./reports.controller */ "./src/modules/reports/reports.controller.ts");
const reports_service_1 = __webpack_require__(/*! ./reports.service */ "./src/modules/reports/reports.service.ts");
const task_entity_1 = __webpack_require__(/*! ../../entities/task.entity */ "./src/entities/task.entity.ts");
const project_entity_1 = __webpack_require__(/*! ../../entities/project.entity */ "./src/entities/project.entity.ts");
const time_log_entity_1 = __webpack_require__(/*! ../../entities/time-log.entity */ "./src/entities/time-log.entity.ts");
let ReportsModule = class ReportsModule {
};
exports.ReportsModule = ReportsModule;
exports.ReportsModule = ReportsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([task_entity_1.Task, project_entity_1.Project, time_log_entity_1.TimeLog])],
        controllers: [reports_controller_1.ReportsController],
        providers: [reports_service_1.ReportsService],
        exports: [reports_service_1.ReportsService],
    })
], ReportsModule);


/***/ }),

/***/ "./src/modules/reports/reports.service.ts":
/*!************************************************!*\
  !*** ./src/modules/reports/reports.service.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const task_entity_1 = __webpack_require__(/*! ../../entities/task.entity */ "./src/entities/task.entity.ts");
const project_entity_1 = __webpack_require__(/*! ../../entities/project.entity */ "./src/entities/project.entity.ts");
const time_log_entity_1 = __webpack_require__(/*! ../../entities/time-log.entity */ "./src/entities/time-log.entity.ts");
const enums_1 = __webpack_require__(/*! ../../common/enums */ "./src/common/enums/index.ts");
let ReportsService = class ReportsService {
    constructor(taskRepository, projectRepository, timeLogRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.timeLogRepository = timeLogRepository;
    }
    async getBurndownChart(projectId, userId) {
        const project = await this.projectRepository.findOne({
            where: { id: projectId },
            relations: ['tasks'],
        });
        if (!project) {
            throw new Error('Project not found');
        }
        const tasks = await this.taskRepository.find({
            where: { project: { id: projectId } },
            order: { createdAt: 'ASC' },
        });
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter((task) => task.status === enums_1.TaskStatus.DONE).length;
        const remainingTasks = totalTasks - completedTasks;
        return {
            projectId,
            totalTasks,
            completedTasks,
            remainingTasks,
            completionPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
            tasks: tasks.map((task) => ({
                id: task.id,
                title: task.title,
                status: task.status,
                progress: task.progress,
                createdAt: task.createdAt,
            })),
        };
    }
    async getVelocityReport(query, userId) {
        const { projectId, startDate, endDate } = query;
        const queryBuilder = this.taskRepository
            .createQueryBuilder('task')
            .where('task.status = :status', { status: enums_1.TaskStatus.DONE });
        if (projectId) {
            queryBuilder.andWhere('task.projectId = :projectId', { projectId });
        }
        if (startDate && endDate) {
            queryBuilder.andWhere('task.updatedAt BETWEEN :startDate AND :endDate', {
                startDate,
                endDate,
            });
        }
        const completedTasks = await queryBuilder.getMany();
        return {
            totalCompleted: completedTasks.length,
            averageCompletionTime: this.calculateAverageCompletionTime(completedTasks),
            tasksPerWeek: this.calculateTasksPerWeek(completedTasks),
            completedTasks,
        };
    }
    async getOverdueTasks(query, userId) {
        const { projectId } = query;
        const now = new Date();
        const queryBuilder = this.taskRepository
            .createQueryBuilder('task')
            .leftJoinAndSelect('task.assignee', 'assignee')
            .leftJoinAndSelect('task.project', 'project')
            .where('task.deadline < :now AND task.status != :doneStatus', {
            now,
            doneStatus: enums_1.TaskStatus.DONE,
        });
        if (projectId) {
            queryBuilder.andWhere('task.projectId = :projectId', { projectId });
        }
        const overdueTasks = await queryBuilder.getMany();
        return {
            totalOverdue: overdueTasks.length,
            overdueTasks,
        };
    }
    async exportToCsv(query, userId, res) {
        const { type = 'tasks', projectId } = query;
        let data = [];
        let filename = '';
        if (type === 'tasks') {
            const queryBuilder = this.taskRepository
                .createQueryBuilder('task')
                .leftJoinAndSelect('task.assignee', 'assignee')
                .leftJoinAndSelect('task.project', 'project');
            if (projectId) {
                queryBuilder.where('task.projectId = :projectId', { projectId });
            }
            data = await queryBuilder.getMany();
            filename = 'tasks-export.csv';
        }
        const csv = this.convertToCSV(data);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.send(csv);
    }
    calculateAverageCompletionTime(tasks) {
        if (tasks.length === 0)
            return 0;
        const totalTime = tasks.reduce((sum, task) => {
            const createdAt = new Date(task.createdAt).getTime();
            const updatedAt = new Date(task.updatedAt).getTime();
            return sum + (updatedAt - createdAt);
        }, 0);
        return Math.round(totalTime / tasks.length / (1000 * 60 * 60 * 24));
    }
    calculateTasksPerWeek(tasks) {
        if (tasks.length === 0)
            return 0;
        const weeks = Math.ceil(tasks.length / 7);
        return Math.round(tasks.length / weeks);
    }
    convertToCSV(data) {
        if (data.length === 0)
            return '';
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map((item) => Object.values(item)
            .map((value) => (typeof value === 'string' ? `"${value}"` : value))
            .join(','));
        return [headers, ...rows].join('\n');
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __param(1, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(2, (0, typeorm_1.InjectRepository)(time_log_entity_1.TimeLog)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ReportsService);


/***/ }),

/***/ "./src/modules/tasks/dto/create-task.dto.ts":
/*!**************************************************!*\
  !*** ./src/modules/tasks/dto/create-task.dto.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateTaskDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");
const enums_1 = __webpack_require__(/*! ../../../common/enums */ "./src/common/enums/index.ts");
class CreateTaskDto {
    constructor() {
        this.status = enums_1.TaskStatus.TODO;
        this.progress = 0;
        this.priority = enums_1.Priority.MEDIUM;
    }
}
exports.CreateTaskDto = CreateTaskDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Implement user authentication" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Create JWT-based authentication system with login/register" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: enums_1.TaskStatus, default: enums_1.TaskStatus.TODO }),
    (0, class_validator_1.IsEnum)(enums_1.TaskStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_a = typeof enums_1.TaskStatus !== "undefined" && enums_1.TaskStatus) === "function" ? _a : Object)
], CreateTaskDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0, minimum: 0, maximum: 100 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateTaskDto.prototype, "progress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "2024-12-31" }),
    (0, class_transformer_1.Transform)(({ value }) => value ? new Date(value) : undefined),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], CreateTaskDto.prototype, "deadline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "uuid-of-project" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "uuid-of-assignee" }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "assigneeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: enums_1.Priority, default: enums_1.Priority.MEDIUM }),
    (0, class_validator_1.IsEnum)(enums_1.Priority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_c = typeof enums_1.Priority !== "undefined" && enums_1.Priority) === "function" ? _c : Object)
], CreateTaskDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: ["https://res.cloudinary.com/file1.pdf", "https://res.cloudinary.com/image1.jpg"],
        description: "Array of Cloudinary URLs for task attachments uploaded from frontend",
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateTaskDto.prototype, "attachments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ["uuid-of-dependency-task"] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)(undefined, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateTaskDto.prototype, "dependencyIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 8, description: "Estimated hours to complete the task" }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateTaskDto.prototype, "estimatedHours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ["frontend", "urgent"], description: "Tags for categorizing tasks" }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateTaskDto.prototype, "tags", void 0);


/***/ }),

/***/ "./src/modules/tasks/dto/update-task.dto.ts":
/*!**************************************************!*\
  !*** ./src/modules/tasks/dto/update-task.dto.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateTaskDto = void 0;
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const create_task_dto_1 = __webpack_require__(/*! ./create-task.dto */ "./src/modules/tasks/dto/create-task.dto.ts");
class UpdateTaskDto extends (0, swagger_1.PartialType)(create_task_dto_1.CreateTaskDto) {
}
exports.UpdateTaskDto = UpdateTaskDto;


/***/ }),

/***/ "./src/modules/tasks/tasks.controller.ts":
/*!***********************************************!*\
  !*** ./src/modules/tasks/tasks.controller.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TasksController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const tasks_service_1 = __webpack_require__(/*! ./tasks.service */ "./src/modules/tasks/tasks.service.ts");
const create_task_dto_1 = __webpack_require__(/*! ./dto/create-task.dto */ "./src/modules/tasks/dto/create-task.dto.ts");
const update_task_dto_1 = __webpack_require__(/*! ./dto/update-task.dto */ "./src/modules/tasks/dto/update-task.dto.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
let TasksController = class TasksController {
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    create(createTaskDto, req) {
        return this.tasksService.create(createTaskDto, req.user.id);
    }
    findAll(query, req) {
        return this.tasksService.findAll(query, req.user.id);
    }
    findOne(id, req) {
        return this.tasksService.findOne(id, req.user.id);
    }
    update(id, updateTaskDto, req) {
        return this.tasksService.update(id, updateTaskDto, req.user.id);
    }
    remove(id, req) {
        return this.tasksService.remove(id, req.user.id);
    }
    addSubtask(id, createTaskDto, req) {
        return this.tasksService.addSubtask(id, createTaskDto, req.user.id);
    }
};
exports.TasksController = TasksController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a new task" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_task_dto_1.CreateTaskDto !== "undefined" && create_task_dto_1.CreateTaskDto) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all tasks with pagination and filters" }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get task by ID" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Update task by ID" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_task_dto_1.UpdateTaskDto !== "undefined" && update_task_dto_1.UpdateTaskDto) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Delete task" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(":id/subtasks"),
    (0, swagger_1.ApiOperation)({ summary: "Add subtask to a task" }),
    __param(0, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof create_task_dto_1.CreateTaskDto !== "undefined" && create_task_dto_1.CreateTaskDto) === "function" ? _d : Object, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "addSubtask", null);
exports.TasksController = TasksController = __decorate([
    (0, swagger_1.ApiTags)("tasks"),
    (0, common_1.Controller)("tasks"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof tasks_service_1.TasksService !== "undefined" && tasks_service_1.TasksService) === "function" ? _a : Object])
], TasksController);


/***/ }),

/***/ "./src/modules/tasks/tasks.module.ts":
/*!*******************************************!*\
  !*** ./src/modules/tasks/tasks.module.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TasksModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const tasks_service_1 = __webpack_require__(/*! ./tasks.service */ "./src/modules/tasks/tasks.service.ts");
const tasks_controller_1 = __webpack_require__(/*! ./tasks.controller */ "./src/modules/tasks/tasks.controller.ts");
const task_entity_1 = __webpack_require__(/*! ../../entities/task.entity */ "./src/entities/task.entity.ts");
const user_entity_1 = __webpack_require__(/*! ../../entities/user.entity */ "./src/entities/user.entity.ts");
const project_entity_1 = __webpack_require__(/*! ../../entities/project.entity */ "./src/entities/project.entity.ts");
const notification_log_entity_1 = __webpack_require__(/*! ../../entities/notification-log.entity */ "./src/entities/notification-log.entity.ts");
const email_service_1 = __webpack_require__(/*! ../auth/email.service */ "./src/modules/auth/email.service.ts");
const notifications_service_1 = __webpack_require__(/*! ../notifications/notifications.service */ "./src/modules/notifications/notifications.service.ts");
let TasksModule = class TasksModule {
};
exports.TasksModule = TasksModule;
exports.TasksModule = TasksModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([task_entity_1.Task, user_entity_1.User, project_entity_1.Project, notification_log_entity_1.NotificationLog])],
        controllers: [tasks_controller_1.TasksController],
        providers: [tasks_service_1.TasksService, email_service_1.EmailService, notifications_service_1.NotificationsService],
        exports: [tasks_service_1.TasksService],
    })
], TasksModule);


/***/ }),

/***/ "./src/modules/tasks/tasks.service.ts":
/*!********************************************!*\
  !*** ./src/modules/tasks/tasks.service.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TasksService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const task_entity_1 = __webpack_require__(/*! ../../entities/task.entity */ "./src/entities/task.entity.ts");
const user_entity_1 = __webpack_require__(/*! ../../entities/user.entity */ "./src/entities/user.entity.ts");
const project_entity_1 = __webpack_require__(/*! ../../entities/project.entity */ "./src/entities/project.entity.ts");
const email_service_1 = __webpack_require__(/*! ../auth/email.service */ "./src/modules/auth/email.service.ts");
const notifications_service_1 = __webpack_require__(/*! ../notifications/notifications.service */ "./src/modules/notifications/notifications.service.ts");
const enums_1 = __webpack_require__(/*! ../../common/enums */ "./src/common/enums/index.ts");
let TasksService = class TasksService {
    constructor(taskRepository, userRepository, projectRepository, emailService, notificationsService) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.emailService = emailService;
        this.notificationsService = notificationsService;
    }
    async create(createTaskDto, creatorId) {
        const project = await this.validateProjectAccess(createTaskDto.projectId, creatorId);
        if (createTaskDto.assigneeId && createTaskDto.assigneeId !== creatorId) {
            if (project.owner.id !== creatorId) {
                throw new common_1.ForbiddenException('Only project owners can assign tasks to other members');
            }
            await this.validateAssigneeAccess(createTaskDto.assigneeId, project);
        }
        const task = this.taskRepository.create({
            ...createTaskDto,
            attachments: createTaskDto.attachments || [],
            assignee: createTaskDto.assigneeId
                ? { id: createTaskDto.assigneeId }
                : null,
            project: { id: createTaskDto.projectId },
        });
        const savedTask = await this.taskRepository.save(task);
        if (createTaskDto.assigneeId && createTaskDto.assigneeId !== creatorId) {
            await this.sendTaskAssignmentNotifications(savedTask, creatorId, 'assigned');
        }
        return savedTask;
    }
    async findAll(query, userId) {
        const { page = 1, limit = 10, status, projectId, assigneeId } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.taskRepository
            .createQueryBuilder('task')
            .leftJoinAndSelect('task.assignee', 'assignee')
            .leftJoinAndSelect('task.project', 'project')
            .leftJoinAndSelect('project.members', 'members')
            .leftJoinAndSelect('task.subtasks', 'subtasks')
            .where('(project.ownerId = :userId OR members.id = :userId)', {
            userId,
        });
        if (status) {
            queryBuilder.andWhere('task.status = :status', { status });
        }
        if (projectId) {
            queryBuilder.andWhere('task.projectId = :projectId', { projectId });
        }
        if (assigneeId) {
            queryBuilder.andWhere('task.assigneeId = :assigneeId', { assigneeId });
        }
        const [tasks, total] = await queryBuilder
            .skip(skip)
            .take(limit)
            .orderBy('task.createdAt', 'DESC')
            .getManyAndCount();
        return {
            data: tasks,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id, userId) {
        const task = await this.taskRepository.findOne({
            where: { id },
            relations: ['assignee', 'project', 'project.members', 'project.owner', 'subtasks', 'dependencies'],
        });
        if (!task) {
            throw new common_1.NotFoundException(`Task with ID ${id} not found`);
        }
        const hasAccess = task.project.owner.id === userId ||
            task.project.members?.some((member) => member.id === userId);
        if (!hasAccess) {
            throw new common_1.ForbiddenException('You do not have access to this task');
        }
        return task;
    }
    async update(id, updateTaskDto, userId) {
        const task = await this.findOne(id, userId);
        const oldAssigneeId = task.assignee?.id;
        if (updateTaskDto.assigneeId && updateTaskDto.assigneeId !== userId && updateTaskDto.assigneeId !== oldAssigneeId) {
            if (task.project.owner.id !== userId) {
                throw new common_1.ForbiddenException('Only project owners can assign tasks to other members');
            }
            await this.validateAssigneeAccess(updateTaskDto.assigneeId, task.project);
        }
        if (updateTaskDto.attachments) {
            task.attachments = updateTaskDto.attachments;
        }
        Object.assign(task, updateTaskDto);
        const updatedTask = await this.taskRepository.save(task);
        if (updateTaskDto.assigneeId && updateTaskDto.assigneeId !== oldAssigneeId && updateTaskDto.assigneeId !== userId) {
            await this.sendTaskAssignmentNotifications(updatedTask, userId, 'assigned');
        }
        if (updateTaskDto.status && updateTaskDto.status !== task.status) {
            await this.sendTaskUpdateNotifications(updatedTask, userId, 'status_updated');
        }
        return updatedTask;
    }
    async remove(id, userId) {
        const task = await this.findOne(id, userId);
        await this.taskRepository.softDelete(id);
    }
    async addSubtask(parentId, createTaskDto, userId) {
        const parentTask = await this.findOne(parentId, userId);
        const subtask = await this.create(createTaskDto, userId);
        subtask.parentTask = parentTask;
        subtask.parentTaskId = parentTask.id;
        return this.taskRepository.save(subtask);
    }
    async sendTaskAssignmentNotifications(task, assignerId, action) {
        try {
            const assignee = await this.userRepository.findOne({
                where: { id: task.assignee.id },
                relations: ['notifications']
            });
            const assigner = await this.userRepository.findOne({ where: { id: assignerId } });
            if (!assignee || !assigner)
                return;
            await this.notificationsService.create(assignee.id, `You have been assigned to task "${task.title}" by ${assigner.name}`, enums_1.NotificationType.TASK_ASSIGNED);
            await this.emailService.add('task-assignment', {
                email: assignee.email,
                assigneeName: assignee.name,
                taskTitle: task.title,
                taskDescription: task.description,
                taskId: task.id,
                assignerName: assigner.name,
                dueDate: task.deadline,
                priority: task.priority
            });
        }
        catch (error) {
            console.error(`Failed to send task assignment notifications:`, error);
        }
    }
    async sendTaskUpdateNotifications(task, updaterId, updateType) {
        try {
            const assignee = await this.userRepository.findOne({
                where: { id: task.assignee?.id },
                relations: ['notifications']
            });
            const updater = await this.userRepository.findOne({ where: { id: updaterId } });
            if (!assignee || !updater || assignee.id === updater.id)
                return;
            await this.notificationsService.create(assignee.id, `Task "${task.title}" has been updated by ${updater.name}. Status: ${task.status}`, enums_1.NotificationType.TASK_UPDATED);
            if (task.status === 'done' || task.status === 'blocked') {
                await this.emailService.add('task-update', {
                    email: assignee.email,
                    assigneeName: assignee.name,
                    taskTitle: task.title,
                    taskId: task.id,
                    updaterName: updater.name,
                    newStatus: task.status,
                    updateType
                });
            }
        }
        catch (error) {
            console.error(`Failed to send task update notifications:`, error);
        }
    }
    async validateProjectAccess(projectId, userId) {
        const project = await this.projectRepository.findOne({
            where: { id: projectId },
            relations: ['owner', 'members'],
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${projectId} not found`);
        }
        const hasAccess = project.owner.id === userId ||
            project.members?.some((member) => member.id === userId);
        if (!hasAccess) {
            throw new common_1.ForbiddenException('You do not have access to this project');
        }
        return project;
    }
    async validateAssigneeAccess(assigneeId, project) {
        if (project.owner.id === assigneeId) {
            return;
        }
        const isProjectMember = project.members?.some((member) => member.id === assigneeId);
        if (!isProjectMember) {
            throw new common_1.ForbiddenException('Tasks can only be assigned to project members');
        }
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __metadata("design:paramtypes", [Object, Object, Object, typeof (_a = typeof email_service_1.EmailService !== "undefined" && email_service_1.EmailService) === "function" ? _a : Object, typeof (_b = typeof notifications_service_1.NotificationsService !== "undefined" && notifications_service_1.NotificationsService) === "function" ? _b : Object])
], TasksService);


/***/ }),

/***/ "./src/modules/time-tracking/dto/start-time-log.dto.ts":
/*!*************************************************************!*\
  !*** ./src/modules/time-tracking/dto/start-time-log.dto.ts ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StartTimeLogDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class StartTimeLogDto {
}
exports.StartTimeLogDto = StartTimeLogDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "uuid-of-task" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], StartTimeLogDto.prototype, "taskId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Working on authentication implementation" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], StartTimeLogDto.prototype, "description", void 0);


/***/ }),

/***/ "./src/modules/time-tracking/dto/stop-time-log.dto.ts":
/*!************************************************************!*\
  !*** ./src/modules/time-tracking/dto/stop-time-log.dto.ts ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StopTimeLogDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class StopTimeLogDto {
}
exports.StopTimeLogDto = StopTimeLogDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Completed JWT implementation and testing" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], StopTimeLogDto.prototype, "description", void 0);


/***/ }),

/***/ "./src/modules/time-tracking/time-tracking.controller.ts":
/*!***************************************************************!*\
  !*** ./src/modules/time-tracking/time-tracking.controller.ts ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TimeTrackingController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const time_tracking_service_1 = __webpack_require__(/*! ./time-tracking.service */ "./src/modules/time-tracking/time-tracking.service.ts");
const start_time_log_dto_1 = __webpack_require__(/*! ./dto/start-time-log.dto */ "./src/modules/time-tracking/dto/start-time-log.dto.ts");
const stop_time_log_dto_1 = __webpack_require__(/*! ./dto/stop-time-log.dto */ "./src/modules/time-tracking/dto/stop-time-log.dto.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
let TimeTrackingController = class TimeTrackingController {
    constructor(timeTrackingService) {
        this.timeTrackingService = timeTrackingService;
    }
    startTimer(startTimeLogDto, req) {
        return this.timeTrackingService.startTimer(startTimeLogDto, req.user.id);
    }
    stopTimer(stopTimeLogDto, req) {
        return this.timeTrackingService.stopTimer(stopTimeLogDto, req.user.id);
    }
    getLogs(query, req) {
        return this.timeTrackingService.getLogs(query, req.user.id);
    }
    getReports(query, req) {
        return this.timeTrackingService.getReports(query, req.user.id);
    }
};
exports.TimeTrackingController = TimeTrackingController;
__decorate([
    (0, common_1.Post)("start"),
    (0, swagger_1.ApiOperation)({ summary: "Start time tracking for a task" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof start_time_log_dto_1.StartTimeLogDto !== "undefined" && start_time_log_dto_1.StartTimeLogDto) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", void 0)
], TimeTrackingController.prototype, "startTimer", null);
__decorate([
    (0, common_1.Post)("stop"),
    (0, swagger_1.ApiOperation)({ summary: "Stop time tracking" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof stop_time_log_dto_1.StopTimeLogDto !== "undefined" && stop_time_log_dto_1.StopTimeLogDto) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", void 0)
], TimeTrackingController.prototype, "stopTimer", null);
__decorate([
    (0, common_1.Get)("logs"),
    (0, swagger_1.ApiOperation)({ summary: "Get time logs with filters" }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TimeTrackingController.prototype, "getLogs", null);
__decorate([
    (0, common_1.Get)("reports"),
    (0, swagger_1.ApiOperation)({ summary: "Get time tracking reports" }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TimeTrackingController.prototype, "getReports", null);
exports.TimeTrackingController = TimeTrackingController = __decorate([
    (0, swagger_1.ApiTags)("time-tracking"),
    (0, common_1.Controller)("time-tracking"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof time_tracking_service_1.TimeTrackingService !== "undefined" && time_tracking_service_1.TimeTrackingService) === "function" ? _a : Object])
], TimeTrackingController);


/***/ }),

/***/ "./src/modules/time-tracking/time-tracking.module.ts":
/*!***********************************************************!*\
  !*** ./src/modules/time-tracking/time-tracking.module.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TimeTrackingModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const time_tracking_controller_1 = __webpack_require__(/*! ./time-tracking.controller */ "./src/modules/time-tracking/time-tracking.controller.ts");
const time_tracking_service_1 = __webpack_require__(/*! ./time-tracking.service */ "./src/modules/time-tracking/time-tracking.service.ts");
const time_log_entity_1 = __webpack_require__(/*! ../../entities/time-log.entity */ "./src/entities/time-log.entity.ts");
let TimeTrackingModule = class TimeTrackingModule {
};
exports.TimeTrackingModule = TimeTrackingModule;
exports.TimeTrackingModule = TimeTrackingModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([time_log_entity_1.TimeLog])],
        controllers: [time_tracking_controller_1.TimeTrackingController],
        providers: [time_tracking_service_1.TimeTrackingService],
        exports: [time_tracking_service_1.TimeTrackingService],
    })
], TimeTrackingModule);


/***/ }),

/***/ "./src/modules/time-tracking/time-tracking.service.ts":
/*!************************************************************!*\
  !*** ./src/modules/time-tracking/time-tracking.service.ts ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TimeTrackingService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const time_log_entity_1 = __webpack_require__(/*! ../../entities/time-log.entity */ "./src/entities/time-log.entity.ts");
let TimeTrackingService = class TimeTrackingService {
    constructor(timeLogRepository) {
        this.timeLogRepository = timeLogRepository;
    }
    async startTimer(startTimeLogDto, userId) {
        const activeTimer = await this.timeLogRepository.findOne({
            where: { user: { id: userId }, endTime: null },
        });
        if (activeTimer) {
            throw new common_1.BadRequestException('You already have an active timer. Please stop it first.');
        }
        const timeLog = this.timeLogRepository.create({
            ...startTimeLogDto,
            user: { id: userId },
            task: { id: startTimeLogDto.taskId },
            startTime: new Date(),
        });
        return this.timeLogRepository.save(timeLog);
    }
    async stopTimer(stopTimeLogDto, userId) {
        const activeTimer = await this.timeLogRepository.findOne({
            where: { user: { id: userId }, endTime: null },
        });
        if (!activeTimer) {
            throw new common_1.BadRequestException('No active timer found.');
        }
        const endTime = new Date();
        const duration = Math.floor((endTime.getTime() - activeTimer.startTime.getTime()) / 1000);
        activeTimer.endTime = endTime;
        activeTimer.duration = duration;
        if (stopTimeLogDto.description) {
            activeTimer.description = stopTimeLogDto.description;
        }
        return this.timeLogRepository.save(activeTimer);
    }
    async getLogs(query, userId) {
        const { page = 1, limit = 10, taskId, projectId, startDate, endDate, } = query;
        const skip = (page - 1) * limit;
        const queryBuilder = this.timeLogRepository
            .createQueryBuilder('timeLog')
            .leftJoinAndSelect('timeLog.task', 'task')
            .leftJoinAndSelect('task.project', 'project')
            .where('timeLog.userId = :userId', { userId });
        if (taskId) {
            queryBuilder.andWhere('timeLog.taskId = :taskId', { taskId });
        }
        if (projectId) {
            queryBuilder.andWhere('task.projectId = :projectId', { projectId });
        }
        if (startDate && endDate) {
            queryBuilder.andWhere('timeLog.startTime BETWEEN :startDate AND :endDate', {
                startDate,
                endDate,
            });
        }
        const [timeLogs, total] = await queryBuilder
            .skip(skip)
            .take(limit)
            .orderBy('timeLog.startTime', 'DESC')
            .getManyAndCount();
        return {
            data: timeLogs,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getReports(query, userId) {
        const { projectId, startDate, endDate } = query;
        const queryBuilder = this.timeLogRepository
            .createQueryBuilder('timeLog')
            .leftJoinAndSelect('timeLog.task', 'task')
            .leftJoinAndSelect('task.project', 'project')
            .where('timeLog.userId = :userId AND timeLog.endTime IS NOT NULL', {
            userId,
        });
        if (projectId) {
            queryBuilder.andWhere('task.projectId = :projectId', { projectId });
        }
        if (startDate && endDate) {
            queryBuilder.andWhere('timeLog.startTime BETWEEN :startDate AND :endDate', {
                startDate,
                endDate,
            });
        }
        const timeLogs = await queryBuilder.getMany();
        const totalDuration = timeLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
        const totalHours = Math.round((totalDuration / 3600) * 100) / 100;
        return {
            totalDuration,
            totalHours,
            totalLogs: timeLogs.length,
            timeLogs,
        };
    }
};
exports.TimeTrackingService = TimeTrackingService;
exports.TimeTrackingService = TimeTrackingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(time_log_entity_1.TimeLog)),
    __metadata("design:paramtypes", [Object])
], TimeTrackingService);


/***/ }),

/***/ "./src/modules/users/dto/create-user.dto.ts":
/*!**************************************************!*\
  !*** ./src/modules/users/dto/create-user.dto.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateUserDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const enums_1 = __webpack_require__(/*! ../../../common/enums */ "./src/common/enums/index.ts");
class CreateUserDto {
    constructor() {
        this.role = enums_1.UserRole.CONTRIBUTOR;
    }
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "john.doe@example.com" }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "SecurePassword123!" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "John Doe" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: enums_1.UserRole, default: enums_1.UserRole.CONTRIBUTOR }),
    (0, class_validator_1.IsEnum)(enums_1.UserRole),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_a = typeof enums_1.UserRole !== "undefined" && enums_1.UserRole) === "function" ? _a : Object)
], CreateUserDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "https://res.cloudinary.com/avatar.jpg" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Full-stack developer with 5 years experience" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ["JavaScript", "React", "Node.js"] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateUserDto.prototype, "skills", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Available weekdays 9-5 EST" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "availability", void 0);


/***/ }),

/***/ "./src/modules/users/dto/update-user.dto.ts":
/*!**************************************************!*\
  !*** ./src/modules/users/dto/update-user.dto.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateUserDto = void 0;
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const create_user_dto_1 = __webpack_require__(/*! ./create-user.dto */ "./src/modules/users/dto/create-user.dto.ts");
class UpdateUserDto extends (0, swagger_1.PartialType)(create_user_dto_1.CreateUserDto) {
}
exports.UpdateUserDto = UpdateUserDto;


/***/ }),

/***/ "./src/modules/users/users.controller.ts":
/*!***********************************************!*\
  !*** ./src/modules/users/users.controller.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const users_service_1 = __webpack_require__(/*! ./users.service */ "./src/modules/users/users.service.ts");
const create_user_dto_1 = __webpack_require__(/*! ./dto/create-user.dto */ "./src/modules/users/dto/create-user.dto.ts");
const update_user_dto_1 = __webpack_require__(/*! ./dto/update-user.dto */ "./src/modules/users/dto/update-user.dto.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
const roles_guard_1 = __webpack_require__(/*! ../../common/guards/roles.guard */ "./src/common/guards/roles.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../auth/decorators/roles.decorator */ "./src/modules/auth/decorators/roles.decorator.ts");
const enums_1 = __webpack_require__(/*! ../../common/enums */ "./src/common/enums/index.ts");
const pagination_dto_1 = __webpack_require__(/*! ../../common/dtos/pagination.dto */ "./src/common/dtos/pagination.dto.ts");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    create(createUserDto) {
        return this.usersService.create(createUserDto);
    }
    findAll(paginationDto) {
        return this.usersService.findAll(paginationDto);
    }
    findOne(id) {
        return this.usersService.findOne(id);
    }
    update(id, updateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }
    remove(id) {
        return this.usersService.remove(id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: "Create a new user (Admin only)" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_user_dto_1.CreateUserDto !== "undefined" && create_user_dto_1.CreateUserDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all users with pagination" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof pagination_dto_1.PaginationDto !== "undefined" && pagination_dto_1.PaginationDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Update user" }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof update_user_dto_1.UpdateUserDto !== "undefined" && update_user_dto_1.UpdateUserDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete user (Admin only)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)("users"),
    (0, common_1.Controller)("users"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object])
], UsersController);


/***/ }),

/***/ "./src/modules/users/users.module.ts":
/*!*******************************************!*\
  !*** ./src/modules/users/users.module.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const users_controller_1 = __webpack_require__(/*! ./users.controller */ "./src/modules/users/users.controller.ts");
const users_service_1 = __webpack_require__(/*! ./users.service */ "./src/modules/users/users.service.ts");
const user_entity_1 = __webpack_require__(/*! ../../entities/user.entity */ "./src/entities/user.entity.ts");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User])],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService],
        exports: [users_service_1.UsersService],
    })
], UsersModule);


/***/ }),

/***/ "./src/modules/users/users.service.ts":
/*!********************************************!*\
  !*** ./src/modules/users/users.service.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const typeorm_2 = __webpack_require__(/*! typeorm */ "typeorm");
const bcrypt = __webpack_require__(/*! bcrypt */ "bcrypt");
const user_entity_1 = __webpack_require__(/*! ../../entities/user.entity */ "./src/entities/user.entity.ts");
let UsersService = class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(createUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
        const userData = {
            ...createUserDto,
            password: hashedPassword,
            availability: createUserDto.availability
                ? JSON.parse(createUserDto.availability)
                : null,
        };
        const user = this.userRepository.create(userData);
        return this.userRepository.save(user);
    }
    async findAll(paginationDto) {
        const { page = 1, limit = 10 } = paginationDto;
        const skip = (page - 1) * limit;
        const [users, total] = await this.userRepository.findAndCount({
            skip,
            take: limit,
            select: [
                'id',
                'email',
                'name',
                'role',
                'avatar',
                'bio',
                'skills',
                'availability',
                'createdAt',
            ],
        });
        return {
            data: users,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            select: [
                'id',
                'email',
                'name',
                'role',
                'avatar',
                'bio',
                'skills',
                'availability',
                'createdAt',
            ],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async findByEmail(email) {
        return this.userRepository.findOne({ where: { email } });
    }
    async update(id, updateUserDto) {
        const user = await this.findOne(id);
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 12);
        }
        Object.assign(user, updateUserDto);
        return this.userRepository.save(user);
    }
    async remove(id) {
        const user = await this.findOne(id);
        await this.userRepository.softDelete(id);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], UsersService);


/***/ }),

/***/ "./src/modules/webhooks/dto/create-webhook.dto.ts":
/*!********************************************************!*\
  !*** ./src/modules/webhooks/dto/create-webhook.dto.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateWebhookDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class CreateWebhookDto {
    constructor() {
        this.active = true;
    }
}
exports.CreateWebhookDto = CreateWebhookDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Slack Integration" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWebhookDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "https://hooks.slack.com/services/..." }),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateWebhookDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ["task.created", "task.updated", "task.completed"] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateWebhookDto.prototype, "events", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateWebhookDto.prototype, "active", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Webhook for Slack notifications" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWebhookDto.prototype, "description", void 0);


/***/ }),

/***/ "./src/modules/webhooks/dto/update-webhook.dto.ts":
/*!********************************************************!*\
  !*** ./src/modules/webhooks/dto/update-webhook.dto.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateWebhookDto = void 0;
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const create_webhook_dto_1 = __webpack_require__(/*! ./create-webhook.dto */ "./src/modules/webhooks/dto/create-webhook.dto.ts");
class UpdateWebhookDto extends (0, swagger_1.PartialType)(create_webhook_dto_1.CreateWebhookDto) {
}
exports.UpdateWebhookDto = UpdateWebhookDto;


/***/ }),

/***/ "./src/modules/webhooks/webhooks.controller.ts":
/*!*****************************************************!*\
  !*** ./src/modules/webhooks/webhooks.controller.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebhooksController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const webhooks_service_1 = __webpack_require__(/*! ./webhooks.service */ "./src/modules/webhooks/webhooks.service.ts");
const create_webhook_dto_1 = __webpack_require__(/*! ./dto/create-webhook.dto */ "./src/modules/webhooks/dto/create-webhook.dto.ts");
const update_webhook_dto_1 = __webpack_require__(/*! ./dto/update-webhook.dto */ "./src/modules/webhooks/dto/update-webhook.dto.ts");
const jwt_auth_guard_1 = __webpack_require__(/*! ../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
let WebhooksController = class WebhooksController {
    constructor(webhooksService) {
        this.webhooksService = webhooksService;
    }
    create(createWebhookDto, req) {
        return this.webhooksService.create(createWebhookDto, req.user.id);
    }
    findAll(req) {
        return this.webhooksService.findAll(req.user.id);
    }
    findOne(id, req) {
        return this.webhooksService.findOne(id, req.user.id);
    }
    update(id, updateWebhookDto, req) {
        return this.webhooksService.update(id, updateWebhookDto, req.user.id);
    }
    remove(id, req) {
        return this.webhooksService.remove(id, req.user.id);
    }
};
exports.WebhooksController = WebhooksController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a new webhook" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof create_webhook_dto_1.CreateWebhookDto !== "undefined" && create_webhook_dto_1.CreateWebhookDto) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", void 0)
], WebhooksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all webhooks for user' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WebhooksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get webhook by ID" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WebhooksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Update webhook" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof update_webhook_dto_1.UpdateWebhookDto !== "undefined" && update_webhook_dto_1.UpdateWebhookDto) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", void 0)
], WebhooksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Delete webhook" }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WebhooksController.prototype, "remove", null);
exports.WebhooksController = WebhooksController = __decorate([
    (0, swagger_1.ApiTags)("webhooks"),
    (0, common_1.Controller)("webhooks"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Inject)(webhooks_service_1.WebhooksService)),
    __metadata("design:paramtypes", [typeof (_a = typeof webhooks_service_1.WebhooksService !== "undefined" && webhooks_service_1.WebhooksService) === "function" ? _a : Object])
], WebhooksController);


/***/ }),

/***/ "./src/modules/webhooks/webhooks.module.ts":
/*!*************************************************!*\
  !*** ./src/modules/webhooks/webhooks.module.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebhooksModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const webhooks_controller_1 = __webpack_require__(/*! ./webhooks.controller */ "./src/modules/webhooks/webhooks.controller.ts");
const webhooks_service_1 = __webpack_require__(/*! ./webhooks.service */ "./src/modules/webhooks/webhooks.service.ts");
const webhook_entity_1 = __webpack_require__(/*! ../../entities/webhook.entity */ "./src/entities/webhook.entity.ts");
let WebhooksModule = class WebhooksModule {
};
exports.WebhooksModule = WebhooksModule;
exports.WebhooksModule = WebhooksModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([webhook_entity_1.Webhook])],
        controllers: [webhooks_controller_1.WebhooksController],
        providers: [webhooks_service_1.WebhooksService],
        exports: [webhooks_service_1.WebhooksService],
    })
], WebhooksModule);


/***/ }),

/***/ "./src/modules/webhooks/webhooks.service.ts":
/*!**************************************************!*\
  !*** ./src/modules/webhooks/webhooks.service.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebhooksService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ "@nestjs/typeorm");
const webhook_entity_1 = __webpack_require__(/*! ../../entities/webhook.entity */ "./src/entities/webhook.entity.ts");
let WebhooksService = class WebhooksService {
    constructor(webhookRepository) {
        this.webhookRepository = webhookRepository;
    }
    async create(createWebhookDto, userId) {
        const webhook = this.webhookRepository.create({
            ...createWebhookDto,
            user: { id: userId },
        });
        return this.webhookRepository.save(webhook);
    }
    async findAll(userId) {
        return this.webhookRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id, userId) {
        const webhook = await this.webhookRepository.findOne({
            where: { id, user: { id: userId } },
        });
        if (!webhook) {
            throw new common_1.NotFoundException(`Webhook with ID ${id} not found`);
        }
        return webhook;
    }
    async update(id, updateWebhookDto, userId) {
        const webhook = await this.findOne(id, userId);
        Object.assign(webhook, updateWebhookDto);
        return this.webhookRepository.save(webhook);
    }
    async remove(id, userId) {
        const webhook = await this.findOne(id, userId);
        await this.webhookRepository.remove(webhook);
    }
    async triggerWebhook(event, payload) {
        const webhooks = await this.webhookRepository.find({
            where: { events: event, active: true },
        });
        webhooks.forEach((webhook) => {
            console.log(`[v0] Triggering webhook ${webhook.id} for event ${event}:`, payload);
        });
    }
};
exports.WebhooksService = WebhooksService;
exports.WebhooksService = WebhooksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(webhook_entity_1.Webhook)),
    __metadata("design:paramtypes", [Object])
], WebhooksService);


/***/ }),

/***/ "@nestjs/bull":
/*!*******************************!*\
  !*** external "@nestjs/bull" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@nestjs/bull");

/***/ }),

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/config":
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/jwt":
/*!******************************!*\
  !*** external "@nestjs/jwt" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),

/***/ "@nestjs/passport":
/*!***********************************!*\
  !*** external "@nestjs/passport" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),

/***/ "@nestjs/swagger":
/*!**********************************!*\
  !*** external "@nestjs/swagger" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),

/***/ "@nestjs/throttler":
/*!************************************!*\
  !*** external "@nestjs/throttler" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("@nestjs/throttler");

/***/ }),

/***/ "@nestjs/typeorm":
/*!**********************************!*\
  !*** external "@nestjs/typeorm" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("@nestjs/typeorm");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ "class-transformer":
/*!************************************!*\
  !*** external "class-transformer" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),

/***/ "class-validator":
/*!**********************************!*\
  !*** external "class-validator" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),

/***/ "cloudinary":
/*!*****************************!*\
  !*** external "cloudinary" ***!
  \*****************************/
/***/ ((module) => {

module.exports = require("cloudinary");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "helmet":
/*!*************************!*\
  !*** external "helmet" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("helmet");

/***/ }),

/***/ "nodemailer":
/*!*****************************!*\
  !*** external "nodemailer" ***!
  \*****************************/
/***/ ((module) => {

module.exports = require("nodemailer");

/***/ }),

/***/ "passport-jwt":
/*!*******************************!*\
  !*** external "passport-jwt" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),

/***/ "rxjs/operators":
/*!*********************************!*\
  !*** external "rxjs/operators" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("rxjs/operators");

/***/ }),

/***/ "typeorm":
/*!**************************!*\
  !*** external "typeorm" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("typeorm");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("uuid");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const helmet_1 = __webpack_require__(/*! helmet */ "helmet");
const app_module_1 = __webpack_require__(/*! ./app.module */ "./src/app.module.ts");
const global_exception_filter_1 = __webpack_require__(/*! ./common/filters/global-exception.filter */ "./src/common/filters/global-exception.filter.ts");
const logging_interceptor_1 = __webpack_require__(/*! ./common/interceptors/logging.interceptor */ "./src/common/interceptors/logging.interceptor.ts");
const response_interceptor_1 = __webpack_require__(/*! ./common/interceptors/response.interceptor */ "./src/common/interceptors/response.interceptor.ts");
async function bootstrap() {
    console.log("Starting Task Manager API...");
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    console.log('Environment:', configService.get('NODE_ENV'));
    app.use((0, helmet_1.default)());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.enableCors({
        origin: process.env.NODE_ENV === "production"
            ? ["https://yourdomain.com"]
            : ["http://localhost:3000", "http://localhost:3001"],
        credentials: true,
    });
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor(), new response_interceptor_1.ResponseInterceptor());
    app.setGlobalPrefix("api/v1");
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Task Manager API")
        .setDescription("Professional task management system API")
        .setVersion("1.0")
        .addBearerAuth()
        .addTag("auth", "Authentication endpoints")
        .addTag("users", "User management")
        .addTag("projects", "Project management")
        .addTag("tasks", "Task management")
        .addTag("issues", "Issue tracking")
        .addTag("comments", "Comments and collaboration")
        .addTag("notifications", "Notification system")
        .addTag("reports", "Analytics and reporting")
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("api/docs", app, document);
    const port = configService.get('PORT') || 3001;
    console.log(`🔧 Port configuration: ${port}`);
    await app.listen(port);
    console.log(`🚀 Application is running on: http://localhost:${port}`);
    console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}
bootstrap();

})();

/******/ })()
;