import { Injectable, type NestInterceptor, type ExecutionContext, type CallHandler, Logger } from "@nestjs/common"
import type { Observable } from "rxjs"
import { tap } from "rxjs/operators"

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name)

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const { method, url, body, query, params } = request
    const now = Date.now()

    this.logger.log(
      `Incoming Request: ${method} ${url} - Body: ${JSON.stringify(body)} - Query: ${JSON.stringify(query)} - Params: ${JSON.stringify(params)}`,
    )

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now
        this.logger.log(`Outgoing Response: ${method} ${url} - ${responseTime}ms`)
      }),
    )
  }
}
