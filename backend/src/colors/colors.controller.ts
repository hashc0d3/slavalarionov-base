import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, HttpException } from '@nestjs/common';
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
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    try {
      await this.colorsService.remove(+id);
      return { success: true, message: 'Color deleted successfully' };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete color',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

