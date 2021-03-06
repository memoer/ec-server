import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import exception from '../exception';

@Injectable()
export class PaginationOutputInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const gqlContext = GqlExecutionContext.create(context);
    const { pageNumber, take } = gqlContext.getArgs().input;
    return next.handle().pipe(
      map((data) => {
        if (data.length !== 2) {
          throw exception({
            type: 'InternalServerErrorException',
            loc: 'PaginationOutputInterceptor.map',
            msg: 'data type must be [object, number]',
          });
        } else if (typeof data[0] !== 'object') {
          throw exception({
            type: 'InternalServerErrorException',
            loc: 'PaginationOutputInterceptor.map',
            msg: 'data[0] type must be object',
          });
        } else if (typeof data[1] !== 'number') {
          throw exception({
            type: 'InternalServerErrorException',
            loc: 'PaginationOutputInterceptor.map',
            msg: 'data[1] type must be number',
          });
        }
        const totalPage = Math.ceil(data[1] / take);
        return {
          data: data[0],
          totalPage,
          curPage: pageNumber,
          hasNextPage: totalPage !== pageNumber,
        };
      }),
    );
  }
}
