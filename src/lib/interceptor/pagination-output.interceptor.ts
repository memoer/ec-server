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
    const { pageNumber, take } = gqlContext.getArgs();
    return next.handle().pipe(
      map((data) => ({
        data: data[0],
        totalCount: data[1],
        curPage: pageNumber,
        hasNextPage: Math.ceil(data[1] / take) === pageNumber,
      })),
    );
  }
}
