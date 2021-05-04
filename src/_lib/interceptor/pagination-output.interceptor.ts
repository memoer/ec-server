import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PaginationOutputInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const gqlContext = GqlExecutionContext.create(context);
    const { pageNumber, take } = gqlContext.getArgs().input;
    return next.handle().pipe(
      map((data) => {
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
