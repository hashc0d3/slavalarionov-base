import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWatchStrapDto, UpdateWatchStrapDto, StrapBaseImageDto } from './dto/watch-strap.dto';

@Injectable()
export class WatchStrapsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const straps = await this.prisma.watchStrap.findMany({
      include: {
        base_images: {
          include: {
            color: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    // Преобразуем JSON string обратно в объекты
    return straps.map((strap) => ({
      ...strap,
      strap_params: JSON.parse(strap.strap_params),
    }));
  }

  async findOne(id: number) {
    const strap = await this.prisma.watchStrap.findUnique({
      where: { id },
      include: {
        base_images: {
          include: {
            color: true,
          },
        },
      },
    });

    if (!strap) return null;

    return {
      ...strap,
      strap_params: JSON.parse(strap.strap_params),
    };
  }

  async create(data: CreateWatchStrapDto) {
    return this.prisma.watchStrap.create({
      data: {
        strap_name: data.strap_name,
        strap_title: data.strap_title,
        strap_description: data.strap_description,
        strap_short_description: data.strap_short_description,
        price: data.price,
        preview_image: data.preview_image,
        ultra_preview_image: data.ultra_preview_image,
        has_buckle_butterfly: data.has_buckle_butterfly || false,
        buckle_butterfly_price: data.buckle_butterfly_price ?? 0,
        buckle_butterfly_image: data.buckle_butterfly_image,
        strap_params: JSON.stringify(data.strap_params),
      },
    }).then((strap) => ({
      ...strap,
      strap_params: JSON.parse(strap.strap_params),
    }));
  }

  async update(id: number, data: UpdateWatchStrapDto) {
    return this.prisma.watchStrap.update({
      where: { id },
      data: {
        strap_name: data.strap_name,
        strap_title: data.strap_title,
        strap_description: data.strap_description,
        strap_short_description: data.strap_short_description,
        price: data.price,
        preview_image: data.preview_image,
        ultra_preview_image: data.ultra_preview_image,
        has_buckle_butterfly: data.has_buckle_butterfly,
        buckle_butterfly_price: data.buckle_butterfly_price ?? undefined,
        buckle_butterfly_image: data.buckle_butterfly_image,
        strap_params: data.strap_params ? JSON.stringify(data.strap_params) : undefined,
      },
    }).then((strap) => ({
      ...strap,
      strap_params: JSON.parse(strap.strap_params),
    }));
  }

  async delete(id: number) {
    return this.prisma.watchStrap.delete({
      where: { id },
    });
  }

  async backup() {
    const straps = await this.findAll();
    return {
      timestamp: new Date().toISOString(),
      data: straps,
    };
  }

  async restoreFromBackup(backupData: any[]) {
    // Очищаем все существующие ремешки и связанные данные
    await this.prisma.watchModelStrap.deleteMany();
    await this.prisma.watchStrap.deleteMany();

    // Создаем ремешки из бэкапа с сохранением ID
    for (const strapData of backupData) {
      await this.prisma.watchStrap.create({
        data: {
          id: strapData.id, // Сохраняем оригинальный ID
          strap_name: strapData.strap_name,
          strap_title: strapData.strap_title,
          strap_description: strapData.strap_description,
          strap_short_description: strapData.strap_short_description,
          price: strapData.price,
          preview_image: strapData.preview_image,
          ultra_preview_image: strapData.ultra_preview_image,
          has_buckle_butterfly: strapData.has_buckle_butterfly,
          buckle_butterfly_price: strapData.buckle_butterfly_price ?? 0,
          buckle_butterfly_image: strapData.buckle_butterfly_image,
          strap_params: JSON.stringify(strapData.strap_params),
        },
      });
    }

    return { success: true, restoredCount: backupData.length };
  }

  async addBaseImage(strapId: number, imageDto: StrapBaseImageDto) {
    return this.prisma.strapBaseImage.create({
      data: {
        watchStrapId: strapId,
        colorId: imageDto.colorId,
        view1Image: imageDto.view1Image || null,
        view2Image: imageDto.view2Image || null,
        view3Image: imageDto.view3Image || null,
      },
      include: {
        color: true,
      },
    });
  }

  async updateBaseImage(imageId: number, imageDto: StrapBaseImageDto) {
    return this.prisma.strapBaseImage.update({
      where: { id: imageId },
      data: {
        colorId: imageDto.colorId,
        view1Image: imageDto.view1Image || null,
        view2Image: imageDto.view2Image || null,
        view3Image: imageDto.view3Image || null,
      },
      include: {
        color: true,
      },
    });
  }

  async deleteBaseImage(imageId: number) {
    return this.prisma.strapBaseImage.delete({
      where: { id: imageId },
    });
  }
}


