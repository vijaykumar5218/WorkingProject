import {HttpClient} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {VoyaGlobalCacheService} from './voya-global-cache.service';

describe('VoyaGlobalCacheService', () => {
  let service: VoyaGlobalCacheService;
  let httpClientSpy;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj(['get', 'post']);
    TestBed.configureTestingModule({
      providers: [{provide: HttpClient, useValue: httpClientSpy}],
    });
    service = TestBed.inject(VoyaGlobalCacheService);
    service['requireNav'] = jasmine.createSpy();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initVoyaGlobalFooterCache', () => {
    beforeEach(() => {
      service['handleGetCall'] = jasmine.createSpy();
    });
    it('should not overwrite fetchMethod if window.fetchMethod is already defined', () => {
      (window as any).fetchMethod = jasmine.createSpy();
      service.initVoyaGlobalCache();
      expect(service['handleGetCall']).not.toHaveBeenCalled();
      expect(httpClientSpy.post).not.toHaveBeenCalled();
    });
    it('should overwrite fetchMethod if window.fetchMethod not defined and not retrieve data if data is cached', () => {
      (window as any).fetchMethod = undefined;
      service.dataCache = {
        testUrl: Promise.resolve({
          test: 'test',
        }),
      };
      service.initVoyaGlobalCache();
      expect(service['handleGetCall']).not.toHaveBeenCalled();
      expect(httpClientSpy.post).not.toHaveBeenCalled();
    });

    it('should overwrite fetchMethod if window.fetchMethod not defined and retrieve data with GET if dataCache undefined', async () => {
      (window as any).fetchMethod = undefined;
      service.dataCache = {};
      const opts = {
        method: 'GET',
        headers: {},
        withCredentials: true,
      };
      service.initVoyaGlobalCache();
      await (window as any).fetchMethod('test', opts);
      expect(service['handleGetCall']).toHaveBeenCalledWith('test', opts);
      expect(httpClientSpy.post).not.toHaveBeenCalled();
    });
    it('should overwrite fetchMethod if window.fetchMethod not defined and retrieve data with POST if dataCache undefined', async () => {
      service['setClientBrandPostBody'] = jasmine.createSpy();
      (window as any).fetchMethod = undefined;
      service.dataCache = {};
      const opts: any = {
        method: 'POST',
        headers: 'header',
        body: 'body',
        withCredentials: true,
      };
      httpClientSpy.post.and.returnValue(of({test: 'test'}));
      service.initVoyaGlobalCache();
      await (window as any).fetchMethod('test', opts);
      expect(service['handleGetCall']).not.toHaveBeenCalled();
      expect(service['setClientBrandPostBody']).toHaveBeenCalledWith(
        'test',
        false,
        opts,
        'dashboard'
      );
      expect(httpClientSpy.post).toHaveBeenCalledWith('test', 'body', {
        headers: 'header',
        withCredentials: true,
      });
    });
    it('should add pageName to body if it`s a cliendBrand POST call and myWorkplaceDashboard is true', async () => {
      const opts = {
        method: 'POST',
        headers: 'header',
        body: '{"domain":"voyaretirement.intg.voya.com"}',
        withCredentials: true,
      };
      (window as any).fetchMethod = undefined;
      spyOn(Storage.prototype, 'getItem').and.returnValue('true');
      service.dataCache = {};
      httpClientSpy.post.and.returnValue(of({test: '/clientbrand'}));
      service.initVoyaGlobalCache();
      await (window as any).fetchMethod(
        'voyasso/ws/ers/postlogin/clientbrand',
        opts
      );
      expect(service['handleGetCall']).not.toHaveBeenCalled();
      expect(httpClientSpy.post).toHaveBeenCalledWith(
        'voyasso/ws/ers/postlogin/clientbrand',
        '{"domain":"voyaretirement.intg.voya.com","pageName":"myBenefitshub"}',
        {
          headers: 'header',
          withCredentials: true,
        }
      );
    });
    it('should add pageName to body if it`s a cliendBrand POST call and myWorkplaceDashboard is false', async () => {
      (window as any).fetchMethod = undefined;
      spyOn(Storage.prototype, 'getItem').and.returnValue('false');
      service.dataCache = {};
      const opts = {
        method: 'POST',
        headers: 'header',
        body: '{"domain":"voyaretirement.intg.voya.com"}',
        withCredentials: true,
      };
      httpClientSpy.post.and.returnValue(of({test: '/clientBrand'}));
      service.initVoyaGlobalCache();
      await (window as any).fetchMethod('/clientBrand', opts);
      expect(service['handleGetCall']).not.toHaveBeenCalled();
      expect(httpClientSpy.post).toHaveBeenCalledWith(
        '/clientBrand',
        '{"domain":"voyaretirement.intg.voya.com"}',
        {
          headers: 'header',
          withCredentials: true,
        }
      );
    });
    it('should not call GET and POST method if method is PUT', async () => {
      (window as any).fetchMethod = undefined;
      service.dataCache = {};
      const opts = {
        method: 'PUT',
        headers: 'header',
        body: '{"domain":"voyaretirement.intg.voya.com"}',
        withCredentials: true,
      };
      service.initVoyaGlobalCache();
      await (window as any).fetchMethod('test', opts);
      expect(service['handleGetCall']).not.toHaveBeenCalled();
      expect(httpClientSpy.post).not.toHaveBeenCalled();
    });

    it('should expect text response if endpoint is setPref', async () => {
      (window as any).fetchMethod = undefined;
      spyOn(Storage.prototype, 'getItem').and.returnValue('false');
      service.dataCache = {};
      const opts = {
        method: 'POST',
        headers: 'header',
        body: '{"domain":"voyaretirement.intg.voya.com"}',
        withCredentials: true,
      };
      httpClientSpy.post.and.returnValue(of('OK'));
      service.initVoyaGlobalCache();
      const result = await (window as any).fetchMethod('/setPref', opts);
      expect(httpClientSpy.get).not.toHaveBeenCalled();
      expect(httpClientSpy.post).toHaveBeenCalledWith(
        '/setPref',
        '{"domain":"voyaretirement.intg.voya.com"}',
        {
          headers: 'header',
          withCredentials: true,
          responseType: 'text',
        }
      );
      expect(await result.text()).toEqual('OK');
    });
    it('should  set translationPreferenceResponse', async () => {
      const mockPref = {
        dataStatus: 'OK',
        translationEnabled: false,
        modalAlertsEnabled: false,
        contentCaptureEnabled: false,
        oneLinkKeyForEnglish: '50E9-BDF3-115F-286D',
        oneLinkKeyForSpanish: 'D002-7D8C-A50B-FA2D',
        langPreference: {
          preference: 'en-US',
        },
        translationEnabledMyvoyageDsh: false,
        clientTranslationEnabled: true,
        clientId: 'INGWIN',
      };
      spyOn(service['translationPreferenceResponse'], 'next');
      const obsSpy = jasmine.createSpyObj('Obs', ['subscribe']);
      spyOn(service, 'getTranslationPreference').and.returnValue(obsSpy);

      (window as any).fetchMethod = undefined;
      spyOn(Storage.prototype, 'getItem').and.returnValue('false');
      service.dataCache = {};
      const opts = {
        method: 'POST',
        headers: 'header',
        body: '{"domain":"voyaretirement.intg.voya.com"}',
        withCredentials: true,
      };
      httpClientSpy.post.and.returnValue(of(mockPref));
      service.initVoyaGlobalCache();
      await (window as any).fetchMethod('/getPref', opts);
      expect(
        service['translationPreferenceResponse'].next
      ).toHaveBeenCalledWith(mockPref);

      service.getTranslationPreference().subscribe(data => {
        expect(obsSpy.subscribe).toHaveBeenCalled();
        expect(data).toEqual(mockPref);
      });
    });
  });

  describe('constructURL', () => {
    beforeEach(() => {
      spyOn(Storage.prototype, 'getItem').and.returnValue('AA1234567');
    });
    it('when URL will be /dashboard/primaryNavLinks', () => {
      const result = service['constructURL'](
        '/dashboard/primaryNavLinks',
        true,
        'dashboard'
      );
      expect(result).toEqual(
        '/dashboard/primaryNavLinks?sessionID=AA1234567&pageName=dashboard'
      );
    });
    it('when URL will be /dashboard/responsivenav', () => {
      const result = service['constructURL'](
        '/dashboard/responsivenav',
        true,
        'dashboard'
      );
      expect(result).toEqual(
        '/dashboard/responsivenav?sessionID=AA1234567&pageName=dashboard'
      );
    });
    it('when URL will be /myvoyageenabled', () => {
      const result = service['constructURL'](
        '/myvoyageenabled',
        true,
        'dashboard'
      );
      expect(result).toEqual('/myvoyageenabled');
    });
    it('when URL will be /public/rsglobal/clientBrand', () => {
      const result = service['constructURL'](
        '/public/rsglobal/clientBrand',
        true,
        'dashboard'
      );
      expect(result).toEqual('/postlogin/clientbrand');
    });
    it('when URL will be /dashboard/retirement/vds/footer', () => {
      const result = service['constructURL'](
        '/dashboard/retirement/vds/footer',
        true,
        'dashboard'
      );
      expect(result).toEqual(
        '/dashboard/retirement/vds/footer?pageName=dashboard'
      );
    });
  });

  describe('handleGetCall', () => {
    let serviceSpy;
    const opts = {
      method: 'GET',
      headers: {},
      withCredentials: true,
    };
    beforeEach(() => {
      serviceSpy = jasmine.createSpyObj('service', ['checkMyvoyageAccess']);
      spyOn(service['injector'], 'get').and.returnValue(serviceSpy);
    });
    it('when url is myvoyageenabled', async () => {
      serviceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({
          enableMyVoyage: 'N',
          enableMaintenanceWindow: 'Y',
        })
      );
      const promise = service['handleGetCall']('/myvoyageenabled', opts);
      const result = await promise;
      expect(result).toEqual({
        enableMyVoyage: 'N',
        enableMaintenanceWindow: 'Y',
      });
      expect(serviceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      expect(httpClientSpy.get).not.toHaveBeenCalled();
    });
    it('when url is not myvoyageenabled', async () => {
      httpClientSpy.get.and.returnValue(of({test: 'test'}));
      const promise = service['handleGetCall']('/responsivenav', opts);
      const result = await promise;
      expect(result).toEqual({test: 'test'});
      expect(serviceSpy.checkMyvoyageAccess).not.toHaveBeenCalled();
      expect(httpClientSpy.get).toHaveBeenCalledWith('/responsivenav', {
        headers: {},
        withCredentials: true,
      });
    });
  });
  describe('getTranslationPreference', () => {
    it('should return translationPreferenceResponse when getTranslationPreference is subscribed', () => {
      const mockPref = {
        dataStatus: 'OK',
        translationEnabled: false,
        modalAlertsEnabled: false,
        contentCaptureEnabled: false,
        oneLinkKeyForEnglish: '50E9-BDF3-115F-286D',
        oneLinkKeyForSpanish: 'D002-7D8C-A50B-FA2D',
        langPreference: {
          preference: 'en-US',
        },
        translationEnabledMyvoyageDsh: false,
        clientTranslationEnabled: true,
        clientId: 'INGWIN',
      };
      service['translationPreferenceResponse'].next(mockPref);
      service.getTranslationPreference().subscribe(res => {
        expect(res).toEqual(mockPref);
      });
    });
  });
});
