import {Injectable} from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';

import {Observable} from 'rxjs';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {MyVoyaService} from '../myvoya/myvoya.service';
import {mergeMap, take} from 'rxjs/operators';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(
    private myVoyaService: MyVoyaService,
    private utilityService: SharedUtilityService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.utilityService.isMyVoyaUrl(req.url)) {
      req = req.clone({
        withCredentials: true,
      });
      return this.myVoyaService
        .getLoadedSubject()
        .pipe(take(1))
        .pipe(
          mergeMap(() => {
            return next.handle(req);
          })
        );
    } else {
      return next.handle(req);
    }
  }
}
