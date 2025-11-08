'use client'

import { useState } from 'react'
import {
  Card, Text, Button, Group, Stack, TextInput,
  Modal, Title, Badge, Box, SimpleGrid
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { StrapColor } from '@/shared/store/configurator.store'
// import { IconPlus, IconTrash, IconEdit } from '@tabler/icons-react'

interface StrapParamsEditorProps {
  strapParams: {
    leather_colors: StrapColor[]
    stitching_colors: StrapColor[]
    edge_colors: StrapColor[]
    buckle_colors: StrapColor[]
    adapter_colors: StrapColor[]
    has_buckle_butterfly?: boolean
  }
  onUpdate: (updatedParams: any) => void
}

const StrapParamsEditor = ({ strapParams, onUpdate }: StrapParamsEditorProps) => {
  const [editingColor, setEditingColor] = useState<{ type: string; index: number } | null>(null)
  const [isAddingColor, setIsAddingColor] = useState<{ type: string } | null>(null)
  const [colorForm, setColorForm] = useState<StrapColor>({
    color_title: '',
    color_code: '#000000',
    choosen: false
  })

  const colorTypes = [
    { key: 'leather_colors', label: 'Цвета кожи', color: 'blue' },
    { key: 'stitching_colors', label: 'Цвета строчки', color: 'green' },
    { key: 'edge_colors', label: 'Цвета края', color: 'orange' },
    { key: 'buckle_colors', label: 'Цвета пряжки', color: 'violet' },
    { key: 'adapter_colors', label: 'Цвета адаптера', color: 'cyan' }
  ]

  const startEditColor = (type: string, index: number) => {
    const colors = strapParams[type as keyof typeof strapParams] as StrapColor[]
    setColorForm(colors[index])
    setEditingColor({ type, index })
    setIsAddingColor(null)
  }

  const startAddColor = (type: string) => {
    setColorForm({
      color_title: '',
      color_code: '#000000',
      choosen: false
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

    if (editingColor) {
      // Редактирование существующего цвета
      updatedColors = [...currentColors]
      updatedColors[editingColor.index] = colorForm
    } else {
      // Добавление нового цвета
      updatedColors = [...currentColors, colorForm]
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
      price: 0
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
      choosen: false
    })
  }

  return (
    <Stack gap="lg">
      <Title order={3}>Параметры ремешка</Title>
      
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
