import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { FilterGloablFilter } from './filter-gloabl.filter';
import { ResponseInterfator } from './response-interfator.interface';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WsAdapter } from '@nestjs/platform-ws';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const homeDir = require('os').homedir();
  // 定义证书和密钥文件的路径
  const keyPath = '/opt/1panel/server.key';
  const certPath = '/opt/1panel/server.cert';
  // 读取密钥文件
  const key = fs.readFileSync(keyPath);
  const cert = fs.readFileSync(certPath);
  const httpsOptions = {
    key,
    cert,
  };
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions,
  });
  app.enableCors({
    origin: true,
    methods: 'GET,PUT,POST,PATCH,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    exposedHeaders: 'Content-Range,X-Content-Range',
    credentials: true,
    maxAge: 3600,
  });
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);
  //异常过滤器
  app.useGlobalFilters(new FilterGloablFilter());
  //全局开启校验
  app.useGlobalPipes(new ValidationPipe());
  //开启websocket

  app.useWebSocketAdapter(new WsAdapter(app));

  //全局拦截器
  app.useGlobalInterceptors(new ResponseInterfator());
  const configServices = app.get(ConfigService);
  const port = configServices.get('PORT') || 3000;
  await app.listen(3000);
}
bootstrap();
