import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
interface Response<T> {
  data: T;
}
@Injectable()
export class ResponseInterfator<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    console.log(context.getClass());
    return next.handle().pipe(
      map((value: any) => {
        return {
          data: value.data || '',
          code: value.code,
          message: value.message,
          status: 200,
        };
      }),
    );
  }
}
