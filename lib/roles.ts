export enum UserRole {
  ADMIN = 'ADMIN',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  SUPERVISOR = 'SUPERVISOR',
}

export function hasRole(userRole: string, requiredRole: UserRole): boolean {
  const roleHierarchy = {
    [UserRole.ADMIN]: 3,
    [UserRole.PROJECT_MANAGER]: 2,
    [UserRole.SUPERVISOR]: 1,
  }

  return roleHierarchy[userRole as UserRole] >= roleHierarchy[requiredRole]
}

export function canAccessAdmin(userRole: string): boolean {
  return userRole === UserRole.ADMIN
}

export function canAccessProjectManager(userRole: string): boolean {
  return userRole === UserRole.ADMIN || userRole === UserRole.PROJECT_MANAGER
}

export function canAccessSupervisor(userRole: string): boolean {
  return true // All authenticated users can access supervisor features
}

