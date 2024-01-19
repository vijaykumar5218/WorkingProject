import {TestBed, waitForAsync} from '@angular/core/testing';
import {HeaderTypeService} from './header-type.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {of, ReplaySubject} from 'rxjs';
import {WebLogoutService} from '../logout/logout.service';
import {WebQualtricsService} from '../web-qualtrics/web-qualtrics.service';
import {SessionTimeoutService} from '../session-timeout/session-timeout.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {MoreResourcesLinks} from './models/MoreResource.model';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {AccessService} from '@shared-lib/services/access/access.service';

describe('HeaderTypeService', () => {
  let service: HeaderTypeService;
  let sessionTimeoutServiceSpy;
  let logoutServiceSpy;
  let qualtricsSrviceSpy;
  let utilityServiceSpy;
  let accessServiceSpy;
  let baseServiceSpy;
  const resourceLinks: MoreResourcesLinks = {
    resourceLink: {
      label: '',
      id: '',
      subLinks: [
        {
          label:
            "Get Investment Advice <span class='languageTag'>(In English)</span>",
          link:
            '/myvoya/link?type=fe&token=urlResourceType%3DFEISSOLINK%26s%3DH7jGNFykQzy5RdWa4Q07eA11.i9290%26clientId%3DDAIMLR%26vendorId%3DFEI%26d%3D10ec95fe1e8279012923e3cc5345df74b6d0d864',
          popup: false,
          order: 0,
        },
        {
          label: 'TD Ameritrade Account',
          link: 'http://www.tdameritraderetirement.com/',
          popup: false,
          order: 0,
        },
      ],
    },
    dataStatus: '',
  };
  beforeEach(
    waitForAsync(() => {
      sessionTimeoutServiceSpy = jasmine.createSpyObj(
        'sessionTimeoutServiceSpy',
        ['watcherInitiated']
      );
      qualtricsSrviceSpy = jasmine.createSpyObj('qualtricsSrviceSpy', [
        'initialize',
      ]);
      logoutServiceSpy = jasmine.createSpyObj('logoutServiceSpy', [
        'constructLogoutURL',
      ]);
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy ', [
        'appendBaseUrlToEndpoints',
        'backToPrevious',
      ]);
      utilityServiceSpy.appendBaseUrlToEndpoints.and.callFake(
        endpoints => endpoints
      );
      accessServiceSpy = jasmine.createSpyObj('accessServiceSpy', [
        'getSessionId',
      ]);
      baseServiceSpy = jasmine.createSpyObj('baseServiceSpy', ['get']);
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          {provide: WebLogoutService, useValue: logoutServiceSpy},
          {provide: WebQualtricsService, useValue: qualtricsSrviceSpy},
          {provide: SessionTimeoutService, useValue: sessionTimeoutServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: BaseService, useValue: baseServiceSpy},
          {provide: AccessService, useValue: accessServiceSpy},
        ],
      });
      service = TestBed.inject(HeaderTypeService);
      service['subscription'] = jasmine.createSpyObj('subscription', [
        'add',
        'unsubscribe',
      ]);
    })
  );

  describe('getSelectedTab$', () => {
    it('should return the selectedTab$ subscriber', () => {
      service['selectedTab$'] = new ReplaySubject<string>(1);
      const result = service.getSelectedTab$();
      expect(result).toEqual(service['selectedTab$']);
    });
  });

  describe('publishSelectedTab', () => {
    it('should call next on the selectedTab subject', () => {
      service['selectedTab$'] = jasmine.createSpyObj('selectedTab$', ['next']);
      service.publishSelectedTab('selectedTab');
      expect(service['selectedTab$'].next).toHaveBeenCalledWith('selectedTab');
    });
  });

  describe('logoutURLInitialize', () => {
    it('should call constructLogoutURL', () => {
      service.logoutURLInitialize();
      expect(logoutServiceSpy.constructLogoutURL).toHaveBeenCalled();
    });
  });

  describe('qualtricsInitialize', () => {
    it('if feedbackInterceptId arg is defined', () => {
      service.qualtricsInitialize('ZN_b3IFCU3urC2BkMK');
      expect(qualtricsSrviceSpy.initialize).toHaveBeenCalledWith(
        'ZN_b3IFCU3urC2BkMK'
      );
    });
    it('if feedbackInterceptId arg is undefined', () => {
      service.qualtricsInitialize();
      expect(qualtricsSrviceSpy.initialize).toHaveBeenCalledWith(undefined);
    });
  });

  describe('sessionTimeoutWatcherInitiated', () => {
    it('should call watcherInitiated', () => {
      service.sessionTimeoutWatcherInitiated();
      expect(sessionTimeoutServiceSpy.watcherInitiated).toHaveBeenCalled();
    });
  });

  describe('backToPrevious', () => {
    it('should call backToPrevious', () => {
      service.backToPrevious();
      expect(utilityServiceSpy.backToPrevious).toHaveBeenCalled();
    });
  });

  describe('constructMoreResources', () => {
    beforeEach(() => {
      accessServiceSpy.getSessionId.and.returnValue(
        Promise.resolve('Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397')
      );
      baseServiceSpy.get.and.returnValue(Promise.resolve(resourceLinks));
    });

    it('should fetch data', async () => {
      const result = await service['constructMoreResources']();
      expect(accessServiceSpy.getSessionId).toHaveBeenCalled();
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/ws/ers/dashboard/moreResources?sessionID=Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397'
      );
      expect(result).toEqual(resourceLinks);
    });
  });

  describe('getMoreResource', () => {
    it('should call constructMoreResources if data is not already set', () => {
      service['constructMoreResources'] = jasmine
        .createSpy()
        .and.returnValue(Promise.resolve(resourceLinks));
      service['moreResourcesData'] = undefined;
      const result = service.getMoreResource();
      expect(service['constructMoreResources']).toHaveBeenCalled();
      expect(result).toBeTruthy();
    });

    it('should call constructMoreResources if refresh is true', () => {
      service['constructMoreResources'] = jasmine
        .createSpy()
        .and.returnValue(Promise.resolve(resourceLinks));
      service['moreResourcesData'] = of(resourceLinks);
      const result = service.getMoreResource(true);
      expect(service['constructMoreResources']).toHaveBeenCalled();
      expect(result).toBeTruthy();
    });

    it('should not call constructMoreResources if data is already set and refresh is false', () => {
      service['moreResourcesData'] = of(resourceLinks);
      service['constructMoreResources'] = jasmine.createSpy();
      const result = service.getMoreResource();
      expect(service['constructMoreResources']).not.toHaveBeenCalled();
      expect(result).toBeTruthy();
    });

    it('should return the resource links if they are present', done => {
      service['constructMoreResources'] = jasmine
        .createSpy()
        .and.returnValue(Promise.resolve(resourceLinks));
      service['moreResourcesData'] = of(resourceLinks);
      service.getMoreResource().subscribe(data => {
        expect(data).toEqual(resourceLinks);
        done();
      });
    });
  });
});
