import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { sep, join } from 'path';
import type { Express } from 'express';

type StrapColorGroup = 'leather' | 'stitching' | 'edge' | 'buckle' | 'adapter' | 'strap' | 'frame' | 'common';

const allowedGroups: StrapColorGroup[] = ['leather', 'stitching', 'edge', 'buckle', 'adapter', 'strap', 'frame', 'common'];

const sanitizeSegment = (value: string, fallback: StrapColorGroup): StrapColorGroup => {
  if (!value) return fallback;
  const normalized = value.toLowerCase().trim() as StrapColorGroup;
  if (allowedGroups.includes(normalized)) {
    return normalized;
  }
  return fallback;
};

@Controller('api/uploads')
export class UploadsController {
  @Post('strap-color')
  @UseInterceptors(FileInterceptor('file'))
  async uploadStrapColorImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('group') group: string,
    @Body('view') view: string,
  ) {
    if (!file) {
      throw new BadRequestException('Файл не передан');
    }

    const normalizedGroup = sanitizeSegment(group, 'common');
    const normalizedView = view && view.toLowerCase().trim() ? view.toLowerCase().trim() : 'general';

    const relativePath = join(
      'uploads',
      'strap-colors',
      normalizedGroup,
      normalizedView,
      file.filename,
    ).split(sep).join('/');

    return {
      success: true,
      url: `/${relativePath}`,
    };
  }
}


