import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const FIRST_ADMIN_EMAIL = 'ddolgosheev2@gmail.com'

async function main() {
  console.log('Seeding database...')

  // RBAC: первый администратор (доступ в админку). Остальных можно добавить через БД.
  const existingAdmin = await prisma.user.findUnique({ where: { email: FIRST_ADMIN_EMAIL } })
  if (!existingAdmin) {
    await prisma.user.upsert({
      where: { email: FIRST_ADMIN_EMAIL },
      create: { email: FIRST_ADMIN_EMAIL, role: 'ADMIN' },
      update: {},
    })
    console.log(`✓ First admin created: ${FIRST_ADMIN_EMAIL}`)
  } else {
    console.log(`✓ Admin already exists: ${FIRST_ADMIN_EMAIL}`)
  }

  // Очищаем существующие данные (кроме users)
  await prisma.configuratorAdditionalOption.deleteMany()
  await prisma.configuratorSettings.deleteMany()
  await prisma.watchModelStrap.deleteMany()
  await prisma.frameColor.deleteMany()
  await prisma.strapBaseImage.deleteMany()
  await prisma.watchModel.deleteMany()
  await prisma.watchStrap.deleteMany()
  await prisma.color.deleteMany()

  // Создаём базовые цвета
  const colors = await Promise.all([
    prisma.color.create({ data: { technical_name: 'silver', display_name: 'Серебристый', hex_code: '#C0C0C0' } }),
    prisma.color.create({ data: { technical_name: 'black', display_name: 'Чёрный', hex_code: '#000000' } }),
    prisma.color.create({ data: { technical_name: 'titanium', display_name: 'Титановый', hex_code: '#8A8D8F' } }),
    prisma.color.create({ data: { technical_name: 'white', display_name: 'Белый', hex_code: '#ffffff' } }),
    prisma.color.create({ data: { technical_name: 'brown', display_name: 'Коричневый', hex_code: '#7b4b2a' } }),
  ])

  const silverColor = colors[0]
  const blackColor = colors[1]
  const titaniumColor = colors[2]

  console.log('✓ Colors seeded!')

  // Добавляем начальные модели
  const models = [
    {
      model_name: 'Apple Watch',
      watch_model_name: '4-6 серия, SE',
      watch_model_manufacturer: 'Apple Watch',
      main_image: 'https://api.slavalarionov.store/uploads/4_6_series_ab7100cb46.png',
      watch_sizes: {
        create: [
          { watch_size: '40' },
          { watch_size: '44' }
        ]
      },
      frame_colors: {
        create: [
          { colorId: silverColor.id },
          { colorId: blackColor.id }
        ]
      }
    },
    {
      model_name: 'Apple Watch',
      watch_model_name: '7-9 серия',
      watch_model_manufacturer: 'Apple Watch',
      main_image: 'https://api.slavalarionov.store/uploads/7_8_series_0de058bb24.png',
      watch_sizes: {
        create: [
          { watch_size: '41' },
          { watch_size: '45' }
        ]
      },
      frame_colors: {
        create: [
          { colorId: silverColor.id },
          { colorId: blackColor.id }
        ]
      }
    },
    {
      model_name: 'Apple Watch',
      watch_model_name: '10 серия',
      watch_model_manufacturer: 'Apple Watch',
      main_image: 'https://api.slavalarionov.store/uploads/10_series_7ad739c554.png',
      watch_sizes: {
        create: [
          { watch_size: '42' },
          { watch_size: '46' }
        ]
      },
      frame_colors: {
        create: [
          { colorId: silverColor.id },
          { colorId: blackColor.id }
        ]
      }
    },
    {
      model_name: 'Apple Watch',
      watch_model_name: 'Ultra 1-2',
      watch_model_manufacturer: 'Apple Watch',
      main_image: 'https://api.slavalarionov.store/uploads/ultra_06287a958b.png',
      watch_sizes: {
        create: [
          { watch_size: '49' }
        ]
      },
      frame_colors: {
        create: [
          { colorId: titaniumColor.id },
          { colorId: blackColor.id }
        ]
      }
    }
  ]

  for (const modelData of models) {
    await prisma.watchModel.create({
      data: modelData
    })
  }

  console.log('✓ Watch models seeded!')

  // Добавляем начальные ремешки (все 5 из mockStraps)
  const straps = [
    {
      strap_name: 'butterfly',
      strap_title: 'Butterfly',
      strap_description: 'Пряжка бабочка для исключительного комфорта',
      price: 8990,
      preview_image: 'https://api.slavalarionov.store/uploads/butterfly_6c5fe88b84.png',
      ultra_preview_image: 'https://api.slavalarionov.store/uploads/butterfly_6c5fe88b84.png',
      has_buckle_butterfly: true,
      buckle_butterfly_price: 700,
      strap_params: JSON.stringify({
        leather_colors: [
          { color_title: 'Черный', color_code: '#1b1b1b', choosen: false },
          { color_title: 'Коричневый', color_code: '#7b4b2a', choosen: false }
        ],
        stitching_colors: [
          { color_title: 'Черная', color_code: '#1b1b1b', choosen: false },
          { color_title: 'Белая', color_code: '#ffffff', choosen: false }
        ],
        edge_colors: [
          { color_title: 'Черный', color_code: '#1b1b1b', choosen: false },
          { color_title: 'Коричневый', color_code: '#7b4b2a', choosen: false }
        ],
        buckle_colors: [
          { color_title: 'Silver', color_code: '#C0C0C0', choosen: false },
          { color_title: 'Black', color_code: '#000000', choosen: false }
        ],
        adapter_colors: [
          { color_title: 'Silver', color_code: '#C0C0C0', choosen: false },
          { color_title: 'Black', color_code: '#000000', choosen: false }
        ],
        has_buckle_butterfly: true
      })
    },
    {
      strap_name: 'classic',
      strap_title: 'Classic',
      strap_description: 'Превосходный классический дизайн и ничего лишнего',
      price: 8490,
      preview_image: 'https://api.slavalarionov.store/uploads/classic_8280babad8.png',
      ultra_preview_image: 'https://api.slavalarionov.store/uploads/classic_8280babad8.png',
      has_buckle_butterfly: false,
      buckle_butterfly_price: 0,
      strap_params: JSON.stringify({
        leather_colors: [
          { color_title: 'Черный', color_code: '#1b1b1b', choosen: false },
          { color_title: 'Коричневый', color_code: '#7b4b2a', choosen: false }
        ],
        stitching_colors: [
          { color_title: 'Черная', color_code: '#1b1b1b', choosen: false },
          { color_title: 'Белая', color_code: '#ffffff', choosen: false }
        ],
        edge_colors: [
          { color_title: 'Черный', color_code: '#1b1b1b', choosen: false }
        ],
        buckle_colors: [
          { color_title: 'Silver', color_code: '#C0C0C0', choosen: false },
          { color_title: 'Black', color_code: '#000000', choosen: false }
        ],
        adapter_colors: [
          { color_title: 'Silver', color_code: '#C0C0C0', choosen: false },
          { color_title: 'Black', color_code: '#000000', choosen: false }
        ],
        has_buckle_butterfly: false
      })
    },
    {
      strap_name: 'double-wrap',
      strap_title: 'Double Wrap',
      strap_description: 'С двойным оборотом вокруг запястья',
      price: 9490,
      preview_image: 'https://api.slavalarionov.store/uploads/aw_dabl_6163afb63b.png',
      ultra_preview_image: 'https://api.slavalarionov.store/uploads/aw_dabl_6163afb63b.png',
      has_buckle_butterfly: false,
      buckle_butterfly_price: 0,
      strap_params: JSON.stringify({
        leather_colors: [
          { color_title: 'Черный', color_code: '#1b1b1b', choosen: false },
          { color_title: 'Коричневый', color_code: '#7b4b2a', choosen: false }
        ],
        stitching_colors: [
          { color_title: 'Черная', color_code: '#1b1b1b', choosen: false },
          { color_title: 'Белая', color_code: '#ffffff', choosen: false }
        ],
        edge_colors: [
          { color_title: 'Черный', color_code: '#1b1b1b', choosen: false }
        ],
        buckle_colors: [
          { color_title: 'Silver', color_code: '#C0C0C0', choosen: false },
          { color_title: 'Black', color_code: '#000000', choosen: false }
        ],
        adapter_colors: [
          { color_title: 'Silver', color_code: '#C0C0C0', choosen: false },
          { color_title: 'Black', color_code: '#000000', choosen: false }
        ],
        has_buckle_butterfly: false
      })
    },
    {
      strap_name: 'brogue',
      strap_title: 'Brogue',
      strap_description: 'Ремешок «Brogue» с элегантной перфорацией (словно на стильных классических туфлях) позволит вашей руке дышать. Поверьте, с этой моделью ваше запястье будет чувствовать себя в полном комфорте и будет притягивать взгляды.',
      strap_short_description: 'Декоративная перфорация в классическом стиле',
      price: 8990,
      preview_image: 'https://api.slavalarionov.store/uploads/Brogue_4539ae7e9d.png',
      ultra_preview_image: 'https://api.slavalarionov.store/uploads/Brogue_4539ae7e9d.png',
      has_buckle_butterfly: false,
      buckle_butterfly_price: 0,
      strap_params: JSON.stringify({
        leather_colors: [
          { color_title: 'Белый', color_code: '#ffffff', choosen: true },
          { color_title: 'Чёрный', color_code: '#000000', choosen: false },
          { color_title: 'Бежевый', color_code: '#f5f5dc', choosen: false },
          { color_title: 'Чароит', color_code: '#7c5a9b', choosen: false },
          { color_title: 'Зеленовато-желтый', color_code: '#949e20', choosen: false },
          { color_title: 'Шоколадный', color_code: '#684625', choosen: false },
          { color_title: 'Зелёный', color_code: '#31584a', choosen: false },
          { color_title: 'Фуксия', color_code: '#a8355a', choosen: false },
          { color_title: 'Голубой', color_code: '#6b8390', choosen: false },
          { color_title: 'Марсала', color_code: '#5e4a4f', choosen: false },
          { color_title: 'Мятный', color_code: '#a2b2a9', choosen: false },
          { color_title: 'Оранжевый', color_code: '#9f4529', choosen: false },
          { color_title: 'Пудра', color_code: '#af9d97', choosen: false },
          { color_title: 'Красный', color_code: '#bb4646', choosen: false },
          { color_title: 'Королевский синий', color_code: '#373a4d', choosen: false },
          { color_title: 'Серый', color_code: '#67605e', choosen: false },
          { color_title: 'Ультрамарин', color_code: '#5966ad', choosen: false },
          { color_title: 'Фиолетовый', color_code: '#64396b', choosen: false },
          { color_title: 'Жёлтый', color_code: '#c79a30', choosen: false }
        ],
        stitching_colors: [
          { color_title: 'Белый', color_code: '#ffffff', choosen: true },
          { color_title: 'Бежевый', color_code: '#f5f5dc', choosen: false },
          { color_title: 'Чёрный', color_code: '#000000', choosen: false },
          { color_title: 'Коричневый', color_code: '#684625', choosen: false },
          { color_title: 'Чароит', color_code: '#7c5a9b', choosen: false },
          { color_title: 'Зелёный', color_code: '#31584a', choosen: false },
          { color_title: 'Фуксия', color_code: '#a8355a', choosen: false },
          { color_title: 'Голубой', color_code: '#6b8390', choosen: false },
          { color_title: 'Марсала', color_code: '#5e4a4f', choosen: false },
          { color_title: 'Мятный', color_code: '#a2b2a9', choosen: false },
          { color_title: 'Оранжевый', color_code: '#9f4529', choosen: false },
          { color_title: 'Пудра', color_code: '#af9d97', choosen: false },
          { color_title: 'Красный', color_code: '#bb4646', choosen: false },
          { color_title: 'Королевский синий', color_code: '#373a4d', choosen: false },
          { color_title: 'Серый', color_code: '#67605e', choosen: false },
          { color_title: 'Ультрамарин', color_code: '#5966ad', choosen: false },
          { color_title: 'Фиолетовый', color_code: '#64396b', choosen: false },
          { color_title: 'Жёлтый', color_code: '#c79a30', choosen: false },
          { color_title: 'Зеленовато-желтый', color_code: '#949e20', choosen: false }
        ],
        edge_colors: [
          { color_title: 'Белый', color_code: '#ffffff', choosen: true },
          { color_title: 'Бежевый', color_code: '#f5f5dc', choosen: false },
          { color_title: 'Чёрный', color_code: '#000000', choosen: false },
          { color_title: 'Коричневый', color_code: '#684625', choosen: false },
          { color_title: 'Чароит', color_code: '#7c5a9b', choosen: false },
          { color_title: 'Зеленовато-желтый', color_code: '#949e20', choosen: false },
          { color_title: 'Зелёный', color_code: '#31584a', choosen: false },
          { color_title: 'Фуксия', color_code: '#a8355a', choosen: false },
          { color_title: 'Голубой', color_code: '#6b8390', choosen: false },
          { color_title: 'Марсала', color_code: '#5e4a4f', choosen: false },
          { color_title: 'Мятный', color_code: '#a2b2a9', choosen: false },
          { color_title: 'Оранжевый', color_code: '#9f4529', choosen: false },
          { color_title: 'Пудра', color_code: '#af9d97', choosen: false },
          { color_title: 'Красный', color_code: '#bb4646', choosen: false },
          { color_title: 'Королевский синий', color_code: '#373a4d', choosen: false },
          { color_title: 'Серый', color_code: '#67605e', choosen: false },
          { color_title: 'Ультрамарин', color_code: '#5966ad', choosen: false },
          { color_title: 'Фиолетовый', color_code: '#64396b', choosen: false },
          { color_title: 'Жёлтый', color_code: '#c79a30', choosen: false }
        ],
        buckle_colors: [
          { color_title: 'Чёрный', color_code: '#000000', choosen: false },
          { color_title: 'Розовое золото', color_code: '#b8977e', choosen: false },
          { color_title: 'Серебряный', color_code: '#c0c0c0', choosen: true }
        ],
        adapter_colors: [
          { color_title: 'Серебряный', color_code: '#c0c0c0', choosen: true },
          { color_title: 'Чёрный', color_code: '#000000', choosen: false },
          { color_title: 'Роз. золото', color_code: '#b8977e', choosen: false },
          { color_title: 'Синий', color_code: '#4a90e2', choosen: false },
          { color_title: 'Зелёный', color_code: '#31584a', choosen: false }
        ],
        has_buckle_butterfly: false
      })
    },
    {
      strap_name: 'minimal',
      strap_title: 'Minimal',
      strap_description: 'Элегантно, стильно и безумно аккуратно',
      price: 6990,
      preview_image: 'https://api.slavalarionov.store/uploads/Minimal_6d74c24e75.png',
      ultra_preview_image: 'https://api.slavalarionov.store/uploads/Minimal_6d74c24e75.png',
      has_buckle_butterfly: false,
      buckle_butterfly_price: 0,
      strap_params: JSON.stringify({
        leather_colors: [
          { color_title: 'Черный', color_code: '#1b1b1b', choosen: false },
          { color_title: 'Коричневый', color_code: '#7b4b2a', choosen: false }
        ],
        stitching_colors: [
          { color_title: 'Черная', color_code: '#1b1b1b', choosen: false },
          { color_title: 'Белая', color_code: '#ffffff', choosen: false }
        ],
        edge_colors: [
          { color_title: 'Черный', color_code: '#1b1b1b', choosen: false }
        ],
        buckle_colors: [
          { color_title: 'Silver', color_code: '#C0C0C0', choosen: false },
          { color_title: 'Black', color_code: '#000000', choosen: false }
        ],
        adapter_colors: [
          { color_title: 'Silver', color_code: '#C0C0C0', choosen: false },
          { color_title: 'Black', color_code: '#000000', choosen: false }
        ],
        has_buckle_butterfly: false
      })
    }
  ]

  for (const strapData of straps) {
    await prisma.watchStrap.create({
      data: strapData
    })
  }

  console.log('✓ Watch straps seeded!')

  // Конфигурация дополнительных опций
  await prisma.configuratorSettings.create({
    data: {
      title: 'Ремешок почти готов!',
      description:
        'Вы создали уникальный ремешок и он просто прекрасен! Сейчас вы можете добавить инициалы (2-3 буквы на русском или английском языке), добавить подарочную упаковку и подписать открытку, которую мы приложим к этому ремешку.',
      additional_options: {
        create: [
          {
            option_name: 'initials',
            option_title: 'Нанесение инициалов',
            option_price: 390,
            option_image: '/uploads/caption_88dca0bed8.jpg',
            sort_order: 1
          },
          {
            option_name: 'present_box',
            option_title: 'Подарочная коробка',
            option_price: 300,
            option_image: '/uploads/present_box_75bbc808e1.jpg',
            sort_order: 2
          },
          {
            option_name: 'postcard',
            option_title: 'Подарочная открытка',
            option_price: 90,
            option_image: '/uploads/postcard_4490cc700c.jpg',
            sort_order: 3
          }
        ]
      }
    }
  })

  console.log('✓ Configurator settings seeded!')

  // Связываем модели часов с ремешками (все ремешки доступны для всех моделей)
  const allModels = await prisma.watchModel.findMany()
  const allStraps = await prisma.watchStrap.findMany()

  for (const model of allModels) {
    for (const strap of allStraps) {
      await prisma.watchModelStrap.create({
        data: {
          watchModelId: model.id,
          watchStrapId: strap.id,
        },
      })
    }
  }

  console.log('✓ Watch model-strap relations created!')
  console.log('✓ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

