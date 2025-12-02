import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWatchModelDto, UpdateWatchModelDto } from './dto/watch-model.dto';

@Injectable()
export class WatchModelsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.watchModel.findMany({
      include: {
        watch_sizes: true,
        frame_colors: true,
        available_straps: {
          include: {
            watchStrap: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.watchModel.findUnique({
      where: { id },
      include: {
        watch_sizes: true,
        frame_colors: true,
        available_straps: {
          include: {
            watchStrap: true,
          },
        },
      },
    });
  }

  async create(data: CreateWatchModelDto) {
    return this.prisma.watchModel.create({
      data: {
        model_name: data.model_name,
        watch_model_name: data.watch_model_name,
        watch_model_manufacturer: data.watch_model_manufacturer,
        main_image: data.main_image,
        watch_sizes: {
          create: data.watch_sizes || [],
        },
        frame_colors: {
          create:
            data.frame_colors?.map((color) => ({
              color_name: color.color_name,
              color_code: color.color_code,
              view1Image: color.view_images?.view1 || null,
              view2Image: color.view_images?.view2 || null,
              view3Image: color.view_images?.view3 || null,
            })) || [],
        },
        available_straps: {
          create: (data.available_strap_ids || []).map((strapId) => ({
            watchStrapId: strapId,
          })),
        },
      },
      include: {
        watch_sizes: true,
        frame_colors: true,
        available_straps: {
          include: {
            watchStrap: true,
          },
        },
      },
    });
  }

  async update(id: number, data: UpdateWatchModelDto) {
    // Удаляем старые связанные данные
    await this.prisma.watchSize.deleteMany({ where: { watchModelId: id } });
    await this.prisma.frameColor.deleteMany({ where: { watchModelId: id } });
    await this.prisma.watchModelStrap.deleteMany({ where: { watchModelId: id } });

    // Обновляем модель с новыми данными
    return this.prisma.watchModel.update({
      where: { id },
      data: {
        model_name: data.model_name,
        watch_model_name: data.watch_model_name,
        watch_model_manufacturer: data.watch_model_manufacturer,
        main_image: data.main_image,
        watch_sizes: {
          create: data.watch_sizes || [],
        },
        frame_colors: {
          create:
            data.frame_colors?.map((color) => ({
              color_name: color.color_name,
              color_code: color.color_code,
              view1Image: color.view_images?.view1 || null,
              view2Image: color.view_images?.view2 || null,
              view3Image: color.view_images?.view3 || null,
            })) || [],
        },
        available_straps: {
          create: (data.available_strap_ids || []).map((strapId) => ({
            watchStrapId: strapId,
          })),
        },
      },
      include: {
        watch_sizes: true,
        frame_colors: true,
        available_straps: {
          include: {
            watchStrap: true,
          },
        },
      },
    });
  }

  async delete(id: number) {
    return this.prisma.watchModel.delete({
      where: { id },
    });
  }

  async backup() {
    const models = await this.findAll();
    return {
      timestamp: new Date().toISOString(),
      data: models,
    };
  }

  async restoreFromBackup(backupData: any[]) {
    // Очищаем все существующие модели и связанные данные
    await this.prisma.watchModelStrap.deleteMany();
    await this.prisma.watchModel.deleteMany();

    // Создаем модели из бэкапа с сохранением ID
    for (const modelData of backupData) {
      const createdModel = await this.prisma.watchModel.create({
        data: {
          id: modelData.id, // Сохраняем оригинальный ID
          model_name: modelData.model_name,
          watch_model_name: modelData.watch_model_name,
          watch_model_manufacturer: modelData.watch_model_manufacturer,
          main_image: modelData.main_image,
          watch_sizes: {
            create: modelData.watch_sizes.map((s: any) => ({
              watch_size: s.watch_size,
            })),
          },
          frame_colors: {
            create: modelData.frame_colors.map((c: any) => ({
              color_name: c.color_name,
              color_code: c.color_code,
              view1Image: c.view1Image ?? c.view_images?.view1 ?? null,
              view2Image: c.view2Image ?? c.view_images?.view2 ?? null,
              view3Image: c.view3Image ?? c.view_images?.view3 ?? null,
            })),
          },
        },
      });

      // Восстанавливаем связи с ремешками, если они есть
      if (modelData.available_straps && modelData.available_straps.length > 0) {
        for (const strapRelation of modelData.available_straps) {
          try {
            await this.prisma.watchModelStrap.create({
              data: {
                watchModelId: createdModel.id,
                watchStrapId: strapRelation.watchStrapId,
              },
            });
          } catch (error) {
            console.warn(`Не удалось создать связь с ремешком ${strapRelation.watchStrapId}:`, error);
          }
        }
      }
    }

    return { success: true, restoredCount: backupData.length };
  }
}

