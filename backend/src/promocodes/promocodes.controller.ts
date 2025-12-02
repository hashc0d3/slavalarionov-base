import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PromocodesService } from './promocodes.service';
import { CreatePromoCodeDto } from './dto/create-promocode.dto';
import { UpdatePromoCodeDto } from './dto/update-promocode.dto';
import { CheckPromoCodeDto } from './dto/check-promocode.dto';

@Controller('api/promocodes')
export class PromocodesController {
  constructor(private readonly promocodesService: PromocodesService) {}

  @Post()
  create(@Body() createPromoCodeDto: CreatePromoCodeDto) {
    return this.promocodesService.create(createPromoCodeDto);
  }

  @Get()
  findAll() {
    return this.promocodesService.findAll();
  }

  // Специфичные роуты должны быть ПЕРЕД параметрическими
  @Post('check')
  checkPromo(@Body() checkPromoCodeDto: CheckPromoCodeDto) {
    return this.promocodesService.checkPromoCode(checkPromoCodeDto);
  }

  @Get('backup')
  backup() {
    return this.promocodesService.backup();
  }

  @Post('restore')
  restore(@Body() body: { data: any[] }) {
    return this.promocodesService.restoreFromBackup(body.data);
  }

  // Параметрические роуты должны быть ПОСЛЕ специфичных
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.promocodesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePromoCodeDto: UpdatePromoCodeDto,
  ) {
    return this.promocodesService.update(id, updatePromoCodeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.promocodesService.remove(id);
  }
}
