import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { UserRole } from '@prisma/client'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { id } = params

    const assignment = await prisma.assignment.findUnique({
      where: { id },
    })

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    // Verify user has access to this event
    if (session.user.role !== UserRole.ADMIN) {
      const eventUser = await prisma.eventUser.findUnique({
        where: {
          eventId_userId: {
            eventId: assignment.eventId,
            userId: session.user.id,
          },
        },
      })

      if (!eventUser || eventUser.role !== UserRole.PROJECT_MANAGER) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    await prisma.assignment.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting assignment:', error)
    return NextResponse.json(
      { error: 'Failed to delete assignment' },
      { status: 500 }
    )
  }
}

