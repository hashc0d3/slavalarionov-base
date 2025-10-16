import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import next from 'next';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class NextMiddleware implements NestMiddleware {
  private getFrontendPath(): string {
    // Пробуем разные варианты пути
    const paths = [
      path.join(process.cwd(), '..', 'frontend'),
      path.join(__dirname, '../../frontend'),
      path.join(process.cwd(), 'frontend'),
    ];
    
    for (const p of paths) {
      if (fs.existsSync(p)) {
        console.log('Frontend path found:', p);
        return p;
      }
    }
    
    throw new Error('Frontend directory not found');
  }
  
  private nextApp = next({
    dev: process.env.NODE_ENV !== 'production',
    dir: this.getFrontendPath(),
  });
  private handle = this.nextApp.getRequestHandler();
  private prepared = false;

  async use(req: Request, res: Response, nextFn: () => void) {
    try {
      if (!this.prepared) {
        console.log('Preparing Next.js app...');
        await this.nextApp.prepare();
        this.prepared = true;
        console.log('Next.js app prepared successfully');
      }
      if (req.url && req.url.startsWith('/api')) {
        return nextFn();
      }
      console.log('Handling request:', req.url);
      this.handle(req, res);
    } catch (error) {
      console.error('Error in NextMiddleware:', error);
      throw error;
    }
  }
}
