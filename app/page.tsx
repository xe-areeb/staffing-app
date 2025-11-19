import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { UserRole } from '@prisma/client'

export default async function Home() {
  // Check if admin exists, if not redirect to setup
  try {
    const adminCount = await prisma.user.count({
      where: { role: UserRole.ADMIN },
    })

    if (adminCount === 0) {
      redirect('/setup')
    }
  } catch (error) {
    // If database error, still redirect to login
    console.error('Error checking admin count:', error)
  }

  redirect('/login')
}
