'use client'

import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { AdminTabs } from './AdminTabs'
import { AdminModels } from './AdminModels'
import { AdminStrapsMantine } from './AdminStrapsMantine'
import styles from './AdminPanel.module.css'

export const AdminPanel = observer(() => {
  const [activeTab, setActiveTab] = useState<'models' | 'straps'>('models')

  return (
    <div className={styles.adminPanel}>
      <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === 'models' && <AdminModels />}
      {activeTab === 'straps' && <AdminStrapsMantine />}
    </div>
  )
})
