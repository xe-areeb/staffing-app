import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { UserRole } from '@prisma/client'
import { StaffTable } from '@/components/admin/staff-table'
import { ImportStaffDialog } from '@/components/admin/import-staff-dialog'
import { BackButton } from '@/components/back-button'

export default async function AdminStaffPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== UserRole.ADMIN) {
    redirect('/dashboard')
  }

  const staff = await prisma.staff.findMany({
    orderBy: { name: 'asc' },
    take: 100, // Show first 100, can add pagination later
  })

  const totalCount = await prisma.staff.count()

  return (
    <div className="space-y-6">
      <BackButton href="/dashboard" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Staff Database</h1>
          <p className="text-gray-600">
            Manage staff database ({totalCount} total staff)
          </p>
        </div>
        <ImportStaffDialog />
      </div>
      <StaffTable staff={staff} />
    </div>
  )
}

