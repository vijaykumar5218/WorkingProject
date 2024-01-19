import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {of, ReplaySubject, Subscription} from 'rxjs';
import {NavigationModel} from './models/utility.models';
import {SharedUtilityService} from '../utility/utility.service';
import {ElementRef} from '@angular/core';
import {Style} from '@capacitor/status-bar';
import {Platform} from '@ionic/angular';
import {Environment} from '@shared-lib/models/environment.model';
import {PlatformService} from '../platform/platform.service';
import {Location} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';

describe('SharedUtilityService', () => {
  let service: SharedUtilityService;
  let routerSpy;
  let platformSpy;
  let platformServiceSpy;
  let locationSpy;
  let domSanitizerSpy;
  let environment;

  beforeEach(() => {
    locationSpy = jasmine.createSpyObj('locationSpy', ['back']);
    routerSpy = {
      url: '/accounts/account-details/32323/info',
      events: {
        pipe: jasmine.createSpy().and.returnValue(
          of({
            id: 1,
            url: '/accounts',
          })
        ),
      },
      navigateByUrl: jasmine.createSpy(),
    };
    platformSpy = jasmine.createSpyObj('Platform', [], {resume: of()});
    platformServiceSpy = jasmine.createSpyObj('PlatformService', ['isDesktop']);
    domSanitizerSpy = jasmine.createSpyObj('DomSanitizer', [
      'bypassSecurityTrustResourceUrl',
    ]);
    environment = {
      production: false,
      livereload: true,
      baseUrl: 'https://myvoyage.intg.app.voya.com/',
      tpaPrefix: 'INTG-',
      tpaSdk: '1a1d68b8-93c1-41ac-bced-16d1624c527f',
      tokenBaseUrl: 'https://token.intg.app.voya.com/',
      myvoyaBaseUrl: 'https://myvoya.intg.app.voya.com/',
      loginBaseUrl: 'https://login.intg.voya.com/',
      savviBaseUrl: 'https://myhealthwealth.intg.voya.com/',
      authClientID: 'myvoyage_app_MFbT3mcQsSY78eugY5je',
      authTokenExchangeClient:
        'myvoyage_app_token_exchange_8ah5YTB3MIavGzS3UXjj',
      ssoSamlUrl: 'https://sso.myvoya.com',
      openIdConfigurationUrl: 'oidcop/app/.well-known/openid-configuration',
      samlAudience: 'saml/sps/saml-idp-login/saml20',
    };
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {provide: Router, useValue: routerSpy},
        {provide: Platform, useValue: platformSpy},
        {provide: PlatformService, useValue: platformServiceSpy},
        {provide: Location, useValue: locationSpy},
        {provide: DomSanitizer, useValue: domSanitizerSpy},
      ],
    }).compileComponents();
    service = TestBed.inject(SharedUtilityService);
    service['subscription'] = jasmine.createSpyObj('Subscription', [
      'add',
      'unsubscribe',
    ]);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('backToPrevious', () => {
    it('should call back', () => {
      service.backToPrevious();
      expect(locationSpy.back).toHaveBeenCalled();
    });
  });

  describe('setIsWeb', () => {
    it('should set isWeb', () => {
      service['isWeb'] = false;
      service.setIsWeb(true);
      expect(service['isWeb']).toBeTrue();
    });
  });

  describe('getIsWeb', () => {
    it('should return isWeb', () => {
      service['isWeb'] = false;
      const result = service.getIsWeb();
      expect(result).toBeFalse();
    });
  });

  describe('isDesktop', () => {
    it('should return the result of platformService.isDesktop', () => {
      const obs = of({});
      platformServiceSpy.isDesktop.and.returnValue(obs);
      const result = service.isDesktop();
      expect(result).toEqual(obs);
    });
  });

  describe('formatStringDate', () => {
    it('should return formated Date', () => {
      const timeStamp =
        'Fri Apr 29 2022 22:40:38 GMT+0530 (India Standard Time)';
      const date = service.formatStringDate(timeStamp);
      expect(date).toEqual('4-29-2022');
    });
  });

  describe('validatePhone', () => {
    it('should get phone number validate the format', () => {
      const isvalid = service.validatePhone('123-456-7890');
      expect(isvalid).toEqual(true);
    });
  });

  describe('valueChanged', () => {
    it('if value is valid', () => {
      const output = service.formatPhone('860-867-5309');
      expect(output).toEqual('860-867-5309');
    });

    it('if value is undefined', () => {
      const output = service.formatPhone(undefined);
      expect(output).toEqual('--');
    });

    it('if value would be greater than 12', () => {
      const output = service.formatPhone('123-456-7890-1');
      expect(output).toEqual('123-456-7890');
    });
  });

  describe('validateEmail', () => {
    it('should get phone number validate the format', () => {
      const isvalid = service.validateEmail('test@gmail.com');
      expect(isvalid).toEqual(true);
    });
  });

  describe('appendBaseUrlToEndpoints', () => {
    let isMyVoyaUrlSpy;
    beforeEach(() => {
      service['environment'] = environment;
      isMyVoyaUrlSpy = spyOn(service, 'isMyVoyaUrl');
    });

    it('should add baseURL to the beginning of endpoints using service baseUrl if none passed', () => {
      const endpoints = {
        test1: 'test/1',
        test2: 'test/2',
        test3: 'test/call/3',
      };
      const result = service.appendBaseUrlToEndpoints(endpoints);
      expect(result).toEqual({
        test1: 'https://myvoyage.intg.app.voya.com/test/1',
        test2: 'https://myvoyage.intg.app.voya.com/test/2',
        test3: 'https://myvoyage.intg.app.voya.com/test/call/3',
      });
    });

    it('should add baseURL to the beginning of endpoints using baseUrl passed in', () => {
      const endpoints = {
        test1: '/test/1',
        test2: '/test/2',
        test3: '/test/call/3',
      };
      const result = service.appendBaseUrlToEndpoints(
        endpoints,
        'https://www.test.com'
      );
      expect(result).toEqual({
        test1: 'https://www.test.com/test/1',
        test2: 'https://www.test.com/test/2',
        test3: 'https://www.test.com/test/call/3',
      });
    });

    it('should add myvoyaBaseURL to the beginning of endpoints that are myvoya or iframe_login.html', () => {
      const endpoints = {
        test1: '/1/2/3/myvoya/a/b/c',
        test2: '/1/2/3/iframe_login.html/a/b/c',
      };
      isMyVoyaUrlSpy.and.returnValue(true);
      const result = service.appendBaseUrlToEndpoints(
        endpoints,
        'https://www.test.com',
        'https://www.test-myvoya.com'
      );
      expect(result).toEqual({
        test1: 'https://www.test-myvoya.com/1/2/3/myvoya/a/b/c',
        test2: 'https://www.test-myvoya.com/1/2/3/iframe_login.html/a/b/c',
      });
    });
  });

  describe('setEnvironment', () => {
    it('should set the environment', () => {
      service['environment'] = undefined;
      service.setEnvironment(environment);
      expect(service['environment']).toEqual(environment);
    });
  });

  describe('getEnvironment', () => {
    it('should get the environment', () => {
      service['environment'] = environment;
      const result = service.getEnvironment();
      expect(result).toEqual(environment);
    });
  });

  describe('setStatusBarStyleLight', () => {
    it('should call statusBar setBackgroundColor and setStyle', async () => {
      const statusBarSpy = jasmine.createSpyObj('statusBarSpy', [
        'setBackgroundColor',
        'setStyle',
      ]);
      statusBarSpy.setBackgroundColor.and.returnValue(Promise.resolve());
      statusBarSpy.setStyle.and.returnValue(Promise.resolve());
      service['_statusBar'] = statusBarSpy;
      await service.setStatusBarStyleLight();
      expect(statusBarSpy.setBackgroundColor).toHaveBeenCalledWith({
        color: '#ffffff',
      });
      expect(statusBarSpy.setStyle).toHaveBeenCalledWith({style: Style.Light});
    });
  });

  describe('fetchUrlThroughNavigation', () => {
    let subscriptionMock;
    let mockData;
    beforeEach(() => {
      subscriptionMock = new Subscription();
      mockData = {
        paramId: '123',
        url: '/accounts/account-details/123/info',
      };
    });
    describe('When routerSubject$ would be null', () => {
      beforeEach(() => {
        spyOn(service, 'getIsWeb').and.returnValue(true);
        spyOn(service, 'setQueryParam');
      });
      it('When fetchUrlThroughNavigation returns not undefined', () => {
        const observable = of({
          id: 1,
          url: '/accounts/account-details/123/info',
        });
        spyOn(observable, 'subscribe').and.callFake(f => {
          f({
            id: 1,
            url: '/accounts/account-details/123/info',
          });
          return subscriptionMock;
        });
        routerSpy.events.pipe.and.returnValue(observable);
        service.fetchUrlThroughNavigation(3).subscribe(data => {
          expect(data).toEqual(mockData);
          expect(service.getIsWeb).toHaveBeenCalled();
          expect(service.setQueryParam).toHaveBeenCalled();
          expect(service['subscription'].add).toHaveBeenCalledWith(
            subscriptionMock
          );
        });
      });
      it('When fetchUrlThroughNavigation returns null', () => {
        const observable = of({
          id: 1,
          url: '/accounts/account-details',
        });
        spyOn(observable, 'subscribe').and.callFake(f => {
          f({
            id: 1,
            url: '/accounts/account-details',
          });
          return subscriptionMock;
        });
        routerSpy.events.pipe.and.returnValue(observable);
        service.fetchUrlThroughNavigation(3).subscribe(data => {
          expect(service.setQueryParam).not.toHaveBeenCalled();
          expect(data).toEqual(null);
        });
      });
    });
    it('When routerSubject$ would not be null', () => {
      spyOn(service, 'getIsWeb');
      const sub = new ReplaySubject<NavigationModel>();
      sub.next(mockData);
      service['routerSubject$'] = sub;
      service.fetchUrlThroughNavigation(3).subscribe(data => {
        expect(data).toEqual(mockData);
        expect(service.getIsWeb).not.toHaveBeenCalled();
        expect(service['subscription'].add).not.toHaveBeenCalled();
      });
    });
  });

  describe('setQueryParam', () => {
    it('should set queryParam', () => {
      service['queryParam'] = undefined;
      service.setQueryParam('journeyType=all');
      expect(service['queryParam']).toEqual('journeyType=all');
    });
  });

  describe('getQueryParam', () => {
    it('should return queryParam', () => {
      service['queryParam'] = 'journeyType=all';
      const result = service.getQueryParam();
      expect(result).toEqual('journeyType=all');
    });
  });

  describe('scrollToTop', () => {
    let topmostElement;
    let nativeElementSpy;
    beforeEach(() => {
      nativeElementSpy = jasmine.createSpyObj('nativeElement', [
        'scrollIntoView',
      ]);
      topmostElement = {
        nativeElement: nativeElementSpy,
      } as ElementRef;
    });
    it('should call scrollIntoView', () => {
      service.scrollToTop(topmostElement);
      expect(nativeElementSpy.scrollIntoView).toHaveBeenCalled();
    });
  });

  describe('setSuppressHeaderFooter', () => {
    it('should call next on suppressHeaderFooter', () => {
      spyOn(service['suppressHeaderFooter'], 'next');
      service.setSuppressHeaderFooter(false);
      expect(service['suppressHeaderFooter'].next).toHaveBeenCalledWith(false);
    });
  });

  describe('getSuppressHeaderFooter', () => {
    it('should call next on suppressHeaderFooter', () => {
      const suppressHeaderFooterSpy = jasmine.createSpyObj(
        'suppressHeaderFooter',
        ['']
      );
      service['suppressHeaderFooter'] = suppressHeaderFooterSpy;
      const result = service.getSuppressHeaderFooter();
      expect(result).toEqual(suppressHeaderFooterSpy);
    });
  });

  describe('replaceCurrentYear', () => {
    it('should replace ${currentYear} with the current year', () => {
      const year = new Date().getFullYear();
      const str = 'abc${currentYear} 123';
      const result = service.replaceCurrentYear(str);
      expect(result).toEqual(str.replace('${currentYear}', year.toString()));
    });
  });

  describe('isMyVoyaUrl', () => {
    it('should return true if endpoint includes myvoya and not myvoyage', () => {
      const result = service.isMyVoyaUrl('https://123/myvoya/ws/ers');
      expect(result).toEqual(true);
    });

    it('should return false if endpoint includes myvoya and myvoyage', () => {
      const result = service.isMyVoyaUrl('https://123/myvoyage/ws/ers');
      expect(result).toEqual(false);
    });

    it('should return false if endpoint does not include myvoya or myvoyage', () => {
      const result = service.isMyVoyaUrl('https://123/ws/ers');
      expect(result).toEqual(false);
    });
  });

  describe('getPlatformResume', () => {
    it('should return platform resume observable', () => {
      const result = service.getPlatformResume();
      expect(result).toEqual(platformSpy.resume);
    });
  });

  describe('getmyvoyaBaseUrl', () => {
    beforeEach(() => {
      service['environment'] = {
        production: true,
        baseUrl: '/',
        tokenBaseUrl: 'https://token.intg.app.voya.com/',
        myvoyaBaseUrl: 'https://myvoya-web.intg.voya.com/',
        loginBaseUrl: 'https://login.intg.voya.com/',
        savviBaseUrl: 'https://myhealthwealth.intg.voya.com/',
        firebaseConfig: {
          apiKey: 'AIzaSyA1rqtineGMBei3LKwgbvAj80YSXB7mSDw',
          authDomain: 'myvoyage-intg.firebaseapp.com',
          projectId: 'myvoyage-intg',
          storageBucket: 'myvoyage-intg.appspot.com',
          messagingSenderId: '143111284908',
          appId: '1:143111284908:web:0773ef5d5b027651dc1709',
          measurementId: 'G-SKZE188BBR',
        },
        qualtricsStartupUrl:
          'https://znb3ifcu3urc2bkmk-voyafinancial.siteintercept.qualtrics.com/SIE/',
        logoutUrl:
          'https://login.intg.voya.com/oidcop/sps/authsvc?PolicyId=urn:ibm:security:authentication:asf:oidc_logout&oidc_op=oidc_op_voya_customer_web',
      } as Environment;
    });
    it('should return cdn url', () => {
      const result = service.getmyvoyaBaseUrl();
      expect(result).toEqual(service['environment'].myvoyaBaseUrl);
    });
  });

  describe('navigateByUrl', () => {
    it('should call navigateByUrl function of router', () => {
      service.navigateByUrl('home');
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('home');
    });
  });

  describe('getMyVoyaDomain', () => {
    beforeEach(() => {
      service['environment'] = {
        production: false,
        baseUrl: 'http://localhost:4201/',
        tokenBaseUrl: 'https://token.intg.app.voya.com/',
        myvoyaBaseUrl: 'http://localhost:4201/',
        loginBaseUrl: 'http://localhost:4201/',
        myVoyaDomain: 'http://localhost:4202/',
        savviBaseUrl: 'https://myhealthwealth.intg.voya.com/',
        tpaPrefix: 'LOCAL-',
        tpaSdk: '1a1d68b8-93c1-41ac-bced-16d1624c527f',
        firebaseConfig: {
          apiKey: 'AIzaSyA1rqtineGMBei3LKwgbvAj80YSXB7mSDw',
          authDomain: 'myvoyage-intg.firebaseapp.com',
          projectId: 'myvoyage-intg',
          storageBucket: 'myvoyage-intg.appspot.com',
          messagingSenderId: '143111284908',
          appId: '1:143111284908:web:0773ef5d5b027651dc1709',
          measurementId: 'G-SKZE188BBR',
        },
        qualtricsStartupUrl:
          'https://znb3ifcu3urc2bkmk-voyafinancial.siteintercept.qualtrics.com/SIE/',
        logoutUrl:
          'https://login.intg.voya.com/oidcop/sps/authsvc?PolicyId=urn:ibm:security:authentication:asf:oidc_logout&oidc_op=oidc_op_voya_customer_web',
      };
    });
    it('should replace myVoyaBase URL with myVoyaDomain', () => {
      const url = 'http://localhost:4201/Testing';
      const myvoyaDoaminUrl = 'http://localhost:4202/Testing';
      const result = service.getMyVoyaDomain(url);
      expect(result).toEqual(myvoyaDoaminUrl);
    });
    it('should replace myVoyaBase URL with myVoyaDomain', () => {
      const myvoyaDoaminUrl = 'http://localhost:4202/';
      const result = service.getMyVoyaDomain();
      expect(result).toEqual(myvoyaDoaminUrl);
    });
  });

  describe('bypassSecurityTrustResourceUrl', () => {
    beforeEach(() => {
      domSanitizerSpy.bypassSecurityTrustResourceUrl.and.returnValue({
        changingThisBreaksApplicationSecurity: '/iframe_login.html',
      });
    });
    it('should call bypassSecurityTrustResourceUrl of sanitizer', () => {
      const result = service.bypassSecurityTrustResourceUrl(
        '/iframe_login.html'
      );
      expect(
        domSanitizerSpy.bypassSecurityTrustResourceUrl
      ).toHaveBeenCalledWith('/iframe_login.html');
      expect(result).toEqual({
        changingThisBreaksApplicationSecurity: '/iframe_login.html',
      });
    });
  });

  describe('getQueryParams', () => {
    let queryParamsMap: Record<string, string> = {};
    let urlParam: string;
    let mockUrl: string;
    beforeEach(() => {
      mockUrl =
        'https://myvoyage.voya.com/myvoyageui/assets/html/redirect.html?source=email&redirect_route=/home/guidelines';
      urlParam = 'source=email&redirect_route=/home/guidelines';
      queryParamsMap = {};
      urlParam.split('&').forEach(item => {
        const itemArr = item.split('=');
        queryParamsMap[itemArr[0]] = itemArr[1];
      });
    });
    it('should iterate urlParamArr and if url includes &, split url and return queryParamsMap', () => {
      mockUrl =
        'https://myvoyage.voya.com/myvoyageui/assets/html/redirect.html?source=email&redirect_route=/home/guidelines';
      urlParam = 'source=email&redirect_route=/home/guidelines';
      queryParamsMap = {
        source: 'email',
        redirect_route: '/home/guidelines',
      };
      const result = service.getQueryParams(mockUrl);
      expect(result).toEqual(queryParamsMap);
    });
    it('should iterate urlParamArr and if url includes =, split url and return queryParamsMap', () => {
      mockUrl =
        'https://myvoyage.voya.com/myvoyageui/assets/html/redirect.html?source=email';
      urlParam = 'source=email';
      queryParamsMap = {
        source: 'email',
      };
      const result = service.getQueryParams(mockUrl);
      expect(result).toEqual(queryParamsMap);
    });
    it('should iterate urlParamArr and if url not includes = and &, return empty queryParamsMap', () => {
      mockUrl =
        'https://myvoyage.voya.com/myvoyageui/assets/html/redirect.html';
      urlParam = '';
      queryParamsMap = {};
      const result = service.getQueryParams(mockUrl);
      expect(result).toEqual(queryParamsMap);
    });
    it('should iterate urlParamArr and if url includes &, split url and return queryParamsMap', () => {
      mockUrl =
        'https://myvoyage.voya.com/myvoyageui/assets/html/redirect.html?param2=test&redirect_route=/journeys/journey/1/steps?journeyType=all';
      urlParam =
        'param2=test&redirect_route=/journeys/journey/1/steps?journeyType=all';
      queryParamsMap = {
        param2: 'test',
        redirect_route: '/journeys/journey/1/steps?journeyType=all',
      };
      const result = service.getQueryParams(mockUrl);
      expect(result).toEqual(queryParamsMap);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      service.ngOnDestroy();
      expect(service['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });
});
