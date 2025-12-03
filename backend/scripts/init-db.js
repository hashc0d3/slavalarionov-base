const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function initDatabase() {
  try {
    console.log('Проверяем наличие начальных данных...');

    // Проверяем, есть ли настройки конфигуратора
    const settings = await prisma.configuratorSettings.findFirst();

    if (!settings) {
      console.log('Создаем начальные настройки конфигуратора...');
      await prisma.configuratorSettings.create({
        data: {
          title: 'Ремешок почти готов!',
          description:
            'Вы создали уникальный ремешок и он просто прекрасен! Сейчас вы можете добавить инициалы (2-3 буквы на русском или английском языке), добавить подарочную упаковку и подписать открытку, которую мы приложим к этому ремешку.',
          estimated_date: null,
          additional_options: {
            create: [
              {
                option_name: 'initials',
                option_title: 'Нанесение инициалов',
                option_price: 390,
                option_image: null,
                sort_order: 1,
              },
              {
                option_name: 'present_box',
                option_title: 'Подарочная коробка',
                option_price: 300,
                option_image: null,
                sort_order: 2,
              },
              {
                option_name: 'postcard',
                option_title: 'Подарочная открытка',
                option_price: 300,
                option_image: null,
                sort_order: 3,
              },
            ],
          },
        },
      });
      console.log('✓ Начальные настройки созданы!');
    } else {
      console.log('✓ Настройки конфигуратора уже существуют');
    }

    console.log('Инициализация БД завершена успешно');
  } catch (error) {
    console.error('Ошибка при инициализации БД:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

initDatabase();




