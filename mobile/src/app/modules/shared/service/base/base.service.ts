import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HTTP} from '@ionic-native/http/ngx';
import {LoadingService} from '../loading-service/loading.service';
import {Location} from '@angular/common';
import {AuthenticationService} from '../authentication/authentication.service';
import {HttpParams} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class MobileBaseService {
  private webServiceError: Subject<void> = new Subject();
  private isBusy = false;

  constructor(
    private http: HTTP,
    private router: Router,
    private loadingService: LoadingService,
    private location: Location,
    private authService: AuthenticationService
  ) {
    this.http.setDataSerializer('json');
  }

  errorEvents(): Observable<void> {
    return this.webServiceError.asObservable();
  }

  setDataSerializer(
    serializer: 'urlencoded' | 'json' | 'utf8' | 'multipart' | 'raw'
  ) {
    this.http.setDataSerializer(serializer);
  }

  awaitIsBusy(): Promise<void> {
    const poll = async resolve => {
      if (!this.isBusy) {
        resolve();
      } else {
        setTimeout(() => {
          poll(resolve);
        }, 50);
      }
    };
    return new Promise(poll);
  }

  async buildHeaders(): Promise<{Authorization; 'X-Requested-By'}> {
    if (this.isBusy) {
      await this.awaitIsBusy();
    }
    this.isBusy = true;
    let token = '';
    try {
      const isAuth = await this.authService.isAuthenticated();
      if (isAuth) {
        token = await this.authService.getAccessToken();
      } else {
        this.authService.logout();
      }
    } finally {
      this.isBusy = false;
    }

    return {
      Authorization: 'Bearer ' + token,
      'X-Requested-By': 'myvoyageui',
    };
  }

  async post(
    url: string,
    request: any,
    httpHeader?: Record<string, string>
  ): Promise<any> {
    let headers;
    if (httpHeader) {
      headers = httpHeader;
    } else {
      headers = await this.buildHeaders();
    }

    try {
      const result = await this.http.post(url, request, headers);
      if (result.data) {
        return JSON.parse(result.data);
      } else {
        return null;
      }
    } catch (ex) {
      this.webServiceError.next();
      console.log(ex);
      return null;
    }
  }

  async postWithoutResponse(url: string, request: any): Promise<any> {
    const headers = await this.buildHeaders();
    this.http.post(url, request, headers);
  }

  async put(url: string, request: any): Promise<any> {
    const headers = await this.buildHeaders();
    try {
      const result = await this.http.put(url, request, headers);
      if (result.data) {
        return JSON.parse(result.data);
      } else {
        return null;
      }
    } catch (ex) {
      console.log(ex);
      this.webServiceError.next();
      return null;
    }
  }

  async get(url: string, useAuth = true): Promise<any> {
    let headers = {};
    if (useAuth) {
      headers = await this.buildHeaders();
    }
    try {
      const result = await this.http.get(url, {}, headers);
      if (result.data) {
        return JSON.parse(result.data);
      } else {
        console.log(result);
        return null;
      }
    } catch (ex) {
      console.log(ex);
      this.webServiceError.next();
      return null;
    }
  }

  async getWithoutResponse(url: string): Promise<any> {
    const headers = await this.buildHeaders();
    return this.http.get(url, {}, headers);
  }

  clearCookies() {
    this.http.clearCookies();
  }

  getCookieString(domain: string) {
    return this.http.getCookieString(domain);
  }

  navigateByUrl(url: string): void {
    this.router.navigateByUrl(url);
  }

  navigateBack() {
    this.location.back();
  }

  startLoading(startLoading: boolean) {
    if (startLoading) {
      this.loadingService.startLoading();
    }
  }

  stopLoading(stopLoading: boolean) {
    if (stopLoading) {
      this.loadingService.stopLoading();
    }
  }

  async postUrlEncoded(
    url: string,
    request: any,
    httpHeader?: Record<string, string>
  ) {
    let headers;
    if (httpHeader) {
      headers = httpHeader;
    } else {
      headers = await this.buildHeaders();
    }
    headers['Content-Type'] = 'application/x-www-form-urlencoded';

    const params = new HttpParams({
      fromObject: request,
    });

    this.setDataSerializer('utf8');
    let returnVal = null;
    try {
      const result = await this.http.post(url, params.toString(), headers);
      returnVal = JSON.parse(result.data);
    } catch (ex) {
      console.log(ex);
    }
    this.setDataSerializer('json');
    return returnVal;
  }
}
