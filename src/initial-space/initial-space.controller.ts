import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InitialSpaceService } from './initial-space.service';
import { CreateInitialSpaceDto } from './dto/create-initial-space.dto';
import { UpdateInitialSpaceDto } from './dto/update-initial-space.dto';

@Controller('initial-space')
export class InitialSpaceController {
  constructor(private readonly initialSpaceService: InitialSpaceService) {}

  @Post()
  create(@Body() createInitialSpaceDto: CreateInitialSpaceDto) {
    return this.initialSpaceService.create(createInitialSpaceDto);
  }

  @Post('updateInitialSpace')
  async updateInitialSpace(@Body() body: any) {
    return this.initialSpaceService.updateInitialSpace(body);
  }
}
