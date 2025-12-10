'use client'

import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { TextInput, Textarea, Button, Stack, Title, Card, Group, Loader } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { configuratorApi } from '@/shared/api/configurator.api'

export const AdminSettingsMantine = observer(() => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [estimatedDate, setEstimatedDate] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setIsLoading(true)
      const settings = await configuratorApi.getSettings()
      setTitle(settings.title || '')
      setDescription(settings.description || '')
      setEstimatedDate(settings.estimated_date || '')
    } catch (error) {
      console.error('Failed to load settings:', error)
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось загрузить настройки',
        color: 'red'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const result = await configuratorApi.updateSettings({ 
        title, 
        description, 
        estimated_date: estimatedDate 
      })
      notifications.show({
        title: 'Успешно',
        message: 'Настройки сохранены',
        color: 'green'
      })
    } catch (error) {
      console.error('[Admin Settings] Failed to save settings:', error)
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка'
      notifications.show({
        title: 'Ошибка',
        message: `Не удалось сохранить настройки: ${errorMessage}`,
        color: 'red',
        autoClose: 10000
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Stack align="center" py="xl">
        <Loader size="lg" />
      </Stack>
    )
  }

  return (
    <Stack gap="md">
      <Title order={2}>Общие параметры</Title>
      
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Title order={4}>Текст на 4-м шаге конфигуратора</Title>
          
          <TextInput
            label="Заголовок"
            placeholder="например: Ремешок почти готов!"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            description="Основной заголовок на финальном шаге"
          />
          
          <Textarea
            label="Описание"
            placeholder="например: Вы создали уникальный ремешок и он просто прекрасен! Сейчас вы можете добавить инициалы..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            description="Описание под заголовком на финальном шаге"
            minRows={4}
            autosize
          />
          
          <TextInput
            label="Дата отправки вашего заказа:"
            placeholder="например: 15-20 февраля"
            value={estimatedDate}
            onChange={(e) => setEstimatedDate(e.target.value)}
            description="Эта дата будет отображаться в модальном окне оформления заказа и на 4-м шаге конфигуратора"
          />
          
          <Group justify="flex-end">
            <Button
              variant="filled"
              color="blue"
              onClick={handleSave}
              loading={isSaving}
            >
              Сохранить
            </Button>
          </Group>
        </Stack>
      </Card>
    </Stack>
  )
})

