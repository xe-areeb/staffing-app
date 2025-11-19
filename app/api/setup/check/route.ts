import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { UserRole } from '@prisma/client'

export async function GET() {
  try {
    const adminCount = await prisma.user.count({
      where: { role: UserRole.ADMIN },
    })

    return NextResponse.json({
      needsSetup: adminCount === 0,
    })
  } catch (error) {
    console.error('Error checking setup:', error)
    return NextResponse.json(
      { error: 'Failed to check setup status' },
      { status: 500 }
    )
  }
}

