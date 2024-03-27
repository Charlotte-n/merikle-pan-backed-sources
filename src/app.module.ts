import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from '@libs/db';
import { RedisModule } from './../libs/redis/src/index';
import { UserModule } from './user/user.module';
import { LoginRegisterModule } from './login-register/login-register.module';
import { APP_GUARD } from '@nestjs/core';
import { EmailSendModule } from './email-send/email-send.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LoginGuardGuard } from './login-guard/login-guard.guard';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PagationService } from './pagation/pagation.service';
import { FileModule } from './file/file.module';
import { DirectoryModule } from './directory/directory.module';
import { ShareModule } from './share/share.module';
import { AdminModule } from './admin/admin.module';
import { PreviewModule } from './preview/preview.module';

@Module({
  imports: [
    //数据库模块，就可以导入模型了
    DbModule,
    RedisModule,
    UserModule,
    LoginRegisterModule,
    EmailSendModule,
    //配置.env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/.env',
    }),
    //配置JWT
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('jwt_secret'),
          signOptions: {
            expiresIn: '60m', // 默认 30 分钟
          },
        };
      },
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public/uploaded'),
      serveRoot: '/static',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'upload'),
      serveRoot: '/statics',
    }),

    FileModule,

    DirectoryModule,

    ShareModule,

    AdminModule,

    PreviewModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: LoginGuardGuard,
    },
    PagationService,
  ],
})
export class AppModule {}
