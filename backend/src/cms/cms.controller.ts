import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { CmsService } from './cms.service';

@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get('watch-models')
  async getWatchModels() {
    return this.cmsService.getWatchModels();
  }

  @Get('watch-straps')
  async getWatchStraps() {
    return this.cmsService.getWatchStraps();
  }

  @Get('strap-params/:strapId')
  async getStrapParams(@Param('strapId') strapId: string) {
    return this.cmsService.getStrapParams(strapId);
  }

  @Get('additional-options')
  async getAdditionalOptions() {
    return this.cmsService.getAdditionalOptions();
  }

  @Post('validate-promo')
  async validatePromoCode(@Body('code') code: string) {
    return this.cmsService.validatePromoCode(code);
  }

  @Post('increment-promo-usage')
  async incrementPromoUsage(@Body('code') code: string) {
    await this.cmsService.incrementPromoUsage(code);
    return { success: true };
  }
}

