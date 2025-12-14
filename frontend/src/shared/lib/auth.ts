export const isAdmin = (): boolean => {
  try {
    if (typeof window === 'undefined') return false
    const role = localStorage.getItem('ROLE')
    return role === 'ADMIN'
  } catch (error) {
    console.error('Error checking admin role:', error)
    return false
  }
}

export const setAdminRole = () => {
  try {
    if (typeof window === 'undefined') return
    localStorage.setItem('ROLE', 'ADMIN')
  } catch (error) {
    console.error('Error setting admin role:', error)
  }
}

export const removeAdminRole = () => {
  try {
    if (typeof window === 'undefined') return
    localStorage.removeItem('ROLE')
  } catch (error) {
    console.error('Error removing admin role:', error)
  }
}

