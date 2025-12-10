'use client'

import { observer } from 'mobx-react-lite'
import { Tabs, Container, Title, Group, Button, Stack } from '@mantine/core'
import { AdminModelsMantine } from '@/widgets/admin/ui/AdminModelsMantine'
import { AdminStrapsMantine } from '@/widgets/admin/ui/AdminStrapsMantine'
import { AdminPromoCodesMantine } from '@/widgets/admin/ui/AdminPromoCodesMantine'
import { AdminSettingsMantine } from '@/widgets/admin/ui/AdminSettingsMantine'
import { AdminColorsMantine } from '@/widgets/admin/ui/AdminColorsMantine'
import { configuratorStore } from '@/shared/store/configurator.store'
import { notifications } from '@mantine/notifications'
import { useState } from 'react'

export const AdminPanelMantine = observer(() => {
  const [isLoading, setIsLoading] = useState(false)

  const handleFullBackup = async () => {
    try {
      setIsLoading(true)
      await configuratorStore.createBackup()
      notifications.show({
        title: 'Успешно',
        message: 'Полный бэкап создан и скачан',
        color: 'green'
      })
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось создать полный бэкап',
        color: 'red'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestoreFromBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Проверяем размер файла (максимум 10MB)
    if (file.size > 10 * 1024 * 1024) {
      notifications.show({
        title: 'Ошибка',
        message: 'Файл слишком большой. Максимальный размер: 10MB',
        color: 'red'
      })
      return
    }

    try {
      setIsLoading(true)
      // TODO: Implement restoreFromFullBackup method
      throw new Error('Restore from backup is not implemented yet')
      notifications.show({
        title: 'Успешно',
        message: 'Данные восстановлены из бэкапа',
        color: 'green'
      })
    } catch (error) {
      console.error('Restore error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка'
      notifications.show({
        title: 'Ошибка восстановления',
        message: `Не удалось восстановить данные из бэкапа: ${errorMessage}`,
        color: 'red',
        autoClose: 10000
      })
    } finally {
      setIsLoading(false)
      // Очищаем input для возможности повторного выбора того же файла
      event.target.value = ''
    }
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={1}>Админ-панель</Title>
          <Group>
            <Button
              variant="filled"
              color="blue"
              onClick={handleFullBackup}
              loading={isLoading}
            >
              💾 Скачать полный бэкап
            </Button>
            <Button
              component="label"
              variant="light"
              color="green"
              disabled={isLoading}
            >
              📁 Восстановить из бэкапа
              <input
                type="file"
                accept=".json"
                onChange={handleRestoreFromBackup}
                style={{ display: 'none' }}
              />
            </Button>
          </Group>
        </Group>
        
        <Tabs defaultValue="models">
          <Tabs.List>
            <Tabs.Tab value="models">
              📱 Модели часов
            </Tabs.Tab>
            <Tabs.Tab value="straps">
              ⌚ Ремешки
            </Tabs.Tab>
            <Tabs.Tab value="colors">
              🎨 Цвета
            </Tabs.Tab>
            <Tabs.Tab value="promocodes">
              🎟️ Промокоды
            </Tabs.Tab>
            <Tabs.Tab value="settings">
              ⚙️ Общие параметры
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="models" pt="md">
            <AdminModelsMantine />
          </Tabs.Panel>

          <Tabs.Panel value="straps" pt="md">
            <AdminStrapsMantine />
          </Tabs.Panel>

          <Tabs.Panel value="colors" pt="md">
            <AdminColorsMantine />
          </Tabs.Panel>

          <Tabs.Panel value="promocodes" pt="md">
            <AdminPromoCodesMantine />
          </Tabs.Panel>

          <Tabs.Panel value="settings" pt="md">
            <AdminSettingsMantine />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  )
})

