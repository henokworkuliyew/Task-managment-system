import { DataSource } from 'typeorm'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const testConnection = async () => {
  console.log('Testing database connection...')
  console.log('DB_HOST:', process.env.DB_HOST)
  console.log('DB_PORT:', process.env.DB_PORT)
  console.log('DB_USERNAME:', process.env.DB_USERNAME)
  console.log('DB_DATABASE:', process.env.DB_DATABASE)

  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number.parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'task_manager',
    synchronize: false,
    logging: true,
  })

  try {
    await dataSource.initialize()
    console.log('✅ Database connection successful!')
    await dataSource.destroy()
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    console.error('Full error:', error)
  }
}

testConnection()
