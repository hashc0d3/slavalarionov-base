import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join, extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { randomUUID } from 'crypto';
import { UploadsController } from './uploads.controller';

type StrapColorGroup = 'leather' | 'stitching' | 'edge' | 'buckle' | 'adapter' | 'strap' | 'frame' | 'common';

const allowedGroups: StrapColorGroup[] = ['leather', 'stitching', 'edge', 'buckle', 'adapter', 'strap', 'frame', 'common'];

const sanitizeSegment = (value: string, fallback: StrapColorGroup): StrapColorGroup => {
  if (!value) return fallback;
  const normalized = value.toLowerCase().trim() as StrapColorGroup;
  if (allowedGroups.includes(normalized)) {
    return normalized;
  }
  // Для неразрешенных групп используем fallback, чтобы путь совпадал с контроллером
  return fallback;
};

const sanitizeString = (value: string, fallback: string): string => {
  if (!value) return fallback;
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\-_.]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^\-+|\-+$/g, '') || fallback;
};

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          const group = sanitizeSegment(req.body?.group, 'common');
          // Логика должна совпадать с контроллером
          const normalizedView = req.body?.view && req.body.view.toLowerCase().trim() 
            ? req.body.view.toLowerCase().trim() 
            : 'general';
          const uploadsRoot = join(process.cwd(), 'uploads', 'strap-colors', group, normalizedView);
          if (!existsSync(uploadsRoot)) {
            mkdirSync(uploadsRoot, { recursive: true });
          }
          cb(null, uploadsRoot);
        },
        filename: (req, file, cb) => {
          const color = sanitizeString(req.body?.colorTitle, 'color');
          const extension = extname(file.originalname || '').toLowerCase() || '.png';
          const filename = `${Date.now()}-${randomUUID()}-${color}${extension}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new Error('Only image uploads are allowed'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  ],
  controllers: [UploadsController],
})
export class UploadsModule {}


