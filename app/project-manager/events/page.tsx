import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { UserRole } from '@prisma/client'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BackButton } from '@/components/back-button'

export default async function ProjectManagerEventsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.PROJECT_MANAGER) {
    redirect('/dashboard')
  }

  // Get events where user is assigned as Project Manager
  const eventUsers = await prisma.eventUser.findMany({
    where: {
      userId: session.user.id,
      role: UserRole.PROJECT_MANAGER,
    },
    include: {
      event: {
        include: {
          assignments: {
            include: {
              staff: true,
              supervisor: true,
            },
          },
        },
      },
    },
  })

  const events = eventUsers.map((eu) => eu.event)

  return (
    <div className="space-y-6">
      <BackButton href="/dashboard" />
      <div>
        <h1 className="text-3xl font-bold">My Events</h1>
        <p className="text-gray-600">Manage staff assignments for your events</p>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              No events assigned. Contact an admin to be assigned to an event.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const assignmentCount = event.assignments.length
            return (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle>{event.name}</CardTitle>
                  <CardDescription>
                    {event.location || 'No location set'}
                    {event.date && (
                      <span className="block">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      {assignmentCount} assignment{assignmentCount !== 1 ? 's' : ''}
                    </p>
                    <Link href={`/project-manager/events/${event.id}/assign`}>
                      <Button className="w-full">Manage Assignments</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

