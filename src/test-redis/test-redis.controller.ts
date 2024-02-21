import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TestRedisService } from './test-redis.service';
import { CreateTestRediDto } from './dto/create-test-redi.dto';
import { UpdateTestRediDto } from './dto/update-test-redi.dto';
@Controller('test-redis')
export class TestRedisController {
  constructor(private readonly testRedisService: TestRedisService) {}

  @Post()
  create(@Body() createTestRediDto: CreateTestRediDto) {
    return this.testRedisService.create(createTestRediDto);
  }
  @Get()
  findAll() {
    return this.testRedisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testRedisService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTestRediDto: UpdateTestRediDto,
  ) {
    return this.testRedisService.update(+id, updateTestRediDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testRedisService.remove(+id);
  }
}
