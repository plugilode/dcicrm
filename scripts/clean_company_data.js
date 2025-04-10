require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function cleanCompanyData() {
  try {
    // Verify database connection
    await prisma.$connect()
    console.log('Connected to database successfully')

    // Get list of all tables in the database
    const tables = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
    console.log('Found tables:', tables.map(t => t.table_name).join(', '))

    // Delete data using raw SQL since table names don't match Prisma models
    if (tables.some(t => t.table_name === 'company_tasks')) {
      console.log('Deleting company tasks...')
      await prisma.$executeRaw`DELETE FROM company_tasks`
    } else {
      console.log('Company tasks table not found, skipping...')
    }
    
    if (tables.some(t => t.table_name === 'company_contacts')) {
      console.log('Deleting company contacts...')
      await prisma.$executeRaw`DELETE FROM company_contacts`
    } else {
      console.log('Company contacts table not found, skipping...')
    }
    
    if (tables.some(t => t.table_name === 'companies')) {
      console.log('Deleting companies...')
      await prisma.$executeRaw`DELETE FROM companies`
    } else {
      console.log('Companies table not found, skipping...')
    }
    
    console.log('Successfully cleaned all company data')
  } catch (error) {
    console.error('Error cleaning company data:')
    console.error('Error details:', error.message)
    if (error.code) console.error('Error code:', error.code)
    if (error.meta) console.error('Error metadata:', error.meta)
  } finally {
    await prisma.$disconnect()
  }
}

cleanCompanyData()
