import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConfiguratorService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings() {
    const settings = await this.prisma.configuratorSettings.findFirst({
      include: {
        additional_options: {
          orderBy: {
            sort_order: 'asc',
          },
        },
      },
      orderBy: [
        {
          id: 'asc',
        },
      ],
    });

    if (!settings) {
      return {
        id: null,
        title: 'Ремешок почти готов!',
        description: 'Вы создали уникальный ремешок и он просто прекрасен! Сейчас вы можете добавить инициалы (2-3 буквы на русском или английском языке), добавить подарочную упаковку и подписать открытку, которую мы приложим к этому ремешку.',
        estimated_date: null,
        options: [],
      };
    }

    return {
      id: settings.id,
      title: settings.title,
      description: settings.description,
      estimated_date: settings.estimated_date,
      options: settings.additional_options.map((option) => ({
        id: option.id,
        option_name: option.option_name,
        option_title: option.option_title,
        option_price: option.option_price,
        option_image: option.option_image,
        sort_order: option.sort_order,
      })),
    };
  }

  async updateSettings(data: { title?: string; description?: string; estimated_date?: string }) {
    // Получаем или создаем настройки
    let settings = await this.prisma.configuratorSettings.findFirst();
    
    if (!settings) {
      // Создаем новую запись настроек если её нет
      settings = await this.prisma.configuratorSettings.create({
        data: {
          title: data.title || 'Ремешок почти готов!',
          description: data.description || 'Вы создали уникальный ремешок и он просто прекрасен! Сейчас вы можете добавить инициалы (2-3 буквы на русском или английском языке), добавить подарочную упаковку и подписать открытку, которую мы приложим к этому ремешку.',
          estimated_date: data.estimated_date || null,
        },
      });
    } else {
      // Обновляем существующую
      const updateData: any = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.estimated_date !== undefined) updateData.estimated_date = data.estimated_date;
      
      settings = await this.prisma.configuratorSettings.update({
        where: { id: settings.id },
        data: updateData,
      });
    }

    return this.getSettings();
  }
}

