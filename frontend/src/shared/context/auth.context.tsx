'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { AuthUser } from '@/shared/api/auth.api'
import { authMe, loginWithGoogle as apiLogin, logout as apiLogout } from '@/shared/api/auth.api'

type AuthContextValue = {
  user: AuthUser | null
  isLoading: boolean
  isChecked: boolean
  loginWithGoogle: (idToken: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecked, setIsChecked] = useState(false)

  const checkAuth = useCallback(async () => {
    setIsLoading(true)
    try {
      const u = await authMe()
      setUser(u)
    } catch {
      setUser(null)
    } finally {
      setIsChecked(true)
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const loginWithGoogle = useCallback(async (idToken: string) => {
    setIsLoading(true)
    try {
      const u = await apiLogin(idToken)
      setUser(u)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    await apiLogout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isChecked,
        loginWithGoogle,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
