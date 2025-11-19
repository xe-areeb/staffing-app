import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { UserRole } from '@prisma/client'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { eventId, userId, role } = await req.json()

    if (!eventId || !userId || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if assignment already exists
    const existing = await prisma.eventUser.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    })

    if (existing) {
      // Update existing assignment
      await prisma.eventUser.update({
        where: { id: existing.id },
        data: { role: role as UserRole },
      })
    } else {
      // Create new assignment
      await prisma.eventUser.create({
        data: {
          eventId,
          userId,
          role: role as UserRole,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error assigning user to event:', error)
    return NextResponse.json(
      { error: 'Failed to assign user' },
      { status: 500 }
    )
  }
}

