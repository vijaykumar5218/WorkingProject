import {HttpClient} from '@angular/common/http';
import {Injectable, Injector} from '@angular/core';
import {AccessService} from '@shared-lib/services/access/access.service';
import {firstValueFrom, Observable, ReplaySubject} from 'rxjs';
import {TranslationPreferenceResponse} from './models/translationPreference.model';

interface RequestOpts {
  method: string;
  body: any;
  headers: Record<string, string>;
  withCredentials: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class VoyaGlobalCacheService {
  dataCache: Record<string, Promise<any>> = {};
  private translationPreferenceResponse = new ReplaySubject<
    TranslationPreferenceResponse
  >(1);
  constructor(public http: HttpClient, private injector: Injector) {}
  w = window;

  initVoyaGlobalCache(): void {
    if (!(window as any).fetchMethod) {
      (window as any).fetchMethod = async (
        url: string,
        opts: RequestOpts
      ): Promise<Response> => {
        const myWorkplaceDashboardEnabled =
          localStorage.getItem('myWorkplaceDashboardEnabled') === 'true';
        const pageName = this.getPageName();
        url = this.constructURL(url, myWorkplaceDashboardEnabled, pageName);
        const angularOpts = {
          headers: opts.headers,
          withCredentials: true,
        };
        if (this.dataCache[url]) {
          return Promise.resolve(
            new Response(JSON.stringify(await this.dataCache[url]))
          );
        }
        let promise;

        if (opts.method === 'GET') {
          promise = this.handleGetCall(url, opts);
        } else if (opts.method === 'POST') {
          this.setClientBrandPostBody(
            url,
            myWorkplaceDashboardEnabled,
            opts,
            pageName
          );

          if (url.includes('/setPref')) {
            promise = firstValueFrom(
              this.http.post(url, opts.body, {
                ...angularOpts,
                responseType: 'text',
              })
            );
            return new Response(await promise);
          }
          promise = firstValueFrom(this.http.post(url, opts.body, angularOpts));
        }

        this.dataCache[url] = promise;

        if (url.includes('/getPref')) {
          this.translationPreferenceResponse.next(await promise);
        }
        return new Response(JSON.stringify(await promise));
      };

      this.requireNav();
    }
  }

  getPageName() {
    return sessionStorage.getItem('isMyBenefitshub') === 'true'
      ? 'myBenefitshub'
      : 'dashboard';
  }

  setClientBrandPostBody(
    url: string,
    myWorkplaceDashboardEnabled: boolean,
    opts: RequestOpts,
    pageName: string
  ) {
    if (url.includes('/clientbrand') && myWorkplaceDashboardEnabled) {
      let body = JSON.parse(opts.body);
      body = {
        ...body,
        pageName: pageName,
      };
      opts.body = JSON.stringify(body);
    }
  }

  private requireNav(): void {
    require('voya-global-nav');
  }

  private constructURL(
    url: string,
    myWorkplaceDashboardEnabled: boolean,
    pageName: string
  ): string {
    if (
      url.includes('/dashboard/primaryNavLinks') ||
      url.includes('/dashboard/responsivenav')
    ) {
      const sessionID = localStorage.getItem('sessionId');
      url = `${url}?sessionID=${sessionID}&pageName=${pageName}`;
    } else if (url.includes('/clientBrand') && myWorkplaceDashboardEnabled) {
      url = url.replace('public/rsglobal/clientBrand', 'postlogin/clientbrand');
    } else if (url.includes('/dashboard/retirement/vds/footer')) {
      url = `${url}?pageName=${pageName}`;
    }
    return url;
  }

  private handleGetCall(
    url: string,
    opts: {
      method: string;
      body?: any;
      headers: Record<string, string>;
      withCredentials: boolean;
    }
  ) {
    let promise;
    const accessService = this.injector.get<AccessService>(AccessService);
    if (url.includes('/myvoyageenabled')) {
      promise = accessService.checkMyvoyageAccess();
    } else {
      promise = firstValueFrom(
        this.http.get(url, {
          headers: opts.headers,
          withCredentials: true,
        })
      );
    }
    return promise;
  }

  getTranslationPreference(): Observable<TranslationPreferenceResponse> {
    return this.translationPreferenceResponse;
  }
}
