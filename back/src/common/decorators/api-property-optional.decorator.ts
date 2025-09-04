import { ApiPropertyOptional as SwaggerApiPropertyOptional, type ApiPropertyOptions } from "@nestjs/swagger"

export function ApiPropertyOptional(options: ApiPropertyOptions = {}): PropertyDecorator {
  return SwaggerApiPropertyOptional(options)
}
