import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ColorsService, CreateColorDto, UpdateColorDto } from './colors.service';

@Controller('api/colors')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Get()
  async findAll() {
    return this.colorsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.colorsService.findOne(+id);
  }

  @Post()
  async create(@Body() createColorDto: CreateColorDto) {
    return this.colorsService.create(createColorDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateColorDto: UpdateColorDto) {
    return this.colorsService.update(+id, updateColorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.colorsService.remove(+id);
  }
}

