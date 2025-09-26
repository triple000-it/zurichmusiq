const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addImageColumnToServices() {
  try {
    console.log('🔄 Adding image column to Service table...')

    // Add image column to existing Service table
    await prisma.$executeRaw`ALTER TABLE "Service" ADD COLUMN IF NOT EXISTS "image" TEXT DEFAULT '/placeholder.jpg'`
    console.log('✅ Added image column to Service table')

    // Update existing services with placeholder image using raw SQL
    await prisma.$executeRaw`UPDATE "Service" SET "image" = '/placeholder.jpg' WHERE "image" IS NULL OR "image" = ''`
    console.log('✅ Updated existing services with placeholder image')

    console.log('🎉 Service table migration completed successfully!')

  } catch (error) {
    console.error('❌ Error during Service table migration:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the migration
addImageColumnToServices()
  .catch((error) => {
    console.error('Migration failed:', error)
    process.exit(1)
  })
