import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, timeout } from 'rxjs';

export class TimeOutInterceptor implements NestInterceptor {
  intercept(
    _: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(timeout(5000));
  }
}
