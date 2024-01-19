import {TestBed, waitForAsync} from '@angular/core/testing';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {MobileBaseService} from './base.service';
import {Router} from '@angular/router';
import {LoadingService} from '../loading-service/loading.service';
import {Location} from '@angular/common';
import {AuthenticationService} from '../authentication/authentication.service';
import {HTTP} from '@ionic-native/http/ngx';

describe('MobileBaseService', () => {
  let utilityServiceSpy;
  let service: MobileBaseService;
  let routerSpy: Router;
  let httpSpy;
  let loadingServiceSpy;
  let locationSpy;
  let authServiceSpy;
  let bearer;
  let buildHeadersSpy;
  let endpoint;
  let testResponse;
  let testResponseData;
  let webServiceErrorSpy;
  let headers;

  beforeEach(
    waitForAsync(() => {
      httpSpy = jasmine.createSpyObj('httpSpy', [
        'setDataSerializer',
        'getCookieString',
        'clearCookies',
        'get',
        'post',
        'put',
      ]);
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy ', [
        'getBaseUrl',
      ]);
      routerSpy = jasmine.createSpyObj('routerSpy ', ['navigateByUrl']);
      loadingServiceSpy = jasmine.createSpyObj('loadingServiceSpy ', [
        'startLoading',
        'stopLoading',
      ]);
      locationSpy = jasmine.createSpyObj('Location ', ['back']);
      authServiceSpy = jasmine.createSpyObj('AuthenitcationService', [
        'getAccessToken',
        'isAuthenticated',
        'logout',
      ]);
      webServiceErrorSpy = jasmine.createSpyObj('WebServiceError', ['next']);

      TestBed.configureTestingModule({
        imports: [],
        providers: [
          {provide: HTTP, useValue: httpSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: Router, useValue: routerSpy},
          {provide: LoadingService, useValue: loadingServiceSpy},
          {provide: Location, useValue: locationSpy},
          {provide: AuthenticationService, useValue: authServiceSpy},
        ],
      });
      service = TestBed.inject(MobileBaseService);
      service['webServiceError'] = webServiceErrorSpy;
      bearer = 'Bearer xxx-xxx-xxx-xxx';
      headers = {Authorization: bearer, 'X-Requested-By': 'myvoyageui'};
      buildHeadersSpy = spyOn(service, 'buildHeaders').and.returnValue(
        Promise.resolve(headers)
      );
      endpoint = 'http://test.com';
      testResponseData = {resp: '123'};
      testResponse = {
        status: 200,
        headers: {},
        url: endpoint,
        data: JSON.stringify(testResponseData),
      };
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setDataSerializer', () => {
    it('should call http setDataSerializer', () => {
      const serializer = 'multipart';
      service.setDataSerializer(serializer);
      expect(httpSpy.setDataSerializer).toHaveBeenCalledWith(serializer);
    });
  });

  describe('awaitIsBusy', () => {
    it('should call isLocked, and resolve if false', async () => {
      service['isBusy'] = true;
      setTimeout(() => {
        service['isBusy'] = false;
      }, 1000);

      const time = new Date().getTime();

      await service.awaitIsBusy();

      const timeAfter = new Date().getTime();
      const diff = timeAfter - time;

      expect(diff).toBeGreaterThan(500);
    });
  });

  describe('buildHeaders', () => {
    beforeEach(() => {
      buildHeadersSpy.and.callThrough();

      spyOn(service, 'awaitIsBusy').and.returnValue(Promise.resolve());
      authServiceSpy.getAccessToken.and.returnValue(
        Promise.resolve('xxx-ccc-ddd-sss')
      );
    });

    it('should check isBusy and call awaitIsBusy if so, and then call isAuthenticated, and if so, get access token and build headers', async () => {
      service['isBusy'] = true;
      authServiceSpy.isAuthenticated.and.returnValue(Promise.resolve(true));

      const result = await service.buildHeaders();
      expect(service.awaitIsBusy).toHaveBeenCalled();

      expect(authServiceSpy.isAuthenticated).toHaveBeenCalled();
      expect(authServiceSpy.getAccessToken).toHaveBeenCalled();
      expect(service['isBusy']).toBeFalse();
      expect(result).toEqual({
        Authorization: 'Bearer xxx-ccc-ddd-sss',
        'X-Requested-By': 'myvoyageui',
      });
    });

    it('should not call awaitIsBusy if not isBusy, and not call getAccessToken and call logout if not authenticated', async () => {
      service['isBusy'] = false;
      authServiceSpy.isAuthenticated.and.returnValue(Promise.resolve(false));

      const result = await service.buildHeaders();

      expect(service.awaitIsBusy).not.toHaveBeenCalled();

      expect(authServiceSpy.isAuthenticated).toHaveBeenCalled();
      expect(authServiceSpy.getAccessToken).not.toHaveBeenCalled();
      expect(authServiceSpy.logout).toHaveBeenCalled();
      expect(result).toEqual({
        Authorization: 'Bearer ',
        'X-Requested-By': 'myvoyageui',
      });
    });
  });

  describe('post', () => {
    it('should get headers and then call post', async () => {
      httpSpy.post.and.returnValue(Promise.resolve(testResponse));

      const result = await service.post(endpoint, {test: 'test'});
      expect(service.buildHeaders).toHaveBeenCalled();
      expect(httpSpy.post).toHaveBeenCalledWith(
        endpoint,
        {test: 'test'},
        headers
      );
      expect(result).toEqual(testResponseData);
    });

    it('should get headers and then call post and return null if error', async () => {
      testResponse.data = null;
      httpSpy.post.and.returnValue(Promise.resolve(testResponse));

      const result = await service.post(endpoint, {test: 'test'});
      expect(service.buildHeaders).toHaveBeenCalled();
      expect(httpSpy.post).toHaveBeenCalledWith(
        endpoint,
        {test: 'test'},
        headers
      );
      expect(result).toEqual(null);
    });

    it('should get headers and then call post and return null on exception', async () => {
      testResponse.data = '{ss{';
      httpSpy.post.and.returnValue(Promise.resolve(testResponse));

      const result = await service.post(endpoint, {test: 'test'});
      expect(service.buildHeaders).toHaveBeenCalled();
      expect(httpSpy.post).toHaveBeenCalledWith(
        endpoint,
        {test: 'test'},
        headers
      );
      expect(result).toEqual(null);
    });

    it('should get httpHeader and then call post', async () => {
      testResponse.headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };
      httpSpy.post.and.returnValue(Promise.resolve(testResponse));
      const result = await service.post(
        endpoint,
        {test: 'test'},
        testResponse.headers
      );
      expect(service.buildHeaders).not.toHaveBeenCalled();
      expect(httpSpy.post).toHaveBeenCalledWith(
        endpoint,
        {test: 'test'},
        testResponse.headers
      );
      expect(result).toEqual(testResponseData);
    });

    it('should call next on webServiceError if error', async () => {
      httpSpy.post.and.callFake(() => Promise.reject('test'));
      await service.post(endpoint, {test: 'test'});

      expect(webServiceErrorSpy.next).toHaveBeenCalledWith();
    });
  });

  describe('postWithoutResponse', () => {
    it('should call post', async () => {
      const dummyData = {dummy: 'data'};
      await service.postWithoutResponse(endpoint, dummyData);
      expect(httpSpy.post).toHaveBeenCalledWith(endpoint, dummyData, headers);
    });

    it('should call post', async () => {
      const dummyData = {dummy: 'data'};
      await service.postWithoutResponse(endpoint, dummyData);
      expect(httpSpy.post).toHaveBeenCalledWith(endpoint, dummyData, headers);
    });
  });

  describe('put', () => {
    it('should get headers and then call post', async () => {
      httpSpy.put.and.returnValue(Promise.resolve(testResponse));

      const result = await service.put(endpoint, {test: 'test'});
      expect(service.buildHeaders).toHaveBeenCalled();
      expect(httpSpy.put).toHaveBeenCalledWith(
        endpoint,
        {test: 'test'},
        headers
      );
      expect(result).toEqual(testResponseData);
    });

    it('should get headers and then call post and return null if no data', async () => {
      testResponse.data = null;
      httpSpy.put.and.returnValue(Promise.resolve(testResponse));

      const result = await service.put(endpoint, {test: 'test'});
      expect(service.buildHeaders).toHaveBeenCalled();
      expect(httpSpy.put).toHaveBeenCalledWith(
        endpoint,
        {test: 'test'},
        headers
      );
      expect(result).toEqual(null);
    });

    it('should get headers and then call post and return null if exception', async () => {
      testResponse.data = '{ss{';
      httpSpy.put.and.returnValue(Promise.resolve(testResponse));

      const result = await service.put(endpoint, {test: 'test'});
      expect(service.buildHeaders).toHaveBeenCalled();
      expect(httpSpy.put).toHaveBeenCalledWith(
        endpoint,
        {test: 'test'},
        headers
      );
      expect(result).toEqual(null);
    });

    it('should call next on webServiceError if error', async () => {
      httpSpy.put.and.callFake(() => Promise.reject('test'));
      await service.put(endpoint, {test: 'test'});

      expect(webServiceErrorSpy.next).toHaveBeenCalledWith();
    });
  });

  describe('get', () => {
    it('should call get without auth headers is auth is false', async () => {
      httpSpy.get.and.returnValue(Promise.resolve(testResponse));

      const result = await service.get(endpoint, false);
      expect(httpSpy.get).toHaveBeenCalledWith(endpoint, {}, {});
      expect(result).toEqual(testResponseData);
    });

    it('should get headers and then call get', async () => {
      httpSpy.get.and.returnValue(Promise.resolve(testResponse));

      const result = await service.get(endpoint);
      expect(service.buildHeaders).toHaveBeenCalled();
      expect(httpSpy.get).toHaveBeenCalledWith(endpoint, {}, headers);
      expect(result).toEqual(testResponseData);
    });

    it('should get headers and then call get and return null if no data', async () => {
      testResponse.data = null;
      httpSpy.get.and.returnValue(Promise.resolve(testResponse));

      const result = await service.get(endpoint);
      expect(service.buildHeaders).toHaveBeenCalled();
      expect(httpSpy.get).toHaveBeenCalledWith(endpoint, {}, headers);
      expect(result).toEqual(null);
    });

    it('should get headers and then call get and return null if exception', async () => {
      testResponse.data = '{ss{';
      httpSpy.get.and.returnValue(Promise.resolve(testResponse));

      const result = await service.get(endpoint);
      expect(service.buildHeaders).toHaveBeenCalled();
      expect(httpSpy.get).toHaveBeenCalledWith(endpoint, {}, headers);
      expect(result).toEqual(null);
    });

    it('should call next on webServiceError if error', async () => {
      httpSpy.get.and.callFake(() => Promise.reject('test'));
      await service.get(endpoint, false);

      expect(webServiceErrorSpy.next).toHaveBeenCalledWith();
    });
  });

  describe('getWithoutResponse', () => {
    it('should call get', async () => {
      await service.getWithoutResponse(endpoint);
      expect(service.buildHeaders).toHaveBeenCalled();
      expect(httpSpy.get).toHaveBeenCalledWith(endpoint, {}, headers);
    });
  });

  describe('ClearCookies', () => {
    it('it should call rhttpClientNative.clearCookies', () => {
      service.clearCookies();
      expect(httpSpy.clearCookies).toHaveBeenCalled();
    });
  });

  describe('GetcookieString', () => {
    it('it should call httpClientNative.getCookieString', () => {
      service.getCookieString('domain');
      expect(httpSpy.getCookieString).toHaveBeenCalledWith('domain');
    });
  });

  describe('NavigateByUrl', () => {
    it('it should call router.navigateByUrl', () => {
      service.navigateByUrl('url');
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('url');
    });
  });

  describe('navigateBack', () => {
    it('should call location back', () => {
      service.navigateBack();
      expect(locationSpy.back).toHaveBeenCalled();
    });
  });

  describe('Start Loading', () => {
    it('it should call startLoading if startLoading is true', () => {
      service.startLoading(true);
      expect(loadingServiceSpy.startLoading).toHaveBeenCalled();
    });

    it('it should not call startLoading if startLoading is false', () => {
      service.startLoading(false);
      expect(loadingServiceSpy.startLoading).not.toHaveBeenCalled();
    });
  });

  describe('Stop Loading', () => {
    it('it should call stopLoading if stopLoading is true', () => {
      service.stopLoading(true);
      expect(loadingServiceSpy.stopLoading).toHaveBeenCalled();
    });

    it('it should not call stopLoading if stopLoading is false', () => {
      service.stopLoading(false);
      expect(loadingServiceSpy.stopLoading).not.toHaveBeenCalled();
    });
  });

  describe('postUrlEncoded', () => {
    let postBody;

    beforeEach(() => {
      httpSpy.post.and.returnValue(Promise.resolve(testResponse));
      postBody = {
        post: 'body',
        post2: 'body2',
      };
      spyOn(service, 'setDataSerializer');
    });

    it('should post the url encoded data with the auth header if no headers passed in', async () => {
      const result = await service.postUrlEncoded(endpoint, postBody);
      expect(httpSpy.post).toHaveBeenCalledWith(
        endpoint,
        'post=body&post2=body2',
        {
          ...headers,
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      );
      expect(result).toEqual(testResponseData);
    });

    it('should post the url encoded data with the provided headers if headers passed in', async () => {
      const result = await service.postUrlEncoded(endpoint, postBody, {
        header: '1',
      });
      expect(httpSpy.post).toHaveBeenCalledWith(
        endpoint,
        'post=body&post2=body2',
        {
          header: '1',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      );
      expect(result).toEqual(testResponseData);
    });

    it('should set the dataSerializer to utf8 then back to json', async () => {
      await service.postUrlEncoded(endpoint, postBody);
      expect(service.setDataSerializer).toHaveBeenCalledWith('utf8');
      expect(service.setDataSerializer).toHaveBeenCalledWith('json');
    });

    it('should return null if there is an error parsing the response', async () => {
      testResponse.data = 'abc';
      const result = await service.postUrlEncoded(endpoint, postBody);
      expect(result).toBeNull();
    });
  });
});
