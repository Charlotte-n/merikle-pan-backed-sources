import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class FilterGloablFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse();
    const statusCode = exception.getStatus();

    const res = exception.getResponse() as { message: string[] };

    response.status(statusCode).json({
      code: statusCode,
      message: res?.message?.join ? res?.message?.join(',') : exception.message,
      error: 'Bad Request',
    });
  }
}
