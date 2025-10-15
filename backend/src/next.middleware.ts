import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import next from 'next';

@Injectable()
export class NextMiddleware implements NestMiddleware {
  private nextApp = next({ dev: process.env.NODE_ENV !== 'production', dir: require('path').resolve(__dirname, '../../../frontend') });
  private handle = this.nextApp.getRequestHandler();
  private prepared = false;

  async use(req: Request, res: Response, nextFn: () => void) {
    if (!this.prepared) {
      await this.nextApp.prepare();
      this.prepared = true;
    }
    // Skip Next.js for API routes and CMS routes
    if (req.url && (req.url.startsWith('/api') || req.url.startsWith('/cms'))) {
      return nextFn();
    }
    this.handle(req, res);
  }
}