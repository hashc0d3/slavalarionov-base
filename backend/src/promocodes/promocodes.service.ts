import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePromoCodeDto } from './dto/create-promocode.dto';
import { UpdatePromoCodeDto } from './dto/update-promocode.dto';
import { CheckPromoCodeDto } from './dto/check-promocode.dto';

@Injectable()
export class PromocodesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPromoCodeDto: CreatePromoCodeDto) {
    if (!createPromoCodeDto.discountPercent && !createPromoCodeDto.discountAmount) {
      throw new BadRequestException(
        'Необходимо указать либо процент скидки, либо сумму скидки',
      );
    }

    if (createPromoCodeDto.discountPercent && createPromoCodeDto.discountAmount) {
      throw new BadRequestException(
        'Нельзя указать одновременно процент и сумму скидки',
      );
    }

    const existing = await this.prisma.promoCode.findUnique({
      where: { code: createPromoCodeDto.code },
    });

    if (existing) {
      throw new BadRequestException('Промокод с таким кодом уже существует');
    }

    return this.prisma.promoCode.create({
      data: {
        code: createPromoCodeDto.code,
        discountPercent: createPromoCodeDto.discountPercent ?? null,
        discountAmount: createPromoCodeDto.discountAmount ?? null,
        activationsLeft: createPromoCodeDto.activationsLeft,
      },
    });
  }

  async findAll() {
    return this.prisma.promoCode.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const promoCode = await this.prisma.promoCode.findUnique({
      where: { id },
    });

    if (!promoCode) {
      throw new NotFoundException(`Промокод с ID ${id} не найден`);
    }

    return promoCode;
  }

  async update(id: number, updatePromoCodeDto: UpdatePromoCodeDto) {
    await this.findOne(id);

    if (updatePromoCodeDto.code) {
      const existing = await this.prisma.promoCode.findFirst({
        where: {
          code: updatePromoCodeDto.code,
          id: { not: id },
        },
      });

      if (existing) {
        throw new BadRequestException('Промокод с таким кодом уже существует');
      }
    }

    const current = await this.prisma.promoCode.findUnique({ where: { id } });
    const newPercent =
      updatePromoCodeDto.discountPercent !== undefined
        ? updatePromoCodeDto.discountPercent
        : current?.discountPercent;
    const newAmount =
      updatePromoCodeDto.discountAmount !== undefined
        ? updatePromoCodeDto.discountAmount
        : current?.discountAmount;

    if (newPercent && newAmount) {
      throw new BadRequestException(
        'Нельзя указать одновременно процент и сумму скидки',
      );
    }

    return this.prisma.promoCode.update({
      where: { id },
      data: {
        code: updatePromoCodeDto.code,
        discountPercent:
          updatePromoCodeDto.discountPercent !== undefined
            ? updatePromoCodeDto.discountPercent
            : current?.discountPercent,
        discountAmount:
          updatePromoCodeDto.discountAmount !== undefined
            ? updatePromoCodeDto.discountAmount
            : current?.discountAmount,
        activationsLeft:
          updatePromoCodeDto.activationsLeft !== undefined
            ? updatePromoCodeDto.activationsLeft
            : current?.activationsLeft,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.promoCode.delete({
      where: { id },
    });
  }

  async checkPromoCode(checkPromoCodeDto: CheckPromoCodeDto) {
    const promoCode = await this.prisma.promoCode.findUnique({
      where: { code: checkPromoCodeDto.code },
    });

    if (!promoCode) {
      return {
        promoFound: false,
        type: null,
        discountValue: 0,
        code: checkPromoCodeDto.code,
      };
    }

    if (promoCode.activationsLeft <= 0) {
      return {
        promoFound: false,
        type: null,
        discountValue: 0,
        code: checkPromoCodeDto.code,
        message: 'Промокод исчерпан',
      };
    }

    const type = promoCode.discountPercent ? 'percent' : 'ruble';
    const discountValue =
      promoCode.discountPercent ?? promoCode.discountAmount ?? 0;

    await this.prisma.promoCode.update({
      where: { id: promoCode.id },
      data: {
        activationsLeft: {
          decrement: 1,
        },
      },
    });

    return {
      promoFound: true,
      type,
      discountValue,
      code: promoCode.code,
    };
  }

  async backup() {
    const promoCodes = await this.prisma.promoCode.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return {
      timestamp: new Date().toISOString(),
      data: promoCodes,
    };
  }

  async restoreFromBackup(backupData: any[]) {
    await this.prisma.promoCode.deleteMany();

    for (const promoData of backupData) {
      await this.prisma.promoCode.create({
        data: {
          code: promoData.code,
          discountPercent: promoData.discountPercent ?? null,
          discountAmount: promoData.discountAmount ?? null,
          activationsLeft: promoData.activationsLeft ?? 0,
        },
      });
    }

    return { success: true, restoredCount: backupData.length };
  }
}
