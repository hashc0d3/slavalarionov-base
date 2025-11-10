import { All, Body, Controller, HttpCode, HttpStatus, Post, Req, Res, BadRequestException } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { Request, Response } from 'express';

@Controller('api/delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post('cdek/cities')
  @HttpCode(HttpStatus.OK)
  async getCdekCities(@Body('query') query: string) {
    return this.deliveryService.searchCdekCities(query);
  }

  @Post('cdek/pvz')
  @HttpCode(HttpStatus.OK)
  async getCdekPvz(@Body('cityCode') cityCode: number) {
    return this.deliveryService.getCdekPvzList(cityCode);
  }

  @Post('cdek/calc')
  @HttpCode(HttpStatus.OK)
  async calculateCdek(@Body('cityCode') cityCode: number) {
    return this.deliveryService.calculateCdekTariffs(cityCode);
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
}

