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
        title: '',
        description: '',
        options: [],
      };
    }

    return {
      id: settings.id,
      title: settings.title,
      description: settings.description,
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
}

