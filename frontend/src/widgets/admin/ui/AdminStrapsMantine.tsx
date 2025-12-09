'use client'

import { observer } from 'mobx-react-lite'
import { configuratorStore, Strap } from '@/shared/store/configurator.store'
import { useState, useEffect } from 'react'
import {
  Card, Text, Button, Group, Stack, TextInput, Image, Badge,
  Modal, Title, NumberInput, Textarea, Checkbox, Box, Tabs, Skeleton
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import StrapParamsEditor from './StrapParamsEditor'
import { StrapBaseImagesEditor } from './StrapBaseImagesEditor'
import { uploadStrapColorImage } from '@/shared/api/uploads.api'

export const AdminStrapsMantine = observer(() => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [opened, setOpened] = useState(false)
  const [isUploadingButterflyImage, setIsUploadingButterflyImage] = useState(false)
  const [formData, setFormData] = useState<Partial<Strap>>({
    attributes: {
      watch_strap: {
        id: 0,
        strap_name: '',
        strap_title: '',
        strap_description: '',
        strap_short_description: '',
        price: 0,
        preview_image: '',
        has_buckle_butterfly: false,
        buckle_butterfly_price: 0,
        buckle_butterfly_image: '',
        strap_params: {
          leather_colors: [],
          stitching_colors: [],
          edge_colors: [],
          buckle_colors: [],
          adapter_colors: [],
          has_buckle_butterfly: false,
          view_images: {
            view1: '',
            view2: '',
            view3: ''
          }
        }
      }
    }
  })

  useEffect(() => {
    configuratorStore.loadWatchStrapsFromAPI()
  }, [])

  const startEdit = (index: number) => {
    const strap = configuratorStore.watchStraps[index]
    setFormData({ attributes: { watch_strap: { ...strap.attributes.watch_strap } } })
    setEditingIndex(index)
    setIsAdding(false)
    setOpened(true)
  }

  const startAdd = () => {
    setFormData({
      attributes: {
        watch_strap: {
          id: 0,
          strap_name: '',
          strap_title: '',
          strap_description: '',
          strap_short_description: '',
          preview_image: '',
          ultra_preview_image: '',
          price: 0,
          has_buckle_butterfly: false,
          buckle_butterfly_price: 0,
          buckle_butterfly_image: '',
          strap_params: {
            leather_colors: [],
            stitching_colors: [],
            edge_colors: [],
            buckle_colors: [],
            adapter_colors: [],
            has_buckle_butterfly: false,
            view_images: {
              view1: '',
              view2: '',
              view3: ''
            }
          }
        }
      }
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
  
  const startCopy = (index: number) => {
    const strap = configuratorStore.watchStraps[index]
    // Глубокое копирование всех данных ремешка
    const copiedStrap = JSON.parse(JSON.stringify(strap.attributes.watch_strap))
    
    // Изменяем название, чтобы отличить копию
    copiedStrap.strap_name = `${copiedStrap.strap_name}_copy_${Date.now()}`
    copiedStrap.strap_title = `${copiedStrap.strap_title} (копия)`
    copiedStrap.id = 0 // Новый ID будет присвоен при сохранении
    
    setFormData({ attributes: { watch_strap: copiedStrap } })
    setIsAdding(true)
    setEditingIndex(null)
    setOpened(true)
    
    notifications.show({
      title: 'Копирование',
      message: 'Ремешок скопирован. Измените название и сохраните.',
      color: 'blue',
      autoClose: 3000
    })
  }

  const saveStrap = async () => {
    const strapData: Strap = {
      choosen: false,
      attributes: {
        watch_strap: {
          ...formData.attributes!.watch_strap
        }
      }
    }

    try {
      if (isAdding) {
        await configuratorStore.addWatchStrap(strapData)
        await configuratorStore.loadWatchStrapsFromAPI()
        notifications.show({ title: 'Успешно', message: 'Ремешок добавлен', color: 'green' })
      } else if (editingIndex !== null) {
        await configuratorStore.updateWatchStrap(editingIndex, strapData)
        await configuratorStore.loadWatchStrapsFromAPI()
        notifications.show({ title: 'Успешно', message: 'Ремешок обновлён', color: 'green' })
      }
      cancelEdit()
    } catch (error) {
      notifications.show({ title: 'Ошибка', message: 'Не удалось сохранить ремешок', color: 'red' })
    }
  }

  const deleteStrap = async (index: number) => {
    if (confirm('Вы уверены, что хотите удалить этот ремешок?')) {
      try {
        await configuratorStore.deleteWatchStrap(index)
        notifications.show({ title: 'Успешно', message: 'Ремешок удалён', color: 'green' })
      } catch (error) {
        notifications.show({ title: 'Ошибка', message: 'Не удалось удалить ремешок', color: 'red' })
      }
    }
  }

  const handleBackup = async () => {
    try {
      await configuratorStore.createStrapsBackup()
      notifications.show({ title: 'Успешно', message: 'Бэкап скачан', color: 'green' })
    } catch (error) {
      notifications.show({ title: 'Ошибка', message: 'Не удалось создать бэкап', color: 'red' })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const imageUrl = reader.result as string
        setFormData({
          attributes: {
            watch_strap: {
              ...formData.attributes!.watch_strap,
              preview_image: imageUrl,
              ultra_preview_image: imageUrl
            }
          }
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleButterflyImageUpload = async (file: File | null) => {
    if (!file) return
    try {
      setIsUploadingButterflyImage(true)
      const response = await uploadStrapColorImage({
        file,
        group: 'buckle',
        view: 'butterfly',
        colorTitle: formData.attributes?.watch_strap.strap_title || 'butterfly'
      })
      setFormData({
        attributes: {
          watch_strap: {
            ...formData.attributes!.watch_strap,
            buckle_butterfly_image: response.url
          }
        }
      })
      notifications.show({ title: 'Успешно', message: 'Изображение загружено', color: 'green' })
    } catch (error: any) {
      console.error('Ошибка загрузки изображения butterfly:', error)
      notifications.show({ title: 'Ошибка', message: error?.message || 'Не удалось загрузить изображение', color: 'red' })
    } finally {
      setIsUploadingButterflyImage(false)
    }
  }

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>Ремешки ({configuratorStore.watchStraps.length})</Title>
        <Group>
          <Button variant="light" onClick={handleBackup}>
            💾 Скачать бэкап
          </Button>
          <Button onClick={startAdd}>
            ➕ Добавить ремешок
          </Button>
        </Group>
      </Group>

      <Stack gap="md">
        {configuratorStore.watchStraps.map((strap, index) => (
          <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" wrap="nowrap">
              <Group>
                {strap.attributes.watch_strap.preview_image && (
                  <Image src={strap.attributes.watch_strap.preview_image} h={80} w={80} fit="contain" alt={strap.attributes.watch_strap.strap_title} />
                )}
                <Stack gap="xs">
                  <Text fw={700} size="lg">{strap.attributes.watch_strap.strap_title}</Text>
                  <Text size="sm" c="dimmed">{strap.attributes.watch_strap.strap_name}</Text>
                  <Badge color="blue">{strap.attributes.watch_strap.price} ₽</Badge>
                  {strap.attributes.watch_strap.has_buckle_butterfly && (
                    <Badge color="violet">С пряжкой-бабочкой</Badge>
                  )}
                  <Group gap="xs">
                    <Badge size="sm" color="blue">
                      Кожа: {strap.attributes.watch_strap.strap_params.leather_colors?.length || 0}
                    </Badge>
                    <Badge size="sm" color="green">
                      Строчка: {strap.attributes.watch_strap.strap_params.stitching_colors?.length || 0}
                    </Badge>
                    <Badge size="sm" color="orange">
                      Край: {strap.attributes.watch_strap.strap_params.edge_colors?.length || 0}
                    </Badge>
                    <Badge size="sm" color="violet">
                      Пряжка: {strap.attributes.watch_strap.strap_params.buckle_colors?.length || 0}
                    </Badge>
                    <Badge size="sm" color="cyan">
                      Адаптер: {strap.attributes.watch_strap.strap_params.adapter_colors?.length || 0}
                    </Badge>
                  </Group>
                </Stack>
              </Group>
              <Group>
                <Button size="sm" variant="light" onClick={() => startEdit(index)}>
                  ✏️ Изменить
                </Button>
                <Button size="sm" variant="light" color="blue" onClick={() => startCopy(index)}>
                  📋 Копировать
                </Button>
                <Button size="sm" variant="light" color="red" onClick={() => deleteStrap(index)}>
                  🗑️ Удалить
                </Button>
              </Group>
            </Group>
          </Card>
        ))}
      </Stack>

      <Modal opened={opened} onClose={cancelEdit} title={isAdding ? 'Новый ремешок' : 'Редактирование ремешка'} size="xl">
        <Tabs defaultValue="basic" variant="outline">
          <Tabs.List>
            <Tabs.Tab value="basic">Основные параметры</Tabs.Tab>
            <Tabs.Tab value="base-images">Базовые изображения</Tabs.Tab>
            <Tabs.Tab value="design">Параметры дизайна</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="basic" pt="md">
            <Stack>
              <TextInput
                label="Название (strap_name)"
                placeholder="brogue"
                value={formData.attributes?.watch_strap.strap_name || ''}
                onChange={(e) => setFormData({
                  attributes: { watch_strap: { ...formData.attributes!.watch_strap, strap_name: e.target.value } }
                })}
                required
              />

              <TextInput
                label="Заголовок"
                placeholder="Brogue"
                value={formData.attributes?.watch_strap.strap_title || ''}
                onChange={(e) => setFormData({
                  attributes: { watch_strap: { ...formData.attributes!.watch_strap, strap_title: e.target.value } }
                })}
                required
              />

              <Textarea
                label="Описание"
                placeholder="Описание ремешка"
                value={formData.attributes?.watch_strap.strap_description || ''}
                onChange={(e) => setFormData({
                  attributes: { watch_strap: { ...formData.attributes!.watch_strap, strap_description: e.target.value } }
                })}
                rows={3}
              />

              <TextInput
                label="Краткое описание (для второго шага)"
                placeholder="Краткое описание ремешка"
                description="Отображается на втором шаге конфигуратора при выборе ремешка"
                value={formData.attributes?.watch_strap.strap_short_description || ''}
                onChange={(e) => setFormData({
                  attributes: { watch_strap: { ...formData.attributes!.watch_strap, strap_short_description: e.target.value } }
                })}
              />

              <NumberInput
                label="Цена"
                placeholder="8990"
                value={formData.attributes?.watch_strap.price || 0}
                onChange={(value) => setFormData({
                  attributes: { watch_strap: { ...formData.attributes!.watch_strap, price: Number(value) } }
                })}
                required
              />

              <Box>
                <Text size="sm" fw={500} mb="xs">Изображение ремешка</Text>
                {formData.attributes?.watch_strap.preview_image && (
                  <Card withBorder p="xs" mb="xs" style={{ width: 'fit-content' }}>
                    <Image 
                      src={formData.attributes.watch_strap.preview_image} 
                      h={120} 
                      w={120} 
                      fit="contain" 
                      alt="Preview" 
                    />
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
                    {formData.attributes?.watch_strap.preview_image && (
                      <Button
                        variant="light"
                        color="red"
                        size="sm"
                        onClick={() => setFormData({
                          attributes: {
                            watch_strap: {
                              ...formData.attributes!.watch_strap,
                              preview_image: '',
                              ultra_preview_image: ''
                            }
                          }
                        })}
                      >
                        🗑️ Удалить
                      </Button>
                    )}
                  </Group>
                  <TextInput
                    label="или введите URL изображения"
                    placeholder="https://api.slavalarionov.store/uploads/..."
                    value={formData.attributes?.watch_strap.preview_image || ''}
                    onChange={(e) => setFormData({
                      attributes: {
                        watch_strap: {
                          ...formData.attributes!.watch_strap,
                          preview_image: e.target.value,
                          ultra_preview_image: e.target.value
                        }
                      }
                    })}
                  />
                </Stack>
              </Box>

              <Checkbox
                label="Есть пряжка-бабочка"
                checked={formData.attributes?.watch_strap.has_buckle_butterfly || false}
                onChange={(e) => {
                  const checked = e.currentTarget.checked
                  setFormData((prev) => {
                    const prevStrap = prev.attributes?.watch_strap
                    if (!prevStrap) return prev
                    return {
                      attributes: {
                        watch_strap: {
                          ...prevStrap,
                          has_buckle_butterfly: checked,
                          buckle_butterfly_price: checked ? (prevStrap.buckle_butterfly_price ?? 0) : 0,
                          buckle_butterfly_image: checked ? prevStrap.buckle_butterfly_image || '' : '',
                          strap_params: {
                            ...prevStrap.strap_params,
                            has_buckle_butterfly: checked
                          }
                        }
                      }
                    }
                  })
                }}
              />

              {formData.attributes?.watch_strap.has_buckle_butterfly && (
                <Stack gap="sm">
                  <NumberInput
                    label="Доплата за пряжку-бабочку"
                    placeholder="500"
                    min={0}
                    value={formData.attributes?.watch_strap.buckle_butterfly_price ?? 0}
                    onChange={(value) =>
                      setFormData((prev) => {
                        const prevStrap = prev.attributes?.watch_strap
                        if (!prevStrap) return prev
                        return {
                          attributes: {
                            watch_strap: {
                              ...prevStrap,
                              buckle_butterfly_price: Number(value) || 0
                            }
                          }
                        }
                      })
                    }
                  />

                  <Box>
                    <Text size="sm" fw={500} mb="xs">
                      Изображение пряжки-бабочки
                    </Text>
                    <Stack gap="xs">
                      <Group gap="xs">
                        <Button
                          component="label"
                          variant="filled"
                          size="sm"
                          disabled={isUploadingButterflyImage}
                        >
                          {isUploadingButterflyImage ? 'Загрузка...' : '📁 Загрузить'}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                              const file = event.target.files?.[0] || null
                              handleButterflyImageUpload(file)
                              event.target.value = ''
                            }}
                            style={{ display: 'none' }}
                          />
                        </Button>
                        {formData.attributes?.watch_strap.buckle_butterfly_image && (
                          <Button
                            variant="light"
                            color="red"
                            size="sm"
                            onClick={() =>
                              setFormData((prev) => {
                                const prevStrap = prev.attributes?.watch_strap
                                if (!prevStrap) return prev
                                return {
                                  attributes: {
                                    watch_strap: {
                                      ...prevStrap,
                                      buckle_butterfly_image: ''
                                    }
                                  }
                                }
                              })
                            }
                          >
                            🗑️ Удалить
                          </Button>
                        )}
                      </Group>

                      <TextInput
                        label="или введите URL изображения"
                        placeholder="https://api.slavalarionov.store/uploads/..."
                        value={formData.attributes?.watch_strap.buckle_butterfly_image || ''}
                        onChange={(e) =>
                          setFormData((prev) => {
                            const prevStrap = prev.attributes?.watch_strap
                            if (!prevStrap) return prev
                            return {
                              attributes: {
                                watch_strap: {
                                  ...prevStrap,
                                  buckle_butterfly_image: e.target.value
                                }
                              }
                            }
                          })
                        }
                      />

                      {(isUploadingButterflyImage || formData.attributes?.watch_strap.buckle_butterfly_image) && (
                        <Card withBorder p="xs" style={{ width: 'fit-content' }}>
                          {isUploadingButterflyImage ? (
                            <Skeleton h={120} w={120} radius="md" />
                          ) : (
                            <Image
                              src={formData.attributes?.watch_strap.buckle_butterfly_image}
                              h={120}
                              w={120}
                              fit="contain"
                              alt="Butterfly preview"
                            />
                          )}
                        </Card>
                      )}
                    </Stack>
                  </Box>
                </Stack>
              )}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="base-images" pt="md">
            {!isAdding && editingIndex !== null && formData.attributes?.watch_strap.id ? (
              <StrapBaseImagesEditor
                strapId={formData.attributes.watch_strap.id}
                strapName={formData.attributes.watch_strap.strap_name}
                baseImages={(formData.attributes.watch_strap as any).base_images || []}
                onUpdate={() => {
                  // Reload strap data
                  configuratorStore.loadWatchStrapsFromAPI()
                  if (editingIndex !== null) {
                    const strap = configuratorStore.watchStraps[editingIndex]
                    setFormData({ attributes: { watch_strap: { ...strap.attributes.watch_strap } } })
                  }
                }}
              />
            ) : (
              <Text c="dimmed">Сохраните ремешок, чтобы добавить базовые изображения</Text>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="design" pt="md">
            <StrapParamsEditor
              strapParams={{
                leather_colors: formData.attributes?.watch_strap.strap_params?.leather_colors ?? [],
                stitching_colors: formData.attributes?.watch_strap.strap_params?.stitching_colors ?? [],
                edge_colors: formData.attributes?.watch_strap.strap_params?.edge_colors ?? [],
                buckle_colors: formData.attributes?.watch_strap.strap_params?.buckle_colors ?? [],
                adapter_colors: formData.attributes?.watch_strap.strap_params?.adapter_colors ?? [],
                has_buckle_butterfly: formData.attributes?.watch_strap.strap_params?.has_buckle_butterfly ?? false,
                view_images: formData.attributes?.watch_strap.strap_params?.view_images,
                frame_color_configs: (formData.attributes?.watch_strap.strap_params as any)?.frame_color_configs ?? []
              }}
              onUpdate={(updatedParams) => {
                console.log('[AdminStrapsMantine] onUpdate called with:', updatedParams)
                setFormData({
                  attributes: {
                    watch_strap: {
                      ...formData.attributes!.watch_strap,
                      strap_params: updatedParams
                    }
                  }
                })
              }}
            />
          </Tabs.Panel>
        </Tabs>

        <Group justify="flex-end" mt="lg">
          <Button variant="light" onClick={cancelEdit}>
            Отмена
          </Button>
          <Button onClick={saveStrap}>
            {isAdding ? '➕ Добавить' : '💾 Сохранить'}
          </Button>
        </Group>
      </Modal>
    </Stack>
  )
})

