'use client'

import styles from './AdminTabs.module.css'

interface AdminTabsProps {
  activeTab: 'models' | 'straps'
  onTabChange: (tab: 'models' | 'straps') => void
}

export const AdminTabs = ({ activeTab, onTabChange }: AdminTabsProps) => {
  return (
    <div className={styles.tabs}>
      <button
        className={`${styles.tab} ${activeTab === 'models' ? styles.active : ''}`}
        onClick={() => onTabChange('models')}
      >
        📱 Модели часов
      </button>
      <button
        className={`${styles.tab} ${activeTab === 'straps' ? styles.active : ''}`}
        onClick={() => onTabChange('straps')}
      >
        ⌚ Ремешки
      </button>
    </div>
  )
}


