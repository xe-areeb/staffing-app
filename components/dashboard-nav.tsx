'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { UserRole } from '@prisma/client'

interface DashboardNavProps {
  user: {
    id: string
    email: string
    name: string
    role: UserRole
  }
}

export function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname()

  const isActive = (path: string) => pathname?.startsWith(path)

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-xl font-bold">
              Staffing App
            </Link>
            <div className="hidden space-x-4 md:flex">
              {user.role === 'ADMIN' && (
                <>
                  <Link
                    href="/admin/users"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/admin/users')
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Users
                  </Link>
                  <Link
                    href="/admin/events"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/admin/events')
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Events
                  </Link>
                  <Link
                    href="/admin/staff"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/admin/staff')
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Staff
                  </Link>
                </>
              )}
              {(user.role === 'ADMIN' || user.role === 'PROJECT_MANAGER') && (
                <Link
                  href="/project-manager/events"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/project-manager')
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Assignments
                </Link>
              )}
              <Link
                href="/supervisor/staff"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/supervisor')
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                My Staff
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user.name}</span>
            <Button variant="outline" size="sm" onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

