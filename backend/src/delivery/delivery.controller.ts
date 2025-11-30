import { All, Body, Controller, HttpCode, HttpStatus, Post, Req, Res, BadRequestException, Logger } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { Request, Response } from 'express';

@Controller('api/delivery')
export class DeliveryController {
  private readonly logger = new Logger(DeliveryController.name);

  constructor(private readonly deliveryService: DeliveryService) {}

  @Post('cdek/cities')
  @HttpCode(HttpStatus.OK)
  async getCdekCities(@Body('query') query: string) {
    this.logger.log(`[CDEK Cities] Request received: query="${query}"`);
    try {
      const result = await this.deliveryService.searchCdekCities(query);
      this.logger.log(`[CDEK Cities] Success: found ${result.length} cities`);
      return result;
    } catch (error: any) {
      this.logger.error(`[CDEK Cities] Failed: query="${query}"`, {
        error: error?.message,
        stack: error?.stack,
        status: error?.status,
      });
      throw error;
    }
  }

  @Post('cdek/pvz')
  @HttpCode(HttpStatus.OK)
  async getCdekPvz(@Body('cityCode') cityCode: number) {
    this.logger.log(`[CDEK PVZ] Request received: cityCode=${cityCode}`);
    try {
      const result = await this.deliveryService.getCdekPvzList(cityCode);
      this.logger.log(`[CDEK PVZ] Success: found ${result.length} points`);
      return result;
    } catch (error: any) {
      this.logger.error(`[CDEK PVZ] Failed: cityCode=${cityCode}`, {
        error: error?.message,
        stack: error?.stack,
        status: error?.status,
      });
      throw error;
    }
  }

  @Post('cdek/calc')
  @HttpCode(HttpStatus.OK)
  async calculateCdek(@Body('cityCode') cityCode: number) {
    this.logger.log(`[CDEK Calc] Request received: cityCode=${cityCode}`);
    try {
      const result = await this.deliveryService.calculateCdekTariffs(cityCode);
      this.logger.log(`[CDEK Calc] Success: found ${result.length} tariffs`);
      return result;
    } catch (error: any) {
      this.logger.error(`[CDEK Calc] Failed: cityCode=${cityCode}`, {
        error: error?.message,
        stack: error?.stack,
        status: error?.status,
      });
      throw error;
    }
  }

  @All('cdek/widget')
  async proxyCdekWidget(@Req() req: Request, @Res() res: Response) {
    const action = (req.query?.action || (req.body && (req.body as any).action)) as string | undefined;
    if (!action) {
      throw new BadRequestException('Action is required');
    }

    try {
      const result = await this.deliveryService.proxyCdekWidget(action, req.method, req.query, req.body);
      res.status(HttpStatus.OK).json(result);
    } catch (error: any) {
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      res.status(status).json({ message: error?.message || 'Failed to proxy CDEK widget request' });
    }
  }

  @Post('address/streets')
  @HttpCode(HttpStatus.OK)
  async searchStreets(@Body('query') query: string, @Body('cityName') cityName: string) {
    return this.deliveryService.searchStreets(query, cityName);
  }

  @Post('address/buildings')
  @HttpCode(HttpStatus.OK)
  async searchBuildings(@Body('streetFiasId') streetFiasId: string, @Body('query') query: string) {
    return this.deliveryService.searchBuildings(streetFiasId, query);
  }

  @Post('address/cities')
  @HttpCode(HttpStatus.OK)
  async searchCities(@Body('query') query: string) {
    return this.deliveryService.searchCities(query);
  }

  // Endpoint для виджета CDEK (обрабатывает запросы к /api/delivery/cdek?action=...)
  // Должен быть в конце, чтобы не конфликтовать с другими маршрутами
  @All('cdek')
  async proxyCdekWidgetDirect(@Req() req: Request, @Res() res: Response) {
    // Проверяем, что это запрос от виджета (есть параметр action)
    const action = (req.query?.action || (req.body && (req.body as any).action)) as string | undefined;
    
    // Если нет action, значит это не запрос от виджета, пропускаем дальше
    // (но в NestJS это не сработает, поэтому просто проверяем наличие action)
    if (!action) {
      throw new BadRequestException('Action is required');
    }

    this.logger.log(`[CDEK Widget] Request received: action="${action}"`);
    try {
      const result = await this.deliveryService.proxyCdekWidget(action, req.method, req.query, req.body);
      res.status(HttpStatus.OK).json(result);
    } catch (error: any) {
      this.logger.error(`[CDEK Widget] Failed: action="${action}"`, {
        error: error?.message,
        stack: error?.stack,
        status: error?.status,
      });
      const status = error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      res.status(status).json({ message: error?.message || 'Failed to proxy CDEK widget request' });
    }
  }
}

