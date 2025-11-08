import { Controller, Post, Body } from '@nestjs/common';
import { RetailCrmService } from './retailcrm.service';
import { CreateRetailCrmOrderDto } from './dto/create-retailcrm-order.dto';

@Controller('api/retailcrm')
export class RetailCrmController {
  constructor(private readonly retailCrmService: RetailCrmService) {}

  @Post('create-order')
  async createOrder(@Body() createOrderDto: CreateRetailCrmOrderDto) {
    return this.retailCrmService.createOrder(createOrderDto);
  }
}

