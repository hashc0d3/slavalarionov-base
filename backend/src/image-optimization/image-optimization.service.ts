import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as sharp from 'sharp';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { randomUUID } from 'crypto';

const UPLOADS_DIR = 'uploads';
const OPTIMIZED_SUBDIR = 'optimized';
const WEBP_QUALITY = 82;

@Injectable()
export class ImageOptimizationService {
  constructor(private readonly httpService: HttpService) {}

  /** Проверяет, является ли строка URL изображения (http/https). */
  isImageUrl(value: string | null | undefined): value is string {
    if (!value || typeof value !== 'string') return false;
    const trimmed = value.trim();
    return trimmed.startsWith('http://') || trimmed.startsWith('https://');
  }

  /**
   * Конвертирует буфер изображения в WebP и сохраняет в uploads/optimized/{subpath}/{name}.webp.
   * Возвращает относительный URL вида /uploads/optimized/...
   */
  async convertBufferToWebP(
    buffer: Buffer,
    subpath: string,
    filenameBase?: string,
  ): Promise<string> {
    const safeSubpath = this.sanitizePathSegment(subpath) || 'common';
    const dir = join(process.cwd(), UPLOADS_DIR, OPTIMIZED_SUBDIR, safeSubpath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    const base = (filenameBase || randomUUID()).replace(/[^a-zA-Z0-9\-_.]/g, '-');
    const filename = base.endsWith('.webp') ? base : `${base}.webp`;
    const filePath = join(dir, filename);

    await sharp(buffer)
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toFile(filePath);

    return `/${UPLOADS_DIR}/${OPTIMIZED_SUBDIR}/${safeSubpath}/${filename}`.replace(/\\/g, '/');
  }

  /**
   * Скачивает изображение по URL, конвертирует в WebP и сохраняет.
   * Возвращает относительный URL вида /uploads/optimized/...
   */
  async downloadAndConvertToWebP(
    imageUrl: string,
    subpath: string,
    filenameBase?: string,
  ): Promise<string> {
    const response = await firstValueFrom(
      this.httpService.get(imageUrl.trim(), {
        responseType: 'arraybuffer',
        timeout: 15000,
        maxContentLength: 10 * 1024 * 1024, // 10MB
        validateStatus: (status) => status === 200,
      }),
    );
    const buffer = Buffer.from(response.data);
    return this.convertBufferToWebP(
      buffer,
      subpath,
      filenameBase || `${Date.now()}-${randomUUID().slice(0, 8)}`,
    );
  }

  /**
   * Обрабатывает значение: если это URL — скачивает и конвертирует в WebP, иначе возвращает как есть.
   */
  async processImageUrl(
    value: string | null | undefined,
    subpath: string,
    filenameBase?: string,
  ): Promise<string | null> {
    if (!value || typeof value !== 'string') return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (this.isImageUrl(trimmed)) {
      try {
        return await this.downloadAndConvertToWebP(trimmed, subpath, filenameBase);
      } catch (err) {
        console.warn(`ImageOptimization: failed to download/convert ${trimmed}`, err);
        return trimmed; // fallback: сохраняем исходный URL
      }
    }
    return trimmed;
  }

  private sanitizePathSegment(segment: string): string {
    return segment
      .replace(/[^a-zA-Z0-9\-_/]/g, '-')
      .replace(/\/+/g, '/')
      .replace(/^\/+|\/+$/g, '')
      .slice(0, 200) || 'common';
  }
}
