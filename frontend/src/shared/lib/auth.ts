export const isAdmin = (): boolean => {
  if (typeof window === 'undefined') return false
  const role = localStorage.getItem('ROLE')
  return role === 'ADMIN'
}

export const setAdminRole = () => {
  if (typeof window === 'undefined') return
  localStorage.setItem('ROLE', 'ADMIN')
}

export const removeAdminRole = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('ROLE')
}

