'use client'

import { observer } from 'mobx-react-lite'
import { configuratorStore, WatchModel } from '@/shared/store/configurator.store'
import { useState, useEffect } from 'react'
import {
  Card, Text, Button, Group, Stack, TextInput, Image, Badge,
  Modal, Title, Pill, MultiSelect, Box, FileButton
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { uploadStrapColorImage } from '@/shared/api/uploads.api'

type FrameColorForm = {
  color_name: string
  color_code: string
  view_images: {
    view1: string
    view2: string
    view3: string
  }
}

const emptyFrameColorForm: FrameColorForm = {
  color_name: '',
  color_code: '#000000',
  view_images: {
    view1: '',
    view2: '',
    view3: ''
  }
}

export const AdminModelsMantine = observer(() => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [opened, setOpened] = useState(false)
  const [formData, setFormData] = useState<Partial<WatchModel>>({
    model_name: '',
    watch_model_name: '',
    watch_model_manufacturer: '',
    main_image: '',
    watch_sizes: [],
    frame_colors: [],
    available_strap_ids: []
  })
  const [colorModalOpened, setColorModalOpened] = useState(false)
  const [colorEditingIndex, setColorEditingIndex] = useState<number | null>(null)
  const [colorFormData, setColorFormData] = useState<FrameColorForm>(emptyFrameColorForm)
  const [colorUploadLoading, setColorUploadLoading] = useState<{ view1: boolean; view2: boolean; view3: boolean }>({
    view1: false,
    view2: false,
    view3: false
  })

  useEffect(() => {
    configuratorStore.loadWatchModelsFromAPI()
    configuratorStore.loadWatchStrapsFromAPI()
  }, [])

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

  const addColor = () => {
    setColorFormData(emptyFrameColorForm)
    setColorEditingIndex(null)
    setColorModalOpened(true)
  }

  const deleteColor = (index: number) => {
    const newColors = [...(formData.frame_colors || [])]
    newColors.splice(index, 1)
    setFormData({ ...formData, frame_colors: newColors })
  }

  const handleColorFieldChange = (key: keyof FrameColorForm, value: string) => {
    setColorFormData((prev) => ({
      ...prev,
      [key]: value
    }))
  }

  const setColorViewImage = (view: 'view1' | 'view2' | 'view3', value: string) => {
    setColorFormData((prev) => ({
      ...prev,
      view_images: {
        ...prev.view_images,
        [view]: value
      }
    }))
  }

  const handleColorViewUpload = async (view: 'view1' | 'view2' | 'view3', file: File | null) => {
    if (!file) return

    try {
      setColorUploadLoading((prev) => ({ ...prev, [view]: true }))
      const response = await uploadStrapColorImage({
        file,
        group: 'frame',
        view,
        colorTitle: colorFormData.color_name
      })
      setColorViewImage(view, response.url)
      notifications.show({
        title: 'Файл загружен',
        message: 'Изображение успешно сохранено',
        color: 'green'
      })
    } catch (error: any) {
      console.error('Upload frame color image error:', error)
      notifications.show({
        title: 'Ошибка загрузки',
        message: error?.message || 'Не удалось загрузить изображение',
        color: 'red'
      })
    } finally {
      setColorUploadLoading((prev) => ({ ...prev, [view]: false }))
    }
  }

  const openEditColorModal = (index: number) => {
    const colors = formData.frame_colors || []
    const target = colors[index]
    if (!target) return

    setColorFormData({
      color_name: target.color_name,
      color_code: target.color_code || '#000000',
      view_images: {
        view1: target.view_images?.view1 || '',
        view2: target.view_images?.view2 || '',
        view3: target.view_images?.view3 || ''
      }
    })
    setColorEditingIndex(index)
    setColorModalOpened(true)
  }

  const closeColorModal = () => {
    setColorModalOpened(false)
    setColorEditingIndex(null)
    setColorFormData(emptyFrameColorForm)
    setColorUploadLoading({ view1: false, view2: false, view3: false })
  }

  const saveColorModal = () => {
    const trimmedName = colorFormData.color_name.trim()
    if (!trimmedName) {
      notifications.show({
        title: 'Ошибка',
        message: 'Введите название цвета',
        color: 'red'
      })
      return
    }

    const sanitizedViewImages = Object.entries(colorFormData.view_images).reduce(
      (acc, [key, value]) => {
        const trimmed = value.trim()
        if (trimmed) {
          acc[key as 'view1' | 'view2' | 'view3'] = trimmed
        }
        return acc
      },
      {} as Record<'view1' | 'view2' | 'view3', string>
    )

    const nextColors = [...(formData.frame_colors || [])]
    const existing = colorEditingIndex !== null ? nextColors[colorEditingIndex] : undefined

    const nextColor = {
      color_name: trimmedName,
      color_code: colorFormData.color_code.trim() || '',
      choosen: existing?.choosen ?? false,
      view_images: Object.keys(sanitizedViewImages).length > 0 ? sanitizedViewImages : undefined
    }

    if (colorEditingIndex !== null) {
      nextColors[colorEditingIndex] = nextColor
    } else {
      nextColors.push(nextColor)
    }

    setFormData({ ...formData, frame_colors: nextColors })
    closeColorModal()
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

  const editColor = (index: number) => {
    openEditColorModal(index)
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
    label: strap.attributes.watch_strap.strap_title
  }))

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
                    {model.frame_colors.map((color, idx) => (
                      <Badge key={idx} variant="dot" color={color.color_code}>{color.color_name}</Badge>
                    ))}
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

          <Box>
            <Group justify="space-between" mb="xs">
              <Text size="sm" fw={500}>Цвета корпуса</Text>
              <Button onClick={addColor} size="xs" variant="light">Добавить</Button>
            </Group>
          <Stack gap="xs">
            {formData.frame_colors?.map((color, idx) => (
              <Group key={idx} gap="xs">
                <Pill withRemoveButton onRemove={() => deleteColor(idx)}>
                  <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', backgroundColor: color.color_code, marginRight: 4 }}></span>
                  {color.color_name}
                </Pill>
                <Button size="xs" variant="subtle" onClick={() => editColor(idx)}>
                  ✏️
                </Button>
              </Group>
            ))}
          </Stack>
          </Box>

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

      <Modal
        opened={colorModalOpened}
        onClose={closeColorModal}
        title={colorEditingIndex !== null ? 'Редактировать цвет корпуса' : 'Добавить цвет корпуса'}
        size="lg"
      >
        <Stack gap="md">
          <TextInput
            label="Название цвета"
            placeholder="Например, Silver"
            value={colorFormData.color_name}
            onChange={(e) => handleColorFieldChange('color_name', e.currentTarget.value)}
            required
          />
          <TextInput
            label="Код цвета"
            placeholder="#FFFFFF"
            value={colorFormData.color_code}
            onChange={(e) => handleColorFieldChange('color_code', e.currentTarget.value)}
          />

          {(['view1', 'view2', 'view3'] as const).map((viewKey, idx) => (
            <Stack key={viewKey} gap="xs">
              <Group justify="space-between" align="center">
                <Text size="sm" fw={500}>
                  Вид {idx + 1}
                </Text>
                <Group gap="xs">
                  <FileButton onChange={(file) => handleColorViewUpload(viewKey, file)} accept="image/*">
                    {(props) => (
                      <Button
                        {...props}
                        size="xs"
                        variant="outline"
                        loading={colorUploadLoading[viewKey]}
                      >
                        Загрузить
                      </Button>
                    )}
                  </FileButton>
                  <Button
                    size="xs"
                    variant="subtle"
                    color="red"
                    disabled={!colorFormData.view_images[viewKey]}
                    onClick={() => setColorViewImage(viewKey, '')}
                  >
                    Очистить
                  </Button>
                </Group>
              </Group>
              <TextInput
                placeholder={`/uploads/strap-colors/frame/${viewKey}/image.png`}
                value={colorFormData.view_images[viewKey]}
                onChange={(e) => setColorViewImage(viewKey, e.currentTarget.value)}
              />
            </Stack>
          ))}

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={closeColorModal}>
              Отмена
            </Button>
            <Button onClick={saveColorModal}>Сохранить</Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  )
})

