import { Controller, Post, Body } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { CreateRetailCrmOrderDto } from '../retailcrm/dto/create-retailcrm-order.dto';

@Controller('api/telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post('send-message')
  async sendMessage(@Body() orderDto: CreateRetailCrmOrderDto) {
    return this.telegramService.sendOrderMessage(orderDto);
  }
}
