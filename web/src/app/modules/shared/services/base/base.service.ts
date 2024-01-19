import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {ErrorService} from '@shared-lib/services/error/error.service';
import {firstValueFrom} from 'rxjs';

interface Headers {
  headers: HttpHeaders;
}

export const header: Headers = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'X-Requested-By': 'myvoyagewebui',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class WebBaseService implements BaseService {
  httpHeader = header;

  constructor(
    private httpClient: HttpClient,
    private errorService: ErrorService
  ) {}

  async get(url: string): Promise<any> {
    try {
      return firstValueFrom(this.httpClient.get(url, this.httpHeader));
    } catch (error) {
      this.errorService.setDisplayError(true);
      return null;
    }
  }

  async post(url: string, request: any): Promise<any> {
    try {
      return firstValueFrom(
        this.httpClient.post(url, request, this.httpHeader)
      );
    } catch (error) {
      this.errorService.setDisplayError(true);
      return null;
    }
  }

  async put(url: string, request: any): Promise<any> {
    try {
      return firstValueFrom(this.httpClient.put(url, request, this.httpHeader));
    } catch (error) {
      this.errorService.setDisplayError(true);
      return null;
    }
  }
}
