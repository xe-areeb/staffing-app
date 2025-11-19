import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { UserRole } from '@prisma/client'
import { EventsTable } from '@/components/admin/events-table'
import { CreateEventDialog } from '@/components/admin/create-event-dialog'
import { BackButton } from '@/components/back-button'

export default async function AdminEventsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== UserRole.ADMIN) {
    redirect('/dashboard')
  }

  const events = await prisma.event.findMany({
    include: {
      createdBy: true,
      eventUsers: {
        include: {
          user: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const allUsers = await prisma.user.findMany({
    where: {
      role: {
        in: [UserRole.PROJECT_MANAGER, UserRole.SUPERVISOR],
      },
    },
  })

  return (
    <div className="space-y-6">
      <BackButton href="/dashboard" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-gray-600">Manage events and assign users</p>
        </div>
        <CreateEventDialog userId={session.user.id} />
      </div>
      <EventsTable events={events} allUsers={allUsers} />
    </div>
  )
}

