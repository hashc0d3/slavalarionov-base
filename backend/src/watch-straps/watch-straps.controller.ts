import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { WatchStrapsService } from './watch-straps.service';
import { CreateWatchStrapDto, UpdateWatchStrapDto, StrapBaseImageDto } from './dto/watch-strap.dto';

@Controller('api/watch-straps')
export class WatchStrapsController {
  constructor(private readonly watchStrapsService: WatchStrapsService) {}

  @Get()
  async findAll() {
    return this.watchStrapsService.findAll();
  }

  @Get('backup')
  async backup() {
    return this.watchStrapsService.backup();
  }

  @Post('restore')
  async restore(@Body() body: { data: any[] }) {
    return this.watchStrapsService.restoreFromBackup(body.data);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.watchStrapsService.findOne(id);
  }

  @Post()
  async create(@Body() createDto: CreateWatchStrapDto) {
    return this.watchStrapsService.create(createDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateWatchStrapDto,
  ) {
    return this.watchStrapsService.update(id, updateDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.watchStrapsService.delete(id);
  }

  @Post(':id/base-images')
  async addBaseImage(
    @Param('id', ParseIntPipe) strapId: number,
    @Body() imageDto: StrapBaseImageDto,
  ) {
    return this.watchStrapsService.addBaseImage(strapId, imageDto);
  }

  @Put(':strapId/base-images/:imageId')
  async updateBaseImage(
    @Param('strapId', ParseIntPipe) strapId: number,
    @Param('imageId', ParseIntPipe) imageId: number,
    @Body() imageDto: StrapBaseImageDto,
  ) {
    return this.watchStrapsService.updateBaseImage(imageId, imageDto);
  }

  @Delete(':strapId/base-images/:imageId')
  async deleteBaseImage(
    @Param('strapId', ParseIntPipe) strapId: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    return this.watchStrapsService.deleteBaseImage(imageId);
  }
}


