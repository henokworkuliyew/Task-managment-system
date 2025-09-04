import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { ConfigService } from "@nestjs/config"
import helmet from "helmet"
import { AppModule } from "./app.module"
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter"
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor"
import { ResponseInterceptor } from "./common/interceptors/response.interceptor"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

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
      process.env.NODE_ENV === "production"
        ? ["https://yourdomain.com"]
        : ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })

  // Global filters and interceptors
  app.useGlobalFilters(new GlobalExceptionFilter())
  app.useGlobalInterceptors(new LoggingInterceptor(), new ResponseInterceptor())

  // API prefix
  app.setGlobalPrefix("api/v1")

  // Swagger documentation
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

  const port = configService.get<number>("PORT") || 3000
  await app.listen(port)

  console.log(`🚀 Application is running on: http://localhost:${port}`)
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`)
}

bootstrap()
