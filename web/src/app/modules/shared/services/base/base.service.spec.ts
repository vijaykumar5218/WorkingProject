import {TestBed, waitForAsync} from '@angular/core/testing';
import {WebBaseService} from './base.service';
import {ErrorService} from '@shared-lib/services/error/error.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {of} from 'rxjs';

describe('WebBaseService', () => {
  let service: WebBaseService;
  let errorServiceSpy;
  let httpClientSpy: any;
  const mockWebResponse = {
    headers: {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-By': 'myvoyagewebui',
      }),
    },
    requestData: {test: 'test'},
    url: 'http://test.com',
    data: {resp: '123'},
  };

  beforeEach(
    waitForAsync(() => {
      errorServiceSpy = jasmine.createSpyObj('errorServiceSpy', [
        'setDisplayError',
      ]);
      httpClientSpy = jasmine.createSpyObj('httpClientSpy', [
        'post',
        'get',
        'put',
      ]);

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          WebBaseService,
          {provide: ErrorService, useValue: errorServiceSpy},
          {provide: HttpClient, useValue: httpClientSpy},
        ],
      });
      service = TestBed.inject(WebBaseService);
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get()', () => {
    it('should get headers and then call get', async () => {
      httpClientSpy.get.and.returnValue(of(mockWebResponse.data));
      service.httpHeader = mockWebResponse.headers;
      const result = await service.get(mockWebResponse.url);
      expect(httpClientSpy.get).toHaveBeenCalledWith(
        mockWebResponse.url,
        mockWebResponse.headers
      );
      expect(result).toEqual(mockWebResponse.data);
    });
    it('should get headers and then call get and return null if exception', async () => {
      httpClientSpy.get.and.returnValue(of(null));
      const result = await service.get(mockWebResponse.url);
      expect(result).toEqual(null);
    });
  });

  describe('post()', () => {
    it('should get headers and then call post', async () => {
      httpClientSpy.post.and.returnValue(of(mockWebResponse.data));
      service.httpHeader = mockWebResponse.headers;
      const result = await service.post(
        mockWebResponse.url,
        mockWebResponse.requestData
      );
      expect(httpClientSpy.post).toHaveBeenCalledWith(
        mockWebResponse.url,
        mockWebResponse.requestData,
        mockWebResponse.headers
      );
      expect(result).toEqual(mockWebResponse.data);
    });
    it('should return null if exception', async () => {
      httpClientSpy.post.and.returnValue(of(null));
      const result = await service.post(
        mockWebResponse.url,
        mockWebResponse.requestData
      );
      expect(result).toEqual(null);
    });
  });

  describe('put()', () => {
    it('should get headers and then call put', async () => {
      httpClientSpy.put.and.returnValue(of(mockWebResponse.data));
      service.httpHeader = mockWebResponse.headers;
      const result = await service.put(
        mockWebResponse.url,
        mockWebResponse.requestData
      );
      expect(httpClientSpy.put).toHaveBeenCalledWith(
        mockWebResponse.url,
        mockWebResponse.requestData,
        mockWebResponse.headers
      );
      expect(result).toEqual(mockWebResponse.data);
    });
    it('should return null if exception', async () => {
      httpClientSpy.put.and.returnValue(of(null));
      const result = await service.put(
        mockWebResponse.url,
        mockWebResponse.requestData
      );
      expect(result).toEqual(null);
    });
  });
});
