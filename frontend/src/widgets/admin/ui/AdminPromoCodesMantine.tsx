"use client"

import { useEffect, useState } from 'react'
import { Button, Group, Modal, NumberInput, Stack, Table, Text, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { promocodeApi, PromoCode } from '@/shared/api/promocode.api'

type PromoFormState = {
  id: number | null
  code: string
  discountPercent: number | null
  discountAmount: number | null
  activationsLeft: number
}

const defaultFormState: PromoFormState = {
  id: null,
  code: '',
  discountPercent: null,
  discountAmount: null,
  activationsLeft: 1
}

export const AdminPromoCodesMantine = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [modalOpened, setModalOpened] = useState(false)
  const [formState, setFormState] = useState<PromoFormState>(defaultFormState)
  const [discountMode, setDiscountMode] = useState<'percent' | 'amount' | null>(null)

  const loadPromoCodes = async () => {
    try {
      setIsLoading(true)
      const promos = await promocodeApi.getAll()
      setPromoCodes(promos)
    } catch (error) {
      console.error('Failed to load promo codes', error)
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось загрузить список промокодов',
        color: 'red'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPromoCodes()
  }, [])

  const openCreateModal = () => {
    setFormState(defaultFormState)
    setDiscountMode(null)
    setModalOpened(true)
  }

  const openEditModal = (promo: PromoCode) => {
    setFormState({
      id: promo.id,
      code: promo.code,
      discountPercent: promo.discountPercent,
      discountAmount: promo.discountAmount,
      activationsLeft: promo.activationsLeft
    })
    if (promo.discountPercent) setDiscountMode('percent')
    else if (promo.discountAmount) setDiscountMode('amount')
    else setDiscountMode(null)
    setModalOpened(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await promocodeApi.delete(id)
      notifications.show({
        title: 'Удалено',
        message: 'Промокод удалён',
        color: 'green'
      })
      loadPromoCodes()
    } catch (error) {
      console.error('Failed to delete promo code', error)
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось удалить промокод',
        color: 'red'
      })
    }
  }

  const handleSubmit = async () => {
    if (!formState.code.trim()) {
      notifications.show({
        title: 'Ошибка',
        message: 'Укажите код промокода',
        color: 'red'
      })
      return
    }

    if (!formState.discountPercent && !formState.discountAmount) {
      notifications.show({
        title: 'Ошибка',
        message: 'Укажите скидку (процент или сумму)',
        color: 'red'
      })
      return
    }

    try {
      setIsLoading(true)
      if (formState.id) {
        await promocodeApi.update(formState.id, {
          code: formState.code,
          discountPercent: discountMode === 'percent' ? formState.discountPercent ?? undefined : undefined,
          discountAmount: discountMode === 'amount' ? formState.discountAmount ?? undefined : undefined,
          activationsLeft: formState.activationsLeft
        })
        notifications.show({
          title: 'Обновлено',
          message: 'Промокод обновлён',
          color: 'green'
        })
      } else {
        await promocodeApi.create({
          code: formState.code,
          discountPercent: discountMode === 'percent' ? formState.discountPercent ?? undefined : undefined,
          discountAmount: discountMode === 'amount' ? formState.discountAmount ?? undefined : undefined,
          activationsLeft: formState.activationsLeft
        })
        notifications.show({
          title: 'Создано',
          message: 'Промокод создан',
          color: 'green'
        })
      }

      setModalOpened(false)
      setFormState(defaultFormState)
      loadPromoCodes()
    } catch (error: any) {
      console.error('Failed to save promo code', error)
      notifications.show({
        title: 'Ошибка',
        message: error?.message || 'Не удалось сохранить промокод',
        color: 'red'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Text size="xl" fw={600}>
          Промокоды
        </Text>
        <Button onClick={openCreateModal}>Добавить промокод</Button>
      </Group>

      <Table striped highlightOnHover withColumnBorders={false}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Код</Table.Th>
            <Table.Th>Скидка</Table.Th>
            <Table.Th>Активаций</Table.Th>
            <Table.Th>Создан</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {promoCodes.length === 0 && (
            <Table.Tr>
              <Table.Td colSpan={5}>
                <Text c="dimmed">Промокоды отсутствуют</Text>
              </Table.Td>
            </Table.Tr>
          )}
          {promoCodes.map((promo) => (
            <Table.Tr key={promo.id}>
              <Table.Td>{promo.code}</Table.Td>
              <Table.Td>
                {promo.discountPercent
                  ? `${promo.discountPercent}%`
                  : promo.discountAmount
                    ? `${promo.discountAmount} ₽`
                    : '—'}
              </Table.Td>
              <Table.Td>{promo.activationsLeft}</Table.Td>
              <Table.Td>{new Date(promo.createdAt).toLocaleDateString()}</Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <Button size="xs" variant="light" onClick={() => openEditModal(promo)}>
                    Редактировать
                  </Button>
                  <Button size="xs" color="red" variant="light" onClick={() => handleDelete(promo.id)}>
                    Удалить
                  </Button>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={formState.id ? 'Редактировать промокод' : 'Создать промокод'}
        centered
      >
        <Stack gap="md">
          <TextInput
            label="Код"
            placeholder="PROMO2026"
            value={formState.code}
            onChange={(event) => {
              const value =
                typeof event === 'string'
                  ? event
                  : event?.currentTarget?.value ?? ''
              setFormState((prev) => ({
                ...prev,
                code: value
              }))
            }}
          />

          <Group grow>
            <Stack gap="xs">
              <Group gap="xs">
                <Button
                  variant={discountMode === 'percent' ? 'filled' : 'light'}
                  onClick={() => {
                    setDiscountMode('percent')
                    setFormState((prev) => ({ ...prev, discountPercent: prev.discountPercent ?? 1, discountAmount: null }))
                  }}
                >
                  Скидка %
                </Button>
                <Button
                  variant={discountMode === 'amount' ? 'filled' : 'light'}
                  onClick={() => {
                    setDiscountMode('amount')
                    setFormState((prev) => ({ ...prev, discountAmount: prev.discountAmount ?? 1, discountPercent: null }))
                  }}
                >
                  Скидка ₽
                </Button>
                <Button
                  variant={discountMode === null ? 'filled' : 'light'}
                  onClick={() => {
                    setDiscountMode(null)
                    setFormState((prev) => ({ ...prev, discountAmount: null, discountPercent: null }))
                  }}
                >
                  Без скидки
                </Button>
              </Group>

              {discountMode === 'percent' && (
                <NumberInput
                  label="Процент скидки"
                  placeholder="Введите процент"
                  value={formState.discountPercent ?? undefined}
                  min={1}
                  max={100}
                  onChange={(value) =>
                    setFormState((prev) => ({
                      ...prev,
                      discountPercent: typeof value === 'number' ? value : prev.discountPercent
                    }))
                  }
                />
              )}

              {discountMode === 'amount' && (
                <NumberInput
                  label="Сумма скидки (₽)"
                  placeholder="Введите сумму"
                  value={formState.discountAmount ?? undefined}
                  min={1}
                  onChange={(value) =>
                    setFormState((prev) => ({
                      ...prev,
                      discountAmount: typeof value === 'number' ? value : prev.discountAmount
                    }))
                  }
                />
              )}

              {discountMode === null && (
                <Text size="sm" c="dimmed">
                  Выберите тип скидки или оставьте без скидки.
                </Text>
              )}
            </Stack>
          </Group>

          <NumberInput
            label="Количество активаций"
            min={0}
            value={formState.activationsLeft ?? undefined}
            onChange={(value) =>
              setFormState((prev) => ({
                ...prev,
                activationsLeft: typeof value === 'number' ? value : prev.activationsLeft
              }))
            }
          />

          <Group justify="flex-end">
            <Button variant="default" onClick={() => setModalOpened(false)}>
              Отмена
            </Button>
            <Button onClick={handleSubmit} loading={isLoading}>
              Сохранить
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  )
}

