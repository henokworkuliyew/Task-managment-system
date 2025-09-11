import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { ConfigService } from "@nestjs/config"
import helmet from "helmet"
import { AppModule } from "./app.module"
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter"
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor"
import { ResponseInterceptor } from "./common/interceptors/response.interceptor"
import { IoAdapter } from '@nestjs/platform-socket.io'
async function bootstrap() {
  console.log("Starting Task Manager API...")
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  console.log('Environment:', configService.get('NODE_ENV'))

  // Setup Socket.IO adapter
  app.useWebSocketAdapter(new IoAdapter(app))
  
  // Security middleware
  app.use(helmet())

  // Global pipes for validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )

  // CORS configuration
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? [configService.get<string>('FRONTEND_URL'), 'https://task-managment-system-7jbd.onrender.com']
        : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })

  app.useGlobalFilters(new GlobalExceptionFilter())
  app.useGlobalInterceptors(new LoggingInterceptor(), new ResponseInterceptor())

 
  app.setGlobalPrefix("api/v1")

  const config = new DocumentBuilder()
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
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api/docs", app, document)

  const port = process.env.PORT || configService.get<number>('PORT') || 3002;
  console.log(`🔧 Port configuration: ${port}`);
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`)
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`)
}

bootstrap()

