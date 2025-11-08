import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { WatchStrapsService } from './watch-straps.service';
import { CreateWatchStrapDto, UpdateWatchStrapDto } from './dto/watch-strap.dto';

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
}


