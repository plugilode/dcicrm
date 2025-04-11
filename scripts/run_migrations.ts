import { query } from '@/lib/db'
import fs from 'fs'
import path from 'path'

async function runMigrations() {
  const migrationFiles = [
    '004_add_admin_users.sql'
  ]

  try {
    for (const file of migrationFiles) {
      const sql = fs.readFileSync(
        path.join(process.cwd(), 'migrations', file), 
        'utf8'
      )
      
      console.log(`Running migration: ${file}...`)
      await query(sql)
      console.log(`Completed migration: ${file}`)
    }

    console.log('All migrations completed successfully')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

runMigrations()
