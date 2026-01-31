'use client'

import { useState, useEffect } from 'react'
import {
  Stack, Group, Card, Text, Button, Modal, Select, TextInput, FileButton, Image, Badge
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { colorsApi, Color } from '@/shared/api/colors.api'
import { uploadStrapColorImage } from '@/shared/api/uploads.api'

interface StrapBaseImage {
  id?: number
  colorId: number
  view1Image?: string
  view2Image?: string
  view3Image?: string
  color?: Color
}

interface Props {
  strapId: number
  strapName: string
  baseImages: StrapBaseImage[]
  onUpdate: () => void
}

export const StrapBaseImagesEditor = ({ strapId, strapName, baseImages, onUpdate }: Props) => {
  const [colors, setColors] = useState<Color[]>([])
  const [opened, setOpened] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState<StrapBaseImage>({
    colorId: 0,
    view1Image: '',
    view2Image: '',
    view3Image: ''
  })
  const [uploadLoading, setUploadLoading] = useState<{ view1: boolean; view2: boolean; view3: boolean }>({
    view1: false,
    view2: false,
    view3: false
  })

  useEffect(() => {
    loadColors()
  }, [])

  const loadColors = async () => {
    try {
      const data = await colorsApi.getAll()
      setColors(data)
    } catch (error) {
      console.error('Failed to load colors:', error)
    }
  }

  const startAdd = () => {
    setFormData({
      colorId: 0,
      view1Image: '',
      view2Image: '',
      view3Image: ''
    })
    setEditingIndex(null)
    setOpened(true)
  }

  const startEdit = (index: number) => {
    const image = baseImages[index]
    setFormData({
      ...image
    })
    setEditingIndex(index)
    setOpened(true)
  }

  const closeModal = () => {
    setOpened(false)
    setEditingIndex(null)
    setUploadLoading({ view1: false, view2: false, view3: false })
  }

  const handleViewUpload = async (view: 'view1' | 'view2' | 'view3', file: File | null) => {
    if (!file) return

    const selectedColor = colors.find(c => c.id === formData.colorId)
    if (!selectedColor) {
      notifications.show({
        title: 'Ошибка',
        message: 'Сначала выберите цвет устройства',
        color: 'red'
      })
      return
    }

    try {
      setUploadLoading((prev) => ({ ...prev, [view]: true }))
      const response = await uploadStrapColorImage({
        file,
        group: 'common', // Используем 'common' для базовых изображений ремешков
        view,
        colorTitle: selectedColor.technical_name
      })
      setFormData((prev) => ({
        ...prev,
        [`${view}Image`]: response.url
      }))
      notifications.show({
        title: 'Файл загружен',
        message: 'Изображение успешно сохранено',
        color: 'green'
      })
    } catch (error: any) {
      console.error('Upload image error:', error)
      notifications.show({
        title: 'Ошибка загрузки',
        message: error?.message || 'Не удалось загрузить изображение',
        color: 'red'
      })
    } finally {
      setUploadLoading((prev) => ({ ...prev, [view]: false }))
    }
  }

  const saveImage = async () => {
    if (!formData.colorId) {
      notifications.show({
        title: 'Ошибка',
        message: 'Выберите цвет устройства',
        color: 'red'
      })
      return
    }

    try {
      if (editingIndex !== null && baseImages[editingIndex].id) {
        // Update existing
        const response = await fetch(
          `/api/watch-straps/${strapId}/base-images/${baseImages[editingIndex].id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              colorId: formData.colorId,
              view1Image: formData.view1Image || null,
              view2Image: formData.view2Image || null,
              view3Image: formData.view3Image || null
            })
          }
        )
        if (!response.ok) throw new Error('Failed to update base image')
        notifications.show({
          title: 'Успешно',
          message: 'Базовое изображение обновлено',
          color: 'green'
        })
      } else {
        // Create new
        const response = await fetch(
          `/api/watch-straps/${strapId}/base-images`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              colorId: formData.colorId,
              view1Image: formData.view1Image || null,
              view2Image: formData.view2Image || null,
              view3Image: formData.view3Image || null
            })
          }
        )
        if (!response.ok) throw new Error('Failed to create base image')
        notifications.show({
          title: 'Успешно',
          message: 'Базовое изображение добавлено',
          color: 'green'
        })
      }
      closeModal()
      onUpdate()
    } catch (error: any) {
      console.error('Save error:', error)
      notifications.show({
        title: 'Ошибка',
        message: error?.message || 'Не удалось сохранить',
        color: 'red'
      })
    }
  }

  const deleteImage = async (index: number) => {
    const image = baseImages[index]
    if (!image.id) return

    if (!confirm('Удалить базовое изображение?')) return

    try {
      const response = await fetch(`/api/watch-straps/${strapId}/base-images/${image.id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete base image')
      notifications.show({
        title: 'Успешно',
        message: 'Базовое изображение удалено',
        color: 'green'
      })
      onUpdate()
    } catch (error: any) {
      console.error('Delete error:', error)
      notifications.show({
        title: 'Ошибка',
        message: error?.message || 'Не удалось удалить',
        color: 'red'
      })
    }
  }

  const getColorById = (colorId: number) => colors.find(c => c.id === colorId)

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Text size="sm" fw={500}>Базовые изображения ремешка ({baseImages.length})</Text>
        <Button onClick={startAdd} size="xs" variant="light">
          ➕ Добавить цвет устройства
        </Button>
      </Group>

      <Stack gap="sm">
        {baseImages.map((image, index) => {
          const color = getColorById(image.colorId)
          return (
            <Card key={index} withBorder p="sm">
              <Group justify="space-between">
                <Group>
                  {color && (
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 4,
                        backgroundColor: color.hex_code,
                        border: '1px solid #e0e0e0'
                      }}
                    />
                  )}
                  <Stack gap={4}>
                    <Text size="sm" fw={500}>
                      {color?.display_name || 'Неизвестный цвет устройства'}
                    </Text>
                    <Group gap="xs">
                      {image.view1Image && <Badge size="xs" color="blue">Вид 1</Badge>}
                      {image.view2Image && <Badge size="xs" color="green">Вид 2</Badge>}
                      {image.view3Image && <Badge size="xs" color="orange">Вид 3</Badge>}
                    </Group>
                  </Stack>
                </Group>
                <Group>
                  <Button size="xs" variant="subtle" onClick={() => startEdit(index)}>
                    ✏️
                  </Button>
                  <Button size="xs" variant="subtle" color="red" onClick={() => deleteImage(index)}>
                    🗑️
                  </Button>
                </Group>
              </Group>
            </Card>
          )
        })}
      </Stack>

      <Modal
        opened={opened}
        onClose={closeModal}
        title={editingIndex !== null ? 'Редактировать изображение' : 'Добавить изображение'}
        size="lg"
      >
        <Stack gap="md">
          <Select
            label="Цвет устройства"
            placeholder="Выберите цвет устройства"
            data={colors.map(c => ({
              value: String(c.id),
              label: `${c.display_name} (${c.hex_code})`
            }))}
            value={formData.colorId ? String(formData.colorId) : null}
            onChange={(value) => setFormData({ ...formData, colorId: value ? Number(value) : 0 })}
            required
            searchable
          />

          {(['view1', 'view2', 'view3'] as const).map((viewKey, idx) => (
            <Stack key={viewKey} gap="xs">
              <Group justify="space-between" align="center">
                <Text size="sm" fw={500}>
                  Вид {idx + 1}
                </Text>
                <Group gap="xs">
                  <FileButton onChange={(file) => handleViewUpload(viewKey, file)} accept="image/*">
                    {(props) => (
                      <Button
                        {...props}
                        size="xs"
                        variant="outline"
                        loading={uploadLoading[viewKey]}
                      >
                        Загрузить
                      </Button>
                    )}
                  </FileButton>
                  <Button
                    size="xs"
                    variant="subtle"
                    color="red"
                    disabled={!formData[`${viewKey}Image`]}
                    onClick={() => setFormData({ ...formData, [`${viewKey}Image`]: '' })}
                  >
                    Очистить
                  </Button>
                </Group>
              </Group>
              <TextInput
                placeholder={`/uploads/strap-colors/${strapName}/${viewKey}/image.png`}
                value={formData[`${viewKey}Image`] || ''}
                onChange={(e) => setFormData({ ...formData, [`${viewKey}Image`]: e.currentTarget.value })}
              />
              {formData[`${viewKey}Image`] && (
                <Card withBorder p="xs" style={{ width: 'fit-content' }}>
                  <Image
                    src={formData[`${viewKey}Image`]}
                    h={100}
                    w={100}
                    fit="contain"
                    alt={`Preview ${viewKey}`}
                  />
                </Card>
              )}
            </Stack>
          ))}

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={closeModal}>
              Отмена
            </Button>
            <Button onClick={saveImage}>Сохранить</Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  )
}

