'use client'

import { useState, useEffect } from 'react'
import {
  Card, Text, Button, Group, Stack, TextInput, Modal, Title, Badge, ColorInput
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { colorsApi, Color, CreateColorDto, UpdateColorDto } from '@/shared/api/colors.api'

export const AdminColorsMantine = () => {
  const [colors, setColors] = useState<Color[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [opened, setOpened] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CreateColorDto>({
    technical_name: '',
    display_name: '',
    hex_code: '#000000'
  })

  const loadColors = async () => {
    try {
      const data = await colorsApi.getAll()
      setColors(data)
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось загрузить цвета',
        color: 'red'
      })
    }
  }

  useEffect(() => {
    loadColors()
  }, [])

  const startEdit = (index: number) => {
    const color = colors[index]
    setFormData({
      technical_name: color.technical_name,
      display_name: color.display_name,
      hex_code: color.hex_code
    })
    setEditingIndex(index)
    setIsAdding(false)
    setOpened(true)
  }

  const startAdd = () => {
    setFormData({
      technical_name: '',
      display_name: '',
      hex_code: '#000000'
    })
    setIsAdding(true)
    setEditingIndex(null)
    setOpened(true)
  }

  const cancelEdit = () => {
    setOpened(false)
    setEditingIndex(null)
    setIsAdding(false)
  }

  const saveColor = async () => {
    if (!formData.technical_name.trim() || !formData.display_name.trim() || !formData.hex_code.trim()) {
      notifications.show({
        title: 'Ошибка',
        message: 'Заполните все поля',
        color: 'red'
      })
      return
    }

    try {
      setLoading(true)
      if (isAdding) {
        await colorsApi.create(formData)
        notifications.show({
          title: 'Успешно',
          message: 'Цвет добавлен',
          color: 'green'
        })
      } else if (editingIndex !== null) {
        const color = colors[editingIndex]
        await colorsApi.update(color.id, formData)
        notifications.show({
          title: 'Успешно',
          message: 'Цвет обновлён',
          color: 'green'
        })
      }
      await loadColors()
      cancelEdit()
    } catch (error: any) {
      notifications.show({
        title: 'Ошибка',
        message: error?.response?.data?.message || 'Не удалось сохранить цвет',
        color: 'red'
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteColor = async (index: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот цвет? Все связанные данные будут удалены.')) {
      return
    }

    try {
      const color = colors[index]
      await colorsApi.delete(color.id)
      notifications.show({
        title: 'Успешно',
        message: 'Цвет удалён',
        color: 'green'
      })
      await loadColors()
    } catch (error: any) {
      notifications.show({
        title: 'Ошибка',
        message: error?.response?.data?.message || 'Не удалось удалить цвет',
        color: 'red'
      })
    }
  }

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>Цвета устройства ({colors.length})</Title>
        <Button onClick={startAdd}>
          ➕ Добавить цвет
        </Button>
      </Group>

      <Stack gap="md">
        {colors.map((color, index) => (
          <Card key={color.id} shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" wrap="nowrap">
              <Group>
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 8,
                    backgroundColor: color.hex_code,
                    border: '2px solid #e0e0e0'
                  }}
                />
                <Stack gap="xs">
                  <Text fw={700} size="lg">{color.display_name}</Text>
                  <Group gap="xs">
                    <Badge variant="light" color="blue">
                      {color.technical_name}
                    </Badge>
                    <Badge variant="light" color="gray">
                      {color.hex_code}
                    </Badge>
                  </Group>
                </Stack>
              </Group>
              <Group>
                <Button size="sm" variant="light" onClick={() => startEdit(index)}>
                  ✏️ Изменить
                </Button>
                <Button size="sm" variant="light" color="red" onClick={() => deleteColor(index)}>
                  🗑️ Удалить
                </Button>
              </Group>
            </Group>
          </Card>
        ))}
      </Stack>

      <Modal
        opened={opened}
        onClose={cancelEdit}
        title={isAdding ? 'Новый цвет' : 'Редактирование цвета'}
        size="md"
      >
        <Stack>
          <TextInput
            label="Техническое название"
            placeholder="silver, black, brown..."
            description="Используется в коде. Латинские буквы, дефис, подчёркивание"
            value={formData.technical_name}
            onChange={(e) => setFormData({ ...formData, technical_name: e.target.value })}
            required
          />

          <TextInput
            label="Наименование для клиента"
            placeholder="Серебристый, Чёрный, Коричневый..."
            description="Отображается пользователю в интерфейсе"
            value={formData.display_name}
            onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
            required
          />

          <ColorInput
            label="HEX цвет"
            placeholder="#000000"
            value={formData.hex_code}
            onChange={(value) => setFormData({ ...formData, hex_code: value })}
            format="hex"
            required
          />

          <Group justify="flex-end">
            <Button variant="light" onClick={cancelEdit} disabled={loading}>
              Отмена
            </Button>
            <Button onClick={saveColor} loading={loading}>
              {isAdding ? '➕ Добавить' : '💾 Сохранить'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  )
}

