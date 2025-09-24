const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function cleanupBookings() {
  try {
    console.log('🧹 Starting booking cleanup...')
    
    // First, let's see what bookings exist
    const allBookings = await prisma.booking.findMany({
      include: {
        studio: true,
        user: true
      }
    })
    
    console.log(`📊 Found ${allBookings.length} total bookings`)
    
    // Keep only bookings from 2025-09-24
    const targetDate = new Date('2025-09-24')
    const bookingsToKeep = allBookings.filter(booking => {
      const bookingDate = new Date(booking.date)
      return bookingDate.toDateString() === targetDate.toDateString()
    })
    
    console.log(`✅ Found ${bookingsToKeep.length} bookings to keep (2025-09-24)`)
    
    // Delete all other bookings
    const bookingsToDelete = allBookings.filter(booking => {
      const bookingDate = new Date(booking.date)
      return bookingDate.toDateString() !== targetDate.toDateString()
    })
    
    console.log(`🗑️ Found ${bookingsToDelete.length} bookings to delete`)
    
    if (bookingsToDelete.length > 0) {
      // Delete bookings that are not from 2025-09-24
      const deleteResult = await prisma.booking.deleteMany({
        where: {
          date: {
            not: targetDate
          }
        }
      })
      
      console.log(`✅ Deleted ${deleteResult.count} old bookings`)
    }
    
    // Verify final state
    const finalBookings = await prisma.booking.findMany({
      include: {
        studio: true,
        user: true
      }
    })
    
    console.log(`📊 Final booking count: ${finalBookings.length}`)
    console.log('📅 Remaining bookings:')
    finalBookings.forEach(booking => {
      const date = new Date(booking.date).toLocaleDateString()
      console.log(`  - ${booking.studio.name} on ${date} at ${booking.startTime} (${booking.status})`)
    })
    
    console.log('🎉 Booking cleanup completed successfully!')
    
  } catch (error) {
    console.error('❌ Error during booking cleanup:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the cleanup
cleanupBookings()
  .then(() => {
    console.log('✅ Cleanup script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Cleanup script failed:', error)
    process.exit(1)
  })
