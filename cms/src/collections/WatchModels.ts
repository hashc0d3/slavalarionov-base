import { CollectionConfig } from 'payload/types'

export const WatchModels: CollectionConfig = {
  slug: 'watch-models',
  admin: {
    useAsTitle: 'watch_model_name',
    defaultColumns: ['watch_model_name', 'watch_model_manufacturer', 'model_name'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'model_name',
      type: 'text',
      required: true,
      label: 'Идентификатор модели',
      admin: {
        description: 'Уникальное имя модели (например, apple-watch-ultra-2)',
      },
    },
    {
      name: 'watch_model_name',
      type: 'text',
      required: true,
      label: 'Название модели',
      admin: {
        description: 'Отображаемое название (например, Apple Watch Ultra 2)',
      },
    },
    {
      name: 'watch_model_manufacturer',
      type: 'text',
      label: 'Производитель',
      admin: {
        description: 'Название производителя (например, Apple)',
      },
    },
    {
      name: 'main_image',
      type: 'upload',
      relationTo: 'media',
      label: 'Основное изображение',
    },
    {
      name: 'watch_sizes',
      type: 'array',
      label: 'Размеры часов',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'watch_size',
          type: 'text',
          required: true,
          label: 'Размер (мм)',
          admin: {
            description: 'Размер в мм (например, 42, 44, 49)',
          },
        },
      ],
    },
    {
      name: 'frame_colors',
      type: 'array',
      label: 'Цвета корпуса',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'color_name',
          type: 'text',
          required: true,
          label: 'Название цвета',
        },
        {
          name: 'color_code',
          type: 'text',
          label: 'Код цвета (HEX)',
          admin: {
            description: 'Например: #C0C0C0',
          },
        },
      ],
    },
    {
      name: 'is_active',
      type: 'checkbox',
      label: 'Активна',
      defaultValue: true,
    },
  ],
}

