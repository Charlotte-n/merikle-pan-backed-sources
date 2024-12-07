import { Controller, Post, Res, Body } from '@nestjs/common';
import { PreviewService } from './preview.service';
import type { Response } from 'express';
/* it is safe to import the library from the top level */
import { readFile, set_fs } from 'xlsx';

@Controller('preview')
export class PreviewController {
  constructor(private readonly previewService: PreviewService) {}

  //获取文件流
  @Post()
  async getFile(
    @Body() obj,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    set_fs(await import('fs')); //
    const file = readFile(obj.path);
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="doc.docx"',
    });
    return file;
  }
}
