import {
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';

@Catch()
export class LogExceptionFilter implements ExceptionFilter {
  catch(exception: unknown) {
    const httpException =
      exception instanceof HttpException
        ? exception
        : new InternalServerErrorException(exception);
    throw httpException;
  }
}
