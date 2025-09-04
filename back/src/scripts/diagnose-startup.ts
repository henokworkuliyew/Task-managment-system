import { NestFactory } from '@nestjs/core'
import { AppModule } from '../app.module'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function diagnoseStartup() {
  console.log('🔍 Diagnosing NestJS startup issues...\n')

  // Check environment variables
  console.log('📋 Environment Variables:')
  console.log('NODE_ENV:', process.env.NODE_ENV || 'undefined')
  console.log('DB_HOST:', process.env.DB_HOST || 'undefined')
  console.log('DB_PORT:', process.env.DB_PORT || 'undefined')
  console.log('DB_USERNAME:', process.env.DB_USERNAME || 'undefined')
  console.log('DB_DATABASE:', process.env.DB_DATABASE || 'undefined')
  console.log(
    'DB_PASSWORD:',
    process.env.DB_PASSWORD ? '***SET***' : 'undefined'
  )
  console.log('')

  try {
    console.log('🚀 Attempting to create NestJS application...')
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    })

    console.log('✅ NestJS application created successfully!')
    console.log('🔌 Testing database connection...')

    // Test if we can start the app
    await app.listen(3001)
    console.log('✅ Application started successfully on port 3001!')

    await app.close()
    console.log('✅ Application closed gracefully.')
  } catch (error) {
    console.error('❌ Failed to create/start NestJS application:')
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)

    // Specific error analysis
    if (error.message.includes('ECONNREFUSED')) {
      console.log(
        '\n💡 Suggestion: PostgreSQL server is not running or not accessible.'
      )
      console.log('   - Check if PostgreSQL service is running')
      console.log('   - Verify DB_HOST and DB_PORT are correct')
    }

    if (error.message.includes('password authentication failed')) {
      console.log('\n💡 Suggestion: Database authentication failed.')
      console.log('   - Check DB_USERNAME and DB_PASSWORD are correct')
      console.log('   - Verify user has access to the database')
    }

    if (
      error.message.includes('database') &&
      error.message.includes('does not exist')
    ) {
      console.log('\n💡 Suggestion: Database does not exist.')
      console.log('   - Create the database in pgAdmin or psql')
      console.log('   - Verify DB_DATABASE name is correct')
    }

    if (error.message.includes("Can't resolve dependencies")) {
      console.log('\n💡 Suggestion: Dependency injection issue.')
      console.log('   - Check if all @InjectRepository decorators are present')
      console.log(
        '   - Verify TypeOrmModule.forFeature is configured in modules'
      )
    }
  }
}

diagnoseStartup()
