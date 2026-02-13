import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateColorDto {
  technical_name: string;
  display_name: string;
  hex_code: string;
}

export interface UpdateColorDto {
  technical_name?: string;
  display_name?: string;
  hex_code?: string;
}

@Injectable()
export class ColorsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.color.findMany({
      orderBy: { display_name: 'asc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.color.findUnique({
      where: { id },
    });
  }

  async create(data: CreateColorDto) {
    return this.prisma.color.create({
      data,
    });
  }

  async update(id: number, data: UpdateColorDto) {
    return this.prisma.color.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    try {
      // Сначала проверяем существование цвета
      const color = await this.prisma.color.findUnique({
        where: { id },
        include: {
          frame_colors: true,
          strap_base_images: true,
        },
      });

      if (!color) {
        throw new Error('Color not found');
      }

      // Удаляем цвет (каскадное удаление связанных данных происходит автоматически)
      return await this.prisma.color.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error deleting color:', error);
      throw error;
    }
  }
}

