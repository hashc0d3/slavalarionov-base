import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { WatchModelsService } from './watch-models.service';
import { CreateWatchModelDto, UpdateWatchModelDto } from './dto/watch-model.dto';

@Controller('api/watch-models')
export class WatchModelsController {
  constructor(private readonly watchModelsService: WatchModelsService) {}

  @Get()
  async findAll() {
    return this.watchModelsService.findAll();
  }

  @Get('backup')
  async backup() {
    return this.watchModelsService.backup();
  }

  @Post('restore')
  async restore(@Body() body: { data: any[] }) {
    return this.watchModelsService.restoreFromBackup(body.data);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.watchModelsService.findOne(id);
  }

  @Post()
  async create(@Body() createDto: CreateWatchModelDto) {
    return this.watchModelsService.create(createDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateWatchModelDto,
  ) {
    return this.watchModelsService.update(id, updateDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.watchModelsService.delete(id);
  }
}

