const BASE = '/api/auth'

export type Role = 'USER' | 'ADMIN'

export type AuthUser = {
  id: number
  email: string
  role: Role
}

export async function authMe(): Promise<AuthUser | null> {
  const res = await fetch(`${BASE}/me`, { credentials: 'include' })
  if (!res.ok) return null
  return res.json()
}

export async function loginWithGoogle(idToken: string): Promise<AuthUser> {
  const res = await fetch(`${BASE}/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
    credentials: 'include',
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Ошибка входа')
  }
  const data = await res.json()
  return data.user
}

export async function logout(): Promise<void> {
  await fetch(`${BASE}/logout`, { method: 'POST', credentials: 'include' })
}
