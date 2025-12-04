'use client'

import { observer } from 'mobx-react-lite'
import { configuratorStore, WatchModel } from '@/shared/store/configurator.store'
import { useState, useEffect } from 'react'
import {
  Card, Text, Button, Group, Stack, TextInput, Image, Badge,
  Modal, Title, Pill, MultiSelect, Box
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { colorsApi, Color } from '@/shared/api/colors.api'

export const AdminModelsMantine = observer(() => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [opened, setOpened] = useState(false)
  const [colors, setColors] = useState<Color[]>([])
  const [formData, setFormData] = useState<Partial<WatchModel>>({
    model_name: '',
    watch_model_name: '',
    watch_model_manufacturer: '',
    main_image: '',
    watch_sizes: [],
    frame_colors: [],
    available_strap_ids: []
  })

  useEffect(() => {
    configuratorStore.loadWatchModelsFromAPI()
    configuratorStore.loadWatchStrapsFromAPI()
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

  const startEdit = (index: number) => {
    const model = configuratorStore.watchModels[index]
    setFormData({
      model_name: model.model_name,
      watch_model_name: model.watch_model_name,
      watch_model_manufacturer: model.watch_model_manufacturer,
      main_image: model.main_image,
      watch_sizes: [...model.watch_sizes],
      frame_colors: [...model.frame_colors],
      available_strap_ids: model.available_strap_ids || []
    })
    setEditingIndex(index)
    setIsAdding(false)
    setOpened(true)
  }

  const startAdd = () => {
    setFormData({
      model_name: '',
      watch_model_name: '',
      watch_model_manufacturer: '',
      main_image: '',
      watch_sizes: [],
      frame_colors: [],
      available_strap_ids: []
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

  const saveModel = async () => {
    const modelData: WatchModel = {
      model_name: formData.model_name || '',
      watch_model_name: formData.watch_model_name || '',
      watch_model_manufacturer: formData.watch_model_manufacturer,
      main_image: formData.main_image,
      choosen: false,
      watch_sizes: formData.watch_sizes || [],
      frame_colors: formData.frame_colors || [],
      available_strap_ids: formData.available_strap_ids || []
    }

    try {
      if (isAdding) {
        await configuratorStore.addWatchModel(modelData)
        notifications.show({
          title: 'Успешно',
          message: 'Модель добавлена',
          color: 'green'
        })
      } else if (editingIndex !== null) {
        await configuratorStore.updateWatchModel(editingIndex, modelData)
        notifications.show({
          title: 'Успешно',
          message: 'Модель обновлена',
          color: 'green'
        })
      }
      cancelEdit()
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось сохранить модель',
        color: 'red'
      })
    }
  }

  const deleteModel = async (index: number) => {
    if (confirm('Вы уверены, что хотите удалить эту модель?')) {
      try {
        await configuratorStore.deleteWatchModel(index)
        notifications.show({
          title: 'Успешно',
          message: 'Модель удалена',
          color: 'green'
        })
      } catch (error) {
        notifications.show({
          title: 'Ошибка',
          message: 'Не удалось удалить модель',
          color: 'red'
        })
      }
    }
  }

  const addSize = () => {
    const size = prompt('Размер (например, 40):')
    if (size) {
      setFormData({
        ...formData,
        watch_sizes: [...(formData.watch_sizes || []), { watch_size: size, choosen: false }]
      })
    }
  }

  const deleteSize = (index: number) => {
    const newSizes = [...(formData.watch_sizes || [])]
    newSizes.splice(index, 1)
    setFormData({ ...formData, watch_sizes: newSizes })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, main_image: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBackup = async () => {
    try {
      await configuratorStore.createBackup()
      notifications.show({
        title: 'Успешно',
        message: 'Бэкап скачан',
        color: 'green'
      })
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось создать бэкап',
        color: 'red'
      })
    }
  }

  const strapOptions = configuratorStore.watchStraps.map(strap => ({
    value: String(strap.attributes.watch_strap.id),
    label: strap.attributes.watch_strap.strap_name
  }))

  const getColorById = (colorId: number) => colors.find(c => c.id === colorId)

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>Модели часов ({configuratorStore.watchModels.length})</Title>
        <Group>
          <Button variant="light" onClick={handleBackup}>
            💾 Скачать бэкап
          </Button>
          <Button onClick={startAdd}>
            ➕ Добавить модель
          </Button>
        </Group>
      </Group>

      <Stack gap="md">
        {configuratorStore.watchModels.map((model, index) => (
          <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" wrap="nowrap">
              <Group>
                {model.main_image && (
                  <Image src={model.main_image} h={80} w={80} fit="contain" alt={model.watch_model_name} />
                )}
                <Stack gap="xs">
                  <Text fw={700} size="lg">{model.watch_model_name}</Text>
                  <Text size="sm" c="dimmed">{model.model_name}</Text>
                  {model.watch_model_manufacturer && (
                    <Text size="sm" c="dimmed">{model.watch_model_manufacturer}</Text>
                  )}
                  <Group gap="xs">
                    {model.watch_sizes.map((size, idx) => (
                      <Badge key={idx} variant="light">{size.watch_size}mm</Badge>
                    ))}
                  </Group>
                  <Group gap="xs">
                    {model.frame_colors.map((frameColor, idx) => {
                      const color = getColorById(frameColor.colorId)
                      return color ? (
                        <Badge key={idx} variant="dot" color={color.hex_code}>
                          {color.display_name}
                        </Badge>
                      ) : null
                    })}
                  </Group>
                  {model.available_strap_ids && model.available_strap_ids.length > 0 && (
                    <Group gap={4}>
                      <Text size="xs" c="dimmed">Ремешки:</Text>
                      {configuratorStore.watchStraps
                        .filter(s => model.available_strap_ids?.includes(s.attributes.watch_strap.id))
                        .map((strap, idx) => (
                          <Badge key={idx} size="xs" variant="outline" color="violet">
                            {strap.attributes.watch_strap.strap_title}
                          </Badge>
                        ))
                      }
                    </Group>
                  )}
                </Stack>
              </Group>
              <Group>
                <Button size="sm" variant="light" onClick={() => startEdit(index)}>
                  ✏️ Изменить
                </Button>
                <Button size="sm" variant="light" color="red" onClick={() => deleteModel(index)}>
                  🗑️ Удалить
                </Button>
              </Group>
            </Group>
          </Card>
        ))}
      </Stack>

      <Modal opened={opened} onClose={cancelEdit} title={isAdding ? 'Новая модель' : 'Редактирование модели'} size="lg">
        <Stack>
          <TextInput
            label="Название модели"
            placeholder="Apple Watch"
            value={formData.model_name || ''}
            onChange={(e) => setFormData({ ...formData, model_name: e.target.value })}
            required
          />

          <TextInput
            label="Серия модели"
            placeholder="4-6 серия, SE"
            value={formData.watch_model_name || ''}
            onChange={(e) => setFormData({ ...formData, watch_model_name: e.target.value })}
            required
          />

          <TextInput
            label="Производитель"
            placeholder="Apple Watch"
            value={formData.watch_model_manufacturer || ''}
            onChange={(e) => setFormData({ ...formData, watch_model_manufacturer: e.target.value })}
          />

          <Box>
            <Text size="sm" fw={500} mb="xs">Изображение модели</Text>
            {formData.main_image && (
              <Card withBorder p="xs" mb="xs" style={{ width: 'fit-content' }}>
                <Image src={formData.main_image} h={120} w={120} fit="contain" alt="Preview" />
              </Card>
            )}
            <Stack gap="xs">
              <Group>
                <Button
                  component="label"
                  variant="filled"
                  size="sm"
                >
                  📁 Выбрать изображение с устройства
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </Button>
                {formData.main_image && (
                  <Button
                    variant="light"
                    color="red"
                    size="sm"
                    onClick={() => setFormData({ ...formData, main_image: '' })}
                  >
                    🗑️ Удалить
                  </Button>
                )}
              </Group>
              <TextInput
                label="или введите URL изображения"
                placeholder="https://api.slavalarionov.store/uploads/..."
                value={formData.main_image || ''}
                onChange={(e) => setFormData({ ...formData, main_image: e.target.value })}
              />
            </Stack>
          </Box>

          <Box>
            <Group justify="space-between" mb="xs">
              <Text size="sm" fw={500}>Размеры</Text>
              <Button onClick={addSize} size="xs" variant="light">Добавить</Button>
            </Group>
            <Group gap="xs">
              {formData.watch_sizes?.map((size, idx) => (
                <Pill key={idx} withRemoveButton onRemove={() => deleteSize(idx)}>
                  {size.watch_size}mm
                </Pill>
              ))}
            </Group>
          </Box>

          <MultiSelect
            label="Доступные цвета корпуса"
            placeholder="Выберите цвета"
            data={colors.map(c => ({
              value: String(c.id),
              label: c.display_name
            }))}
            value={formData.frame_colors?.map(fc => String(fc.colorId)) || []}
            onChange={(values) => {
              const newFrameColors = values.map(colorId => {
                const existingColor = formData.frame_colors?.find(fc => fc.colorId === Number(colorId))
                return existingColor || {
                  colorId: Number(colorId),
                  choosen: false,
                  view_images: undefined
                }
              })
              setFormData({ ...formData, frame_colors: newFrameColors })
            }}
            searchable
            clearable
            renderOption={({ option }) => {
              const color = colors.find(c => c.id === Number(option.value))
              return (
                <Group gap="xs">
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: color?.hex_code || '#000',
                      border: '1px solid #dee2e6'
                    }}
                  />
                  <span>{option.label}</span>
                </Group>
              )
            }}
          />

          <MultiSelect
            label="Доступные ремешки"
            placeholder="Выберите ремешки"
            data={strapOptions}
            value={formData.available_strap_ids?.map(String) || []}
            onChange={(values) => setFormData({ ...formData, available_strap_ids: values.map(Number) })}
            searchable
            clearable
          />

          <Group justify="flex-end">
            <Button variant="light" onClick={cancelEdit}>
              Отмена
            </Button>
            <Button onClick={saveModel}>
              {isAdding ? '➕ Добавить' : '💾 Сохранить'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  )
})
