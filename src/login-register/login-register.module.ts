import { Module } from '@nestjs/common';
import { LoginRegisterService } from './login-register.service';
import { LoginRegisterController } from './login-register.controller';

@Module({
  controllers: [LoginRegisterController],
  providers: [LoginRegisterService],
})
export class LoginRegisterModule {}
