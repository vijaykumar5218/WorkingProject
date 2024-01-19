import {HttpClient} from '@angular/common/http';
import {ErrorService} from '@shared-lib/services/error/error.service';
import {HTTP} from '@ionic-native/http/ngx';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {AuthenticationService} from '@mobile/app/modules/shared/service/authentication/authentication.service';
import {LoadingService} from '@mobile/app/modules/shared/service/loading-service/loading.service';
import {MobileBaseService} from '@mobile/app/modules/shared/service/base/base.service';
import {WebBaseService} from '@web/app/modules/shared/services/base/base.service';
import {Observable} from 'rxjs';

export abstract class BaseService {
  abstract errorEvents?: () => Observable<void>;
  abstract buildHeaders?: () => Promise<{Authorization}>;
  abstract get: (url: string, useAuth?: boolean) => Promise<any>;
  abstract getWithoutResponse?: (url: string) => Promise<any>;
  abstract getResWithStatusCode?: (url: string) => Promise<any>;
  abstract post: (
    url: string,
    request: any,
    headers?: Record<string, string>
  ) => Promise<any>;
  abstract postWithoutResponse?: (url: string, request: any) => Promise<any>;
  abstract put: (url: string, request: any) => Promise<any>;
  abstract clearCookies?: () => void;
  abstract getCookieString?: (domain: string) => string;
  abstract navigateByUrl?: (url: string) => void;
  abstract navigateBack?: () => void;
  abstract startLoading?: (startLoading: boolean) => void;
  abstract stopLoading?: (stopLoading: boolean) => void;
  abstract setDataSerializer?: (
    serializer: 'urlencoded' | 'json' | 'utf8' | 'multipart' | 'raw'
  ) => void;
  abstract postUrlEncoded?: (
    url: string,
    request: any,
    headers?: Record<string, string>
  ) => Promise<any>;
}

export function mobileBaseServiceFactory(
  http: HTTP,
  router: Router,
  loadingService: LoadingService,
  location: Location,
  authService: AuthenticationService
) {
  return new MobileBaseService(
    http,
    router,
    loadingService,
    location,
    authService
  );
}

export function webBaseServiceFactory(
  httpClient: HttpClient,
  errorService: ErrorService
) {
  return new WebBaseService(httpClient, errorService);
}
