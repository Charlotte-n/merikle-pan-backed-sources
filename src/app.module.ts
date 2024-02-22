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
            expiresIn: '30m', // 默认 30 分钟
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: LoginGuardGuard,
    },
  ],
})
export class AppModule {}
