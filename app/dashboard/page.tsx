import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { UserRole } from '@prisma/client'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const { user } = session

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.name}!</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {user.role === UserRole.ADMIN && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Admin</CardTitle>
                <CardDescription>Manage users, events, and staff</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/users">
                  <Button className="w-full">Manage Users</Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Events</CardTitle>
                <CardDescription>Create and manage events</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/events">
                  <Button className="w-full">Manage Events</Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Staff</CardTitle>
                <CardDescription>Import and manage staff database</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/staff">
                  <Button className="w-full">Manage Staff</Button>
                </Link>
              </CardContent>
            </Card>
          </>
        )}

        {(user.role === UserRole.ADMIN || user.role === UserRole.PROJECT_MANAGER) && (
          <Card>
            <CardHeader>
              <CardTitle>Project Manager</CardTitle>
              <CardDescription>Assign staff to supervisors</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/project-manager/events">
                <Button className="w-full">Manage Assignments</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Supervisor</CardTitle>
            <CardDescription>View staff and submit feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/supervisor/staff">
              <Button className="w-full">View Staff</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

