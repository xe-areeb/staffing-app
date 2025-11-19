import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { UserRole } from '@prisma/client'
import { UsersTable } from '@/components/admin/users-table'
import { CreateUserDialog } from '@/components/admin/create-user-dialog'
import { BackButton } from '@/components/back-button'

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== UserRole.ADMIN) {
    redirect('/dashboard')
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <BackButton href="/dashboard" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-gray-600">Manage user accounts and roles</p>
        </div>
        <CreateUserDialog />
      </div>
      <UsersTable users={users} />
    </div>
  )
}

