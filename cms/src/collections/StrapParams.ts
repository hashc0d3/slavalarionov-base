import { CollectionConfig } from 'payload/types'

export const StrapParams: CollectionConfig = {
  slug: 'strap-params',
  admin: {
    useAsTitle: 'strap_name',
    defaultColumns: ['strap_name', 'watch_strap'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'watch_strap',
      type: 'relationship',
      relationTo: 'watch-straps',
      required: true,
      label: 'Ремешок',
    },
    {
      name: 'strap_name',
      type: 'text',
      required: true,
      label: 'Идентификатор',
    },
    {
      name: 'leather_colors',
      type: 'array',
      label: 'Цвета кожи',
      fields: [
        {
          name: 'color_title',
          type: 'text',
          required: true,
          label: 'Название цвета',
        },
        {
          name: 'color_code',
          type: 'text',
          label: 'Код цвета (HEX)',
        },
        {
          name: 'price',
          type: 'number',
          label: 'Доплата (₽)',
          defaultValue: 0,
        },
      ],
    },
    {
      name: 'stitching_colors',
      type: 'array',
      label: 'Цвета строчки',
      fields: [
        {
          name: 'color_title',
          type: 'text',
          required: true,
          label: 'Название цвета',
        },
        {
          name: 'color_code',
          type: 'text',
          label: 'Код цвета (HEX)',
        },
        {
          name: 'price',
          type: 'number',
          label: 'Доплата (₽)',
          defaultValue: 0,
        },
      ],
    },
    {
      name: 'edge_colors',
      type: 'array',
      label: 'Цвета края',
      fields: [
        {
          name: 'color_title',
          type: 'text',
          required: true,
          label: 'Название цвета',
        },
        {
          name: 'color_code',
          type: 'text',
          label: 'Код цвета (HEX)',
        },
        {
          name: 'price',
          type: 'number',
          label: 'Доплата (₽)',
          defaultValue: 0,
        },
      ],
    },
    {
      name: 'buckle_colors',
      type: 'array',
      label: 'Цвета пряжки',
      fields: [
        {
          name: 'color_title',
          type: 'text',
          required: true,
          label: 'Название цвета',
        },
        {
          name: 'color_code',
          type: 'text',
          label: 'Код цвета (HEX)',
        },
        {
          name: 'price',
          type: 'number',
          label: 'Доплата (₽)',
          defaultValue: 0,
        },
      ],
    },
    {
      name: 'adapter_colors',
      type: 'array',
      label: 'Цвета адаптера',
      fields: [
        {
          name: 'color_title',
          type: 'text',
          required: true,
          label: 'Название цвета',
        },
        {
          name: 'color_code',
          type: 'text',
          label: 'Код цвета (HEX)',
        },
        {
          name: 'price',
          type: 'number',
          label: 'Доплата (₽)',
          defaultValue: 0,
        },
      ],
    },
    {
      name: 'buckle_butterfly_price',
      type: 'number',
      label: 'Цена бабочки (₽)',
      defaultValue: 0,
    },
  ],
}

