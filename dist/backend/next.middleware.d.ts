import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
export declare class NextMiddleware implements NestMiddleware {
    private getFrontendPath;
    private nextApp;
    private handle;
    private prepared;
    use(req: Request, res: Response, nextFn: () => void): Promise<void>;
}
