import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { SupervisorStaffList } from '@/components/supervisor/staff-list'
import { BackButton } from '@/components/back-button'

export default async function SupervisorStaffPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Get all assignments where user is supervisor
  const assignments = await prisma.assignment.findMany({
    where: {
      supervisorId: session.user.id,
    },
    include: {
      staff: true,
      event: true,
      feedback: {
        orderBy: { submittedAt: 'desc' },
        take: 1, // Get latest feedback
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="space-y-6">
      <BackButton href="/dashboard" />
      <div>
        <h1 className="text-3xl font-bold">My Staff</h1>
        <p className="text-gray-600">View assigned staff and submit feedback</p>
      </div>
      <SupervisorStaffList assignments={assignments} />
    </div>
  )
}

