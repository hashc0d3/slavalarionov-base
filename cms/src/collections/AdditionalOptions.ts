import { CollectionConfig } from 'payload/types'

export const AdditionalOptions: CollectionConfig = {
  slug: 'additional-options',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Заголовок',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
    },
    {
      name: 'additional_options',
      type: 'array',
      label: 'Опции',
      fields: [
        {
          name: 'option_name',
          type: 'text',
          required: true,
          label: 'Идентификатор опции',
          admin: {
            description: 'initials, presentBox, postCard',
          },
        },
        {
          name: 'option_title',
          type: 'text',
          required: true,
          label: 'Название опции',
        },
        {
          name: 'option_description',
          type: 'textarea',
          label: 'Описание опции',
        },
        {
          name: 'option_placeholder',
          type: 'text',
          label: 'Плейсхолдер',
        },
        {
          name: 'option_price',
          type: 'number',
          required: true,
          label: 'Цена (₽)',
          defaultValue: 0,
        },
        {
          name: 'option_type',
          type: 'select',
          required: true,
          label: 'Тип опции',
          options: [
            { label: 'Чекбокс', value: 'checkbox' },
            { label: 'Текст', value: 'text' },
            { label: 'Текстовое поле', value: 'textarea' },
          ],
        },
        {
          name: 'is_active',
          type: 'checkbox',
          label: 'Активна',
          defaultValue: true,
        },
      ],
    },
  ],
}

