const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgres://01961bf8-a6ff-7f3a-9205-91ea6089959a:954d2d57-91fc-4add-a596-c80338f9f4c0@eu-central-1.db.thenile.dev/nile_cyan_door"
    }
  }
});

async function testConnection() {
  try {
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log('Database connection successful:', result);
  } catch (error) {
    console.error('Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
