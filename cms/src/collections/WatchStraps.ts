import { CollectionConfig } from 'payload/types'

export const WatchStraps: CollectionConfig = {
  slug: 'watch-straps',
  admin: {
    useAsTitle: 'strap_title',
    defaultColumns: ['strap_title', 'strap_name', 'price', 'is_active'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'strap_name',
      type: 'text',
      required: true,
      label: 'Идентификатор ремешка',
      admin: {
        description: 'Уникальное имя ремешка (например, brogue, classic)',
      },
    },
    {
      name: 'strap_title',
      type: 'text',
      required: true,
      label: 'Название ремешка',
      admin: {
        description: 'Отображаемое название (например, Brogue, Classic)',
      },
    },
    {
      name: 'strap_description',
      type: 'richText',
      label: 'Описание',
    },
    {
      name: 'strap_short_description',
      type: 'textarea',
      label: 'Краткое описание',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      label: 'Цена (₽)',
      min: 0,
    },
    {
      name: 'preview_image',
      type: 'upload',
      relationTo: 'media',
      label: 'Изображение предпросмотра',
    },
    {
      name: 'ultra_preview_image',
      type: 'upload',
      relationTo: 'media',
      label: 'Изображение для Ultra моделей',
    },
    {
      name: 'has_buckle_butterfly',
      type: 'checkbox',
      label: 'Есть бабочка',
      defaultValue: false,
    },
    {
      name: 'is_active',
      type: 'checkbox',
      label: 'Активен',
      defaultValue: true,
    },
  ],
}

