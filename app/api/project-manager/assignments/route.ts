import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { UserRole } from '@prisma/client'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (
    session.user.role !== UserRole.ADMIN &&
    session.user.role !== UserRole.PROJECT_MANAGER
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { eventId, staffId, supervisorId } = await req.json()

    if (!eventId || !staffId || !supervisorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify user has access to this event
    if (session.user.role !== UserRole.ADMIN) {
      const eventUser = await prisma.eventUser.findUnique({
        where: {
          eventId_userId: {
            eventId,
            userId: session.user.id,
          },
        },
      })

      if (!eventUser || eventUser.role !== UserRole.PROJECT_MANAGER) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    // Check if assignment already exists
    const existing = await prisma.assignment.findUnique({
      where: {
        eventId_staffId_supervisorId: {
          eventId,
          staffId,
          supervisorId,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Assignment already exists' },
        { status: 400 }
      )
    }

    const assignment = await prisma.assignment.create({
      data: {
        eventId,
        staffId,
        supervisorId,
        assignedById: session.user.id,
      },
    })

    return NextResponse.json({ assignment })
  } catch (error) {
    console.error('Error creating assignment:', error)
    return NextResponse.json(
      { error: 'Failed to create assignment' },
      { status: 500 }
    )
  }
}

