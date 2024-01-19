import {TestBed, waitForAsync} from '@angular/core/testing';
import {MyVoyaService} from './myvoya.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';

describe('MyVoyaService', () => {
  let service: MyVoyaService;
  let sharedUtilityServiceSpy;
  let environment;

  beforeEach(
    waitForAsync(() => {
      sharedUtilityServiceSpy = jasmine.createSpyObj(
        'sharedUtilityServiceSpy',
        ['getEnvironment']
      );
      environment = {
        production: false,
        baseUrl: 'http://localhost:4201/',
        tokenBaseUrl: 'https://token.intg.app.voya.com/',
        myvoyaBaseUrl: 'https://myvoya-web.intg.voya.com/',
        loginBaseUrl: 'https://login.intg.voya.com/',
        savviBaseUrl: 'https://myhealthwealth.intg.voya.com/',
        logoutUrl:
          'https://login.intg.voya.com/oidcop/sps/authsvc?PolicyId=urn:ibm:security:authentication:asf:oidc_logout&oidc_op=oidc_op_voya_customer_web',
      };
      sharedUtilityServiceSpy.getEnvironment.and.returnValue(environment);
      TestBed.configureTestingModule({
        imports: [],
        providers: [
          {provide: SharedUtilityService, useValue: sharedUtilityServiceSpy},
        ],
      });
      service = TestBed.inject(MyVoyaService);
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getLoadedSubject', () => {
    it('should return the subject', () => {
      const subject = jasmine.createSpyObj('Subject', ['']);
      service['loadedSubject'] = subject;
      const result = service.getLoadedSubject();
      expect(result).toEqual(subject);
    });
  });

  describe('setIframeLoaded', () => {
    it('should set the iframeloaded in sessionStorage and in the class prop', () => {
      spyOn(Storage.prototype, 'setItem');
      service['iframeLoaded'] = undefined;
      service.setIframeLoaded(false);
      expect(Storage.prototype.setItem).toHaveBeenCalledWith(
        'iframeloaded',
        'false'
      );
      expect(service['iframeLoaded']).toBeFalse();
    });
  });

  describe('getIframeLoaded', () => {
    it('return iframeloaded from sessionStorage if it exists', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue('true');
      const result = service.getIframeLoaded();
      expect(Storage.prototype.getItem).toHaveBeenCalledWith('iframeloaded');
      expect(result).toBeTrue();
    });

    it('return iframeloaded from class property if sessionStorage is undefined', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue('undefined');
      service['iframeLoaded'] = false;
      const result = service.getIframeLoaded();
      expect(result).toBeFalse();
    });

    it('return iframeloaded from class property if sessionStorage is null', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue(null);
      service['iframeLoaded'] = true;
      const result = service.getIframeLoaded();
      expect(result).toBeTrue();
    });
  });

  describe('listenForIframeLoad', () => {
    let message;
    let setIframeLoadedSpy;
    let nextSpy;
    let getIframeLoadedSpy;

    beforeEach(() => {
      message = {origin: environment.myvoyaBaseUrl.slice(0, -1)};
      spyOn(window, 'addEventListener').and.callFake((event, f) => {
        expect(event).toEqual('message');
        f(message);
      });
      nextSpy = spyOn(service['loadedSubject'], 'next');
      setIframeLoadedSpy = spyOn(service, 'setIframeLoaded');
      getIframeLoadedSpy = spyOn(service, 'getIframeLoaded').and.returnValue(
        false
      );
    });

    it('should listen for the load event and call setIframeLoaded and next if the origin is the myvoyabaseurl if iframe has not loaded already', () => {
      service.listenForIframeLoad();
      expect(window.addEventListener).toHaveBeenCalled();
      expect(setIframeLoadedSpy).toHaveBeenCalledWith(true);
      expect(nextSpy).toHaveBeenCalled();
    });

    it('should not call setIframeLoaded or next if the origin is not the myvoyaBaseUrl', () => {
      message.origin = 'notMyVoya';
      service.listenForIframeLoad();
      expect(setIframeLoadedSpy).not.toHaveBeenCalled();
      expect(nextSpy).not.toHaveBeenCalled();
    });

    it('should call next if the myvoyaBaseUrl is localhost and origin is undefined', () => {
      message.origin = undefined;
      environment.myvoyaBaseUrl = 'http://localhost:4201/';
      service.listenForIframeLoad();
      expect(setIframeLoadedSpy).toHaveBeenCalled();
      expect(nextSpy).toHaveBeenCalled();
    });

    it('should not listen for iframe load and should publish next immediately if iframe has already loaded', () => {
      getIframeLoadedSpy.and.returnValue(true);
      service.listenForIframeLoad();
      expect(window.addEventListener).not.toHaveBeenCalled();
      expect(nextSpy).toHaveBeenCalled();
    });
  });
});
