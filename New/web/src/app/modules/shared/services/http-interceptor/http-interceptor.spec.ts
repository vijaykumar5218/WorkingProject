import {TestBed, waitForAsync} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

import {HttpRequestInterceptor} from './http-interceptor';
import {of, ReplaySubject} from 'rxjs';
import {MyVoyaService} from '../myvoya/myvoya.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';

describe('HttpRequestInterceptor', () => {
  let service: HttpRequestInterceptor;
  let myVoyaServiceSpy;
  let utilityServiceSpy;

  beforeEach(
    waitForAsync(() => {
      myVoyaServiceSpy = jasmine.createSpyObj('MyVoyaService', [
        'getLoadedSubject',
      ]);
      utilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'isMyVoyaUrl',
      ]);
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          HttpRequestInterceptor,
          {provide: MyVoyaService, useValue: myVoyaServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
        ],
      });
      service = TestBed.inject(HttpRequestInterceptor);
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('intercept', () => {
    let mockData;
    let httpRequestSpy;
    let httpHandlerSpy;
    let url;

    beforeEach(() => {
      mockData = {mock: 'data'};
      httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['clone']);

      httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
      httpHandlerSpy.handle.and.returnValue(of(mockData));
      url = 'mockUrl';
      httpRequestSpy.url = url;
    });

    it('should add with credentials and wait for the iframe for myvoya calls', () => {
      utilityServiceSpy.isMyVoyaUrl.and.returnValue(true);
      const cloneVal = {url: url, withCredentials: true};
      httpRequestSpy.clone.and.callFake(() => cloneVal);
      const loadedSubject = new ReplaySubject<void>(1);
      loadedSubject.next();
      myVoyaServiceSpy.getLoadedSubject.and.returnValue(loadedSubject);
      service.intercept(httpRequestSpy, httpHandlerSpy).subscribe(data => {
        expect(utilityServiceSpy.isMyVoyaUrl).toHaveBeenCalled();
        expect(httpRequestSpy.clone).toHaveBeenCalledWith({
          withCredentials: true,
        });
        expect(myVoyaServiceSpy.getLoadedSubject).toHaveBeenCalled();
        expect(httpHandlerSpy.handle).toHaveBeenCalledWith(cloneVal);
        expect(data).toEqual(mockData);
      });
    });

    it('should not add credentials or wait for iframe for non myvoya calls', () => {
      service.intercept(httpRequestSpy, httpHandlerSpy).subscribe(data => {
        expect(httpRequestSpy.clone).not.toHaveBeenCalledWith();
        expect(myVoyaServiceSpy.getLoadedSubject).not.toHaveBeenCalled();
        expect(httpHandlerSpy.handle).toHaveBeenCalledWith(httpRequestSpy);
        expect(data).toEqual(mockData);
      });
    });
  });
});
