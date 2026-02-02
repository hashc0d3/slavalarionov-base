import type { AuthUser } from '@/shared/api/auth.api'

/** Проверка роли администратора по пользователю из API/БД */
export function isAdminUser(user: AuthUser | null | undefined): boolean {
  return user?.role === 'ADMIN'
}

