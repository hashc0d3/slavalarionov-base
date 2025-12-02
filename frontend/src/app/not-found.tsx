'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    // Перенаправляем на главную страницу
    router.push('/')
  }, [router])

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '50vh',
      flexDirection: 'column',
      gap: '1rem',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '300' }}>Страница не найдена</h1>
      <p style={{ color: '#666' }}>Перенаправляем на главную страницу...</p>
    </div>
  )
}

