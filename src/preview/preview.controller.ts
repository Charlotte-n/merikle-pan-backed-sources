import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { PreviewService } from './preview.service';
import { createReadStream } from 'fs';
import { join } from 'path';
import type { Response } from 'express';

@Controller('preview')
export class PreviewController {
  constructor(private readonly previewService: PreviewService) {}

  //获取文件流
  @Get(':filename')
  getFile(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: Response,
  ): StreamableFile {
    const file = createReadStream(join(process.cwd(), '/upload/' + filename));
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="doc.docx"',
    });
    return new StreamableFile(file);
  }
}
