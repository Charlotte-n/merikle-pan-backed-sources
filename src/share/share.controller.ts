import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShareService } from './share.service';
import { CreateShareDto } from './dto/create-share.dto';
import { UpdateShareDto } from './dto/update-share.dto';

@Controller('share')
export class ShareController {
  constructor(private readonly shareService: ShareService) {}

  @Post()
  create(@Body() createShareDto: CreateShareDto) {
    return this.shareService.create(createShareDto);
  }

  @Get()
  findAll() {
    return this.shareService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shareService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShareDto: UpdateShareDto) {
    return this.shareService.update(+id, updateShareDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shareService.remove(+id);
  }
}
