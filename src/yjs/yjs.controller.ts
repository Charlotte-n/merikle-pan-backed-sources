import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { YjsService } from './yjs.service';
import { CreateYjDto } from './dto/create-yj.dto';
import { UpdateYjDto } from './dto/update-yj.dto';

@Controller('yjs')
export class YjsController {
  constructor(private readonly yjsService: YjsService) {}

  @Post()
  create(@Body() createYjDto: CreateYjDto) {
    return this.yjsService.create(createYjDto);
  }

  @Get()
  findAll() {
    return this.yjsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.yjsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateYjDto: UpdateYjDto) {
    return this.yjsService.update(+id, updateYjDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.yjsService.remove(+id);
  }
}
