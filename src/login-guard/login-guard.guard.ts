import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginGuardGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService;
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //白名单
    const whiteList = [
      '/lr/login',
      '/lr/register',
      '/lr/reset-password',
      '/lr/captcha',
      '/lr/verifyCaptcha',
      '/lr/register-code',
      '/lr/verifyCode',
      '/lr/:id',
      '/share/getShare',
      '/share/getShareList',
      '/commonFile/getFileInfo',
    ];
    //简单的检验了下token
    const request = context.switchToHttp().getRequest();
    const path = context.switchToHttp().getRequest().route.path;
    if (whiteList.includes(path)) {
      return true;
    }
    const authorization = request.header('Authorization') || '';
    const bearer = authorization.split(' ');
    if (!bearer || bearer.length < 2) {
      throw new UnauthorizedException('登录token错误');
    }
    const token = bearer[1];
    // 验证token
    try {
      const info: any = this.jwtService.verify(token);
      (request as any).user = info.userId;
    } catch (e) {
      throw new UnauthorizedException('失效了');
    }
    return true;
  }
}
