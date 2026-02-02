'use client'

import { useAuth } from '@/shared/context/auth.context'
import { isAdminUser } from '@/shared/lib/auth'
import Link from 'next/link'
import styles from './AdminButton.module.css'

export const AdminButton = () => {
  const { user } = useAuth()
  if (!isAdminUser(user)) return null

  return (
    <Link href="/admin" className={styles.adminButton}>
      🔧 Админ-панель
    </Link>
  )
}

