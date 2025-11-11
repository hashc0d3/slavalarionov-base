'use client'

import { useState } from 'react'
import {
  Card,
  Text,
  Button,
  Group,
  Stack,
  TextInput,
  Modal,
  Title,
  Box,
  SimpleGrid,
  Divider
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { StrapColor, StrapParams } from '@/shared/store/configurator.store'
import { uploadStrapColorImage } from '@/shared/api/uploads.api'
// import { IconPlus, IconTrash, IconEdit } from '@tabler/icons-react'

interface StrapParamsEditorProps {
  strapParams: {
    leather_colors: StrapColor[]
    stitching_colors: StrapColor[]
    edge_colors: StrapColor[]
    buckle_colors: StrapColor[]
    adapter_colors: StrapColor[]
    has_buckle_butterfly?: boolean
    view_images?: StrapParams['view_images']
  }
  onUpdate: (updatedParams: any) => void
}

const StrapParamsEditor = ({ strapParams, onUpdate }: StrapParamsEditorProps) => {
  const [editingColor, setEditingColor] = useState<{ type: string; index: number } | null>(null)
  const [isAddingColor, setIsAddingColor] = useState<{ type: string } | null>(null)
  const emptyImages: StrapColor['images'] = {
    view1: '',
    view2: '',
    view3: '',
    icon: ''
  }

  const [colorForm, setColorForm] = useState<StrapColor>({
    color_title: '',
    color_code: '#000000',
    choosen: false,
    images: { ...emptyImages }
  })

  type ImageFieldKey = 'view1' | 'view2' | 'view3' | 'icon'
  type ViewImageKey = 'view1' | 'view2' | 'view3'

  const [uploadingState, setUploadingState] = useState<{
    key: ImageFieldKey | null
    type: string | null
  }>({ key: null, type: null })
  const [uploadingBaseView, setUploadingBaseView] = useState<ViewImageKey | null>(null)

  const colorTypeGroupMap: Record<string, 'leather' | 'stitching' | 'edge' | 'buckle' | 'adapter' | 'common'> = {
    leather_colors: 'leather',
    stitching_colors: 'stitching',
    edge_colors: 'edge',
    buckle_colors: 'buckle',
    adapter_colors: 'adapter'
  }

  const imageFields: Array<{ key: ViewImageKey; label: string }> = [
    { key: 'view1', label: 'Вид 1' },
    { key: 'view2', label: 'Вид 2' },
    { key: 'view3', label: 'Вид 3' }
  ]

  const updateBaseViewImage = (key: ViewImageKey, rawValue: string) => {
    const value = rawValue.trim()
    const currentViews = { ...(strapParams.view_images || {}) }

    if (value) {
      currentViews[key] = value
    } else {
      delete currentViews[key]
    }

    const hasValues = Object.values(currentViews).some(
      (item) => typeof item === 'string' && item.trim() !== ''
    )

    onUpdate({
      ...strapParams,
      view_images: hasValues ? currentViews : undefined
    })
  }

  const handleBaseViewUrlChange = (key: ViewImageKey, value: string) => {
    updateBaseViewImage(key, value)
  }

  const handleBaseViewUpload = async (
    key: ViewImageKey,
    file: File | null,
    resetInput: () => void
  ) => {
    if (!file) return

    try {
      setUploadingBaseView(key)
      const response = await uploadStrapColorImage({
        file,
        group: 'strap',
        view: key
      })
      updateBaseViewImage(key, response.url)
      notifications.show({
        title: 'Файл загружен',
        message: 'Изображение успешно сохранено',
        color: 'green'
      })
    } catch (error: any) {
      console.error('Upload strap base view image error:', error)
      notifications.show({
        title: 'Ошибка загрузки',
        message: error?.message || 'Не удалось загрузить изображение',
        color: 'red'
      })
    } finally {
      resetInput()
      setUploadingBaseView(null)
    }
  }

  const clearBaseViewImage = (key: ViewImageKey) => {
    updateBaseViewImage(key, '')
  }

  const setImageValue = (key: ImageFieldKey, rawValue: string) => {
    const value = rawValue.trim()
    setColorForm((prev) => {
      const nextImages: StrapColor['images'] = { ...(prev.images || {}) }
      if (value) {
        nextImages[key] = value
      } else {
        delete nextImages[key]
      }
      const hasImages = Object.keys(nextImages).length > 0
      return {
        ...prev,
        images: hasImages ? (nextImages as StrapColor['images']) : undefined
      }
    })
  }

  const handleImageUrlChange = (key: ImageFieldKey, value: string) => {
    setImageValue(key, value)
  }

  const handleImageFileUpload = async (
    key: ImageFieldKey,
    file: File | null,
    resetInput: () => void
  ) => {
    if (!file) return

    const currentType = editingColor?.type || isAddingColor?.type
    if (!currentType) return

    try {
      setUploadingState({ key, type: currentType })
      const group = colorTypeGroupMap[currentType] || 'common'
      const response = await uploadStrapColorImage({
        file,
        group,
        view: key,
        colorTitle: colorForm.color_title
      })
      setImageValue(key, response.url)
      notifications.show({
        title: 'Файл загружен',
        message: 'Изображение успешно сохранено',
        color: 'green'
      })
    } catch (error: any) {
      console.error('Upload strap color image error:', error)
      notifications.show({
        title: 'Ошибка загрузки',
        message: error?.message || 'Не удалось загрузить изображение',
        color: 'red'
      })
    } finally {
      resetInput()
      setUploadingState({ key: null, type: null })
    }
  }

  const clearImageValue = (key: ImageFieldKey) => {
    setImageValue(key, '')
  }

  const colorTypes = [
    { key: 'leather_colors', label: 'Цвета кожи', color: 'blue' },
    { key: 'stitching_colors', label: 'Цвета строчки', color: 'green' },
    { key: 'edge_colors', label: 'Цвета края', color: 'orange' },
    { key: 'buckle_colors', label: 'Цвета пряжки', color: 'violet' },
    { key: 'adapter_colors', label: 'Цвета адаптера', color: 'cyan' }
  ]

  const startEditColor = (type: string, index: number) => {
    const colors = strapParams[type as keyof typeof strapParams] as StrapColor[]
    const target = colors[index]
    setColorForm({
      ...target,
      images: {
        view1: target.images?.view1 ?? target.view1 ?? '',
        view2: target.images?.view2 ?? target.view2 ?? '',
        view3: target.images?.view3 ?? target.view3 ?? '',
        icon: target.images?.icon ?? target.icon ?? ''
      }
    })
    setEditingColor({ type, index })
    setIsAddingColor(null)
  }

  const startAddColor = (type: string) => {
    setColorForm({
      color_title: '',
      color_code: '#000000',
      choosen: false,
      images: { ...emptyImages }
    })
    setIsAddingColor({ type })
    setEditingColor(null)
  }

  const saveColor = () => {
    if (!editingColor && !isAddingColor) return

    const type = editingColor?.type || isAddingColor?.type
    if (!type) return

    const currentColors = strapParams[type as keyof typeof strapParams] as StrapColor[]
    let updatedColors: StrapColor[]

    const normalizedImages = {
      view1: colorForm.images?.view1?.trim() || '',
      view2: colorForm.images?.view2?.trim() || '',
      view3: colorForm.images?.view3?.trim() || '',
      icon: colorForm.images?.icon?.trim() || ''
    }
    const imagesToSave = Object.fromEntries(
      Object.entries(normalizedImages).filter(([, v]) => v)
    )

    const colorToSave: StrapColor = {
      ...colorForm,
      images: Object.keys(imagesToSave).length > 0 ? (imagesToSave as StrapColor['images']) : undefined,
      icon: undefined
    }

    if (editingColor) {
      // Редактирование существующего цвета
      updatedColors = [...currentColors]
      updatedColors[editingColor.index] = colorToSave
    } else {
      // Добавление нового цвета
      updatedColors = [...currentColors, colorToSave]
    }

    onUpdate({
      ...strapParams,
      [type]: updatedColors
    })

    setEditingColor(null)
    setIsAddingColor(null)
    setColorForm({
      color_title: '',
      color_code: '#000000',
      choosen: false,
      price: 0,
      images: { ...emptyImages }
    })

    notifications.show({
      title: 'Успешно',
      message: editingColor ? 'Цвет обновлён' : 'Цвет добавлен',
      color: 'green'
    })
  }

  const deleteColor = (type: string, index: number) => {
    if (confirm('Вы уверены, что хотите удалить этот цвет?')) {
      const currentColors = strapParams[type as keyof typeof strapParams] as StrapColor[]
      const updatedColors = currentColors.filter((_, i) => i !== index)

      onUpdate({
        ...strapParams,
        [type]: updatedColors
      })

      notifications.show({
        title: 'Успешно',
        message: 'Цвет удалён',
        color: 'green'
      })
    }
  }

  const cancelEdit = () => {
    setEditingColor(null)
    setIsAddingColor(null)
    setColorForm({
      color_title: '',
      color_code: '#000000',
      choosen: false,
      images: { ...emptyImages }
    })
  }

  return (
    <Stack gap="lg">
      <Title order={3}>Параметры ремешка</Title>
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Stack gap="xs">
          <Text fw={600} size="lg">
            Базовые изображения ремешка
          </Text>
          <Text size="sm" c="dimmed">
            Эти изображения используются по умолчанию, пока не выбран конкретный цвет.
          </Text>
          <SimpleGrid cols={3} spacing="sm">
            {imageFields.map(({ key, label }) => {
              const value = strapParams.view_images?.[key] || ''
              const isUploading = uploadingBaseView === key

              return (
                <Card key={key} withBorder p="sm" radius="sm">
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text fw={500}>{label}</Text>
                      {value && (
                        <Button
                          size="xs"
                          variant="light"
                          color="red"
                          onClick={() => clearBaseViewImage(key)}
                        >
                          Удалить
                        </Button>
                      )}
                    </Group>

                    <Group gap="xs" align="flex-end">
                      <Button
                        component="label"
                        variant="light"
                        size="xs"
                        leftSection={isUploading ? '⏳' : '📁'}
                        disabled={isUploading}
                      >
                        {isUploading ? 'Загрузка...' : 'Загрузить'}
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(event) => {
                            const file = event.target.files?.[0] || null
                            handleBaseViewUpload(key, file, () => {
                              event.target.value = ''
                            })
                          }}
                        />
                      </Button>
                      <TextInput
                        label="или URL"
                        placeholder="https://example.com/image.png"
                        value={value}
                        style={{ flex: 1 }}
                        onChange={(e) => handleBaseViewUrlChange(key, e.target.value)}
                      />
                    </Group>

                    {value && (
                      <Text size="xs" c="dimmed">
                        {value}
                      </Text>
                    )}
                  </Stack>
                </Card>
              )
            })}
          </SimpleGrid>
        </Stack>
      </Card>
      
      {colorTypes.map(({ key, label, color }) => {
        const colors = strapParams[key as keyof typeof strapParams] as StrapColor[]
        const isEditing = editingColor?.type === key
        const isAdding = isAddingColor?.type === key

        return (
          <Card key={key} shadow="sm" padding="md" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Text fw={600} size="lg">{label} ({colors.length})</Text>
              <Button
                size="sm"
                variant="light"
                onClick={() => startAddColor(key)}
              >
                ➕ Добавить цвет
              </Button>
            </Group>

            <SimpleGrid cols={4}>
              {colors.map((colorItem, index) => (
                <div key={index}>
                  <Card 
                    withBorder 
                    p="sm" 
                    radius="sm"
                  >
                    <Stack gap="xs" align="center">
                      <Box
                        style={{
                          width: 40,
                          height: 40,
                          backgroundColor: colorItem.color_code,
                          borderRadius: '50%',
                          border: '2px solid #ddd',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      />
                      
                      <Text fw={500} size="sm" ta="center">
                        {colorItem.color_title}
                      </Text>
                      
                      <Text size="xs" c="dimmed" ta="center">
                        {colorItem.color_code}
                      </Text>

                      <Group gap="xs" justify="center">
                        <Button
                          size="xs"
                          variant="light"
                          color="blue"
                          onClick={(e) => {
                            e.stopPropagation()
                            startEditColor(key, index)
                          }}
                        >
                          Редактировать
                        </Button>
                        <Button
                          size="xs"
                          variant="light"
                          color="red"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteColor(key, index)
                          }}
                        >
                          Удалить
                        </Button>
                      </Group>
                    </Stack>
                  </Card>
                </div>
              ))}
            </SimpleGrid>

            {colors.length === 0 && (
              <Text c="dimmed" ta="center" py="md">
                Нет цветов. Нажмите "Добавить цвет" чтобы добавить первый цвет.
              </Text>
            )}
          </Card>
        )
      })}

      {/* Модальное окно для редактирования/добавления цвета */}
      <Modal
        opened={!!editingColor || !!isAddingColor}
        onClose={cancelEdit}
        title={editingColor ? 'Редактировать цвет' : 'Добавить цвет'}
        size="sm"
      >
        <Stack>
          <TextInput
            label="Название цвета"
            placeholder="Черный"
            value={colorForm.color_title}
            onChange={(e) => setColorForm({ ...colorForm, color_title: e.target.value })}
            required
          />

          <Stack gap="xs">
            <TextInput
              label="Цвет (HEX код)"
              placeholder="#000000"
              value={colorForm.color_code}
              onChange={(e) => setColorForm({ ...colorForm, color_code: e.target.value })}
              required
            />
            <Box>
              <Text size="sm" fw={500} mb="xs">Предпросмотр цвета:</Text>
              <Box
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: colorForm.color_code,
                  borderRadius: '50%',
                  border: '2px solid #ddd',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
            </Box>
          </Stack>

          <Divider />

          <Stack gap="sm">
            <Text fw={600}>Изображения вида</Text>
            {imageFields.map(({ key, label }) => {
              const value = colorForm.images?.[key] || ''
              const hasImage = Boolean(value)
              const currentType = editingColor?.type || isAddingColor?.type || ''
              const isUploading =
                uploadingState.key === key && uploadingState.type === currentType

              return (
                <Card key={key} withBorder p="sm" radius="md">
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text fw={500}>{label}</Text>
                      {hasImage && (
                        <Button
                          size="xs"
                          variant="light"
                          color="red"
                          onClick={() => clearImageValue(key)}
                        >
                          Удалить
                        </Button>
                      )}
                    </Group>

                    <Group gap="xs" align="flex-end">
                      <Button
                        component="label"
                        variant="light"
                        size="xs"
                        leftSection={isUploading ? '⏳' : '📁'}
                        disabled={isUploading}
                      >
                        {isUploading ? 'Загрузка...' : 'Загрузить'}
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(event) => {
                            const file = event.target.files?.[0] || null
                            handleImageFileUpload(key, file, () => {
                              event.target.value = ''
                            })
                          }}
                        />
                      </Button>
                      <TextInput
                        label="или URL"
                        placeholder="https://example.com/image.png"
                        value={value}
                        style={{ flex: 1 }}
                        onChange={(e) => handleImageUrlChange(key, e.target.value)}
                      />
                    </Group>
                    {hasImage && (
                      <Text size="xs" c="dimmed">
                        {value}
                      </Text>
                    )}
                  </Stack>
                </Card>
              )
            })}
          </Stack>

          {(() => {
            const currentType = editingColor?.type || isAddingColor?.type || ''
            if (currentType !== 'adapter_colors') return null
            const iconValue = colorForm.images?.icon || ''
            const isUploadingIcon =
              uploadingState.key === 'icon' && uploadingState.type === 'adapter_colors'

            return (
              <Card withBorder p="sm" radius="md">
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text fw={500}>Иконка выбора адаптера</Text>
                    {iconValue && (
                      <Button
                        size="xs"
                        variant="light"
                        color="red"
                        onClick={() => setImageValue('icon', '')}
                      >
                        Удалить
                      </Button>
                    )}
                  </Group>

                  <Group gap="xs" align="flex-end">
                    <Button
                      component="label"
                      variant="light"
                      size="xs"
                      leftSection={isUploadingIcon ? '⏳' : '📁'}
                      disabled={isUploadingIcon}
                    >
                      {isUploadingIcon ? 'Загрузка...' : 'Загрузить'}
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(event) => {
                          const file = event.target.files?.[0] || null
                          handleImageFileUpload('icon', file, () => {
                            event.target.value = ''
                          })
                        }}
                      />
                    </Button>
                    <TextInput
                      label="или URL"
                      placeholder="https://example.com/icon.png"
                      value={iconValue}
                      style={{ flex: 1 }}
                      onChange={(e) => handleImageUrlChange('icon', e.target.value)}
                    />
                  </Group>

                  {iconValue && (
                    <Group gap="sm" align="center">
                      <Box
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 16,
                          backgroundColor: '#f7f7f7',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          border: '1px solid #e0e0e0'
                        }}
                      >
                        <img
                          src={iconValue}
                          alt="Предпросмотр иконки адаптера"
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                      </Box>
                      <Text size="xs" c="dimmed">
                        {iconValue}
                      </Text>
                    </Group>
                  )}
                </Stack>
              </Card>
            )
          })()}


          <Group justify="flex-end">
            <Button variant="light" onClick={cancelEdit}>
              Отмена
            </Button>
            <Button onClick={saveColor}>
              {editingColor ? '💾 Сохранить' : '➕ Добавить'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  )
}

export default StrapParamsEditor
