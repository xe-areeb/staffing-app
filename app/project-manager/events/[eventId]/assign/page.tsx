import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { UserRole } from '@prisma/client'
import { AssignmentInterface } from '@/components/project-manager/assignment-interface'
import { BackButton } from '@/components/back-button'

export default async function AssignStaffPage({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.PROJECT_MANAGER) {
    redirect('/dashboard')
  }

  const { eventId } = await params

  // Verify user has access to this event
  const eventUser = await prisma.eventUser.findUnique({
    where: {
      eventId_userId: {
        eventId,
        userId: session.user.id,
      },
    },
  })

  if (!eventUser && session.user.role !== UserRole.ADMIN) {
    redirect('/project-manager/events')
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      eventUsers: {
        where: { role: UserRole.SUPERVISOR },
        include: { user: true },
      },
    },
  })

  if (!event) {
    redirect('/project-manager/events')
  }

  const allStaff = await prisma.staff.findMany({
    orderBy: { name: 'asc' },
  })

  const existingAssignments = await prisma.assignment.findMany({
    where: { eventId },
    include: {
      staff: true,
      supervisor: true,
    },
  })

  const supervisors = event.eventUsers.map((eu) => eu.user)

  return (
    <div className="space-y-6">
      <BackButton href="/project-manager/events" />
      <div>
        <h1 className="text-3xl font-bold">Assign Staff</h1>
        <p className="text-gray-600">Event: {event.name}</p>
      </div>
      <AssignmentInterface
        eventId={eventId}
        staff={allStaff}
        supervisors={supervisors}
        existingAssignments={existingAssignments}
      />
    </div>
  )
}

