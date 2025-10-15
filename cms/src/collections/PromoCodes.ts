import { CollectionConfig } from 'payload/types'

export const PromoCodes: CollectionConfig = {
  slug: 'promo-codes',
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'discount_type', 'discount_value', 'is_active'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      label: 'Промокод',
      admin: {
        description: 'Уникальный код промокода (например, SUMMER2025)',
      },
    },
    {
      name: 'discount_type',
      type: 'select',
      required: true,
      label: 'Тип скидки',
      options: [
        { label: 'Процент', value: 'percent' },
        { label: 'Рубли', value: 'ruble' },
      ],
      defaultValue: 'percent',
    },
    {
      name: 'discount_value',
      type: 'number',
      required: true,
      label: 'Размер скидки',
      admin: {
        description: 'Процент (1-100) или сумма в рублях',
      },
      min: 0,
    },
    {
      name: 'min_order_amount',
      type: 'number',
      label: 'Минимальная сумма заказа (₽)',
      defaultValue: 0,
    },
    {
      name: 'valid_from',
      type: 'date',
      label: 'Действует с',
    },
    {
      name: 'valid_until',
      type: 'date',
      label: 'Действует до',
    },
    {
      name: 'usage_limit',
      type: 'number',
      label: 'Лимит использований',
      admin: {
        description: 'Оставьте пустым для неограниченного использования',
      },
    },
    {
      name: 'usage_count',
      type: 'number',
      label: 'Количество использований',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'is_active',
      type: 'checkbox',
      label: 'Активен',
      defaultValue: true,
    },
  ],
}

