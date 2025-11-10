import { Controller, Get } from '@nestjs/common';
import { ConfiguratorService } from './configurator.service';

@Controller('api/configurator')
export class ConfiguratorController {
  constructor(private readonly configuratorService: ConfiguratorService) {}

  @Get('settings')
  async getSettings() {
    return this.configuratorService.getSettings();
  }
}

