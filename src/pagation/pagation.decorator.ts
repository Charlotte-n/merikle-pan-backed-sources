import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Pagation = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const page = parseInt(request.query.page) || 1;
    const pageSize = parseInt(request.query.pageSize) || 10;
    return {
      page,
      pageSize,
    };
  },
);
