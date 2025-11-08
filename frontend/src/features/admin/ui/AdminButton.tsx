'use client'

import { useEffect, useState } from 'react'
import { isAdmin } from '@/shared/lib/auth'
import Link from 'next/link'
import styles from './AdminButton.module.css'

export const AdminButton = () => {
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    setShowButton(isAdmin())
  }, [])

  if (!showButton) return null

  return (
    <Link href="/admin" className={styles.adminButton}>
      🔧 Админ-панель
    </Link>
  )
}

