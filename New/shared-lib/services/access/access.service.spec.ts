import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TestBed, waitForAsync} from '@angular/core/testing';
import {SESSION_TIMEOUT_DURATION} from '../account/account.service';
import {BaseService} from '../base/base-factory-provider';
import {SharedUtilityService} from '../utility/utility.service';
import {AccessService} from './access.service';
import {AccessResult} from './models/access.model';

describe('AccessService', () => {
  let utilityServiceSpy;
  let service: AccessService;
  let baseServiceSpy;
  let mockAccessData: AccessResult;

  beforeEach(
    waitForAsync(() => {
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy ', [
        'appendBaseUrlToEndpoints',
      ]);
      utilityServiceSpy.appendBaseUrlToEndpoints.and.callFake(
        endpoints => endpoints
      );
      baseServiceSpy = jasmine.createSpyObj('baseServiceSpy', ['get', 'post']);
      mockAccessData = {
        clientId: 'KOHLER',
        clientDomain: 'kohler.intg.voya.com',
        clientName: 'Kohler Co. 401(k) Savings Plan',
        planIdList: [
          {
            planId: '623040',
          },
        ],
        firstTimeLoginWeb: true,
        currentPlan: {
          planId: '623040',
        },
        enableMyVoyage: 'N',
        isHealthOnly: false,
        myProfileURL: 'https%3A%2F%2Flogin.intg.voya',
        firstTimeLogin: false,
        enableBST: 'Y',
        enableTPA: 'N',
        enableCoverages: false,
      };

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          AccessService,
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: BaseService, useValue: baseServiceSpy},
        ],
      });
      service = TestBed.inject(AccessService);
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('constructor', () => {
    it('should append the base url to the endpoints', () => {
      expect(utilityServiceSpy.appendBaseUrlToEndpoints).toHaveBeenCalled();
    });
  });

  describe('checkMyvoyageAccess', () => {
    let access;

    beforeEach(() => {
      access = {
        clientDomain: 'domain',
        clientId: 'id',
        clientName: 'name',
        enableMyVoyage: 'Y',
        myProfileURL: 'https://test.profile.link',
        planIdList: [{planId: '623043'}],
        currentPlan: {planId: '623043'},
        isMxUser: true,
        partyId: '222d0d23-7786-0dcf-e053-d22aac0a9e36',
      };
    });

    it('should call baseService get if data is not already set', async () => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(access));
      service['accessResult'] = undefined;
      const result = await service.checkMyvoyageAccess();
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/ws/ers/service/myvoyageenabled'
      );
      expect(result).toEqual(access);
    });

    it('should call baseService get if data is already set and refresh passed', async () => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(access));
      service['accessResult'] = access;
      const result = await service.checkMyvoyageAccess(true);
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/ws/ers/service/myvoyageenabled'
      );
      expect(result).toEqual(access);
    });

    it('should not call baseService get if data is already set', async () => {
      service['accessResult'] = access;
      const result = await service.checkMyvoyageAccess();
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
      expect(result).toEqual(access);
    });
  });

  describe('checkWorkplaceAccess', () => {
    const workplaceAccessResult = {
      myWorkplaceDashboardEnabled: true,
    };
    const myVoyageEnabledRes: any = {
      clientDomain: 'domain',
      clientId: 'id',
      clientName: 'name',
      enableMyVoyage: 'Y',
      myProfileURL: 'https://test.profile.link',
      planIdList: [{planId: '623043'}],
      currentPlan: {planId: '623043'},
      isMxUser: true,
      myWorkplaceDashboardEnabled: true,
    };

    it('should call checkMyvoyageAccess to get workplaceEnabled flag if workplaceAccessResult is not already set', async () => {
      service['workplaceAccessResult'] = undefined;
      spyOn(service, 'checkMyvoyageAccess').and.returnValue(
        Promise.resolve(myVoyageEnabledRes)
      );
      const result = await service.checkWorkplaceAccess();
      expect(service.checkMyvoyageAccess).toHaveBeenCalled();
      expect(result).toEqual(workplaceAccessResult);
    });

    it('should not call checkMyvoyageAccess get if data is already set', async () => {
      spyOn(service, 'checkMyvoyageAccess').and.returnValue(
        Promise.resolve(myVoyageEnabledRes)
      );
      service['workplaceAccessResult'] = workplaceAccessResult;
      const result = await service.checkWorkplaceAccess();
      expect(service.checkMyvoyageAccess).not.toHaveBeenCalled();
      expect(result).toEqual(workplaceAccessResult);
    });

    it('should call checkMyvoyageAccess to get workplaceEnabled if data is already set but refreshed', async () => {
      spyOn(service, 'checkMyvoyageAccess').and.returnValue(
        Promise.resolve(myVoyageEnabledRes)
      );
      service['workplaceAccessResult'] = workplaceAccessResult;
      const result = await service.checkWorkplaceAccess(true);
      expect(service.checkMyvoyageAccess).toHaveBeenCalled();
      expect(result).toEqual(workplaceAccessResult);
    });

    it('if service get failed', async () => {
      spyOn(service, 'checkMyvoyageAccess').and.callFake(() =>
        Promise.reject()
      );
      service['workplaceAccessResult'] = undefined;
      const result = await service.checkWorkplaceAccess();
      expect(service.checkMyvoyageAccess).toHaveBeenCalled();
      expect(result).toEqual({
        myWorkplaceDashboardEnabled: false,
      });
    });
  });

  describe('getSessionId', () => {
    const mockMyvoyageAccess: any = {
      clientDomain: 'voya.com',
      clientId: 'INGWIN',
    };
    beforeEach(() => {
      spyOn(service, 'checkMyvoyageAccess').and.returnValue(
        Promise.resolve(mockMyvoyageAccess)
      );
      spyOn(service, 'initSession').and.returnValue(
        Promise.resolve('Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397')
      );
      spyOn(Storage.prototype, 'setItem');
    });
    describe('when sessionId is not defined in localstorage', () => {
      beforeEach(() => {
        spyOn(Storage.prototype, 'getItem').and.returnValue(undefined);
      });
      it('when accessResult is not passed as param', async () => {
        await service.getSessionId();
        expect(service.checkMyvoyageAccess).toHaveBeenCalled();
        expect(service.initSession).toHaveBeenCalledWith(
          mockMyvoyageAccess.clientDomain,
          mockMyvoyageAccess.clientId
        );
        expect(Storage.prototype.setItem).toHaveBeenCalledWith(
          'sessionId',
          'Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397'
        );
        expect(Storage.prototype.getItem).toHaveBeenCalledWith('sessionId');
      });
      it('when accessResult is passed as param', async () => {
        await service.getSessionId(mockMyvoyageAccess);
        expect(service.checkMyvoyageAccess).not.toHaveBeenCalled();
        expect(service.initSession).toHaveBeenCalledWith(
          mockMyvoyageAccess.clientDomain,
          mockMyvoyageAccess.clientId
        );
        expect(Storage.prototype.setItem).toHaveBeenCalled();
        expect(Storage.prototype.getItem).toHaveBeenCalled();
      });
    });
    it('when sessionId is defined', async () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue(
        'Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397'
      );
      const result = await service.getSessionId();
      expect(service.checkMyvoyageAccess).not.toHaveBeenCalled();
      expect(Storage.prototype.setItem).not.toHaveBeenCalled();
      expect(result).toEqual('Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397');
    });
  });

  describe('initSession', () => {
    let date;
    beforeEach(() => {
      service['currSessionExp'] = Number.MAX_VALUE;

      jasmine.clock().install();
      date = new Date(2013, 9, 23);
      jasmine.clock().mockDate(date);
    });

    it('should call http post and return session if current session null', async () => {
      const domain = 'com.test.dom';
      const clientId = 'CLIENT';
      baseServiceSpy.post.and.returnValue(
        Promise.resolve({
          sessionId: 'aaabbbccc',
        })
      );

      const result = await service.initSession(domain, clientId);

      expect(baseServiceSpy.post).toHaveBeenCalledWith(
        'myvoyage/ws/ers/emvdata/smservice/session',
        {
          sessionInfo: {
            domain: domain,
            newSession: false,
            page: 'MYVOYA',
            clientId: clientId,
            timeoutMinutes: 15,
            application: 'MYVOYASSO',
          },
          allowDuplicate: false,
        }
      );
      expect(result).toEqual('aaabbbccc');
      expect(service['sessionId']).toEqual('aaabbbccc');
      expect(service['currSessionExp']).toEqual(
        date.getTime() + SESSION_TIMEOUT_DURATION
      );
    });

    it('should call not call http post if session id is already set', async () => {
      const domain = 'com.test.dom';
      const clientId = 'CLIENT';
      service['sessionId'] = 'aaabbbccc';
      baseServiceSpy.post.and.returnValue(
        Promise.resolve({
          sessionId: 'cccdddeee',
        })
      );

      const result = await service.initSession(domain, clientId);

      expect(result).toEqual('aaabbbccc');
      expect(baseServiceSpy.post).not.toHaveBeenCalled();
    });

    it('should call http post and return session if current not null and session expired', async () => {
      service['currSessionExp'] = Number.MIN_VALUE;
      service['sessionId'] = 'aaabbbccc';

      const domain = 'com.test.dom';
      const clientId = 'CLIENT';
      baseServiceSpy.post.and.returnValue(
        Promise.resolve({
          sessionId: 'aaabbbccc',
        })
      );

      const result = await service.initSession(domain, clientId);

      expect(baseServiceSpy.post).toHaveBeenCalledWith(
        'myvoyage/ws/ers/emvdata/smservice/session',
        {
          sessionInfo: {
            domain: domain,
            newSession: false,
            page: 'MYVOYA',
            clientId: clientId,
            timeoutMinutes: 15,
            application: 'MYVOYASSO',
          },
          allowDuplicate: false,
        }
      );
      expect(result).toEqual('aaabbbccc');
      expect(service['sessionId']).toEqual('aaabbbccc');
    });

    it('should not set session id if the result is null', async () => {
      service['sessionId'] = null;
      const domain = 'com.test.dom';
      const clientId = 'CLIENT';
      baseServiceSpy.post.and.returnValue(Promise.resolve(null));

      await service.initSession(domain, clientId);
      expect(service['sessionId']).toEqual(null);
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });
  });

  describe('isMyWorkplaceDashboardEnabled', () => {
    it('When it returns true', done => {
      service['myWorkplaceDashboardEnabled$'].next(true);
      service.isMyWorkplaceDashboardEnabled().subscribe(data => {
        expect(data).toEqual(true);
        done();
      });
    });
    it('When it returns false', done => {
      service['myWorkplaceDashboardEnabled$'].next(false);
      service.isMyWorkplaceDashboardEnabled().subscribe(data => {
        expect(data).toEqual(false);
        done();
      });
    });
  });
  describe('checkLastPreferenceUpdated', () => {
    let preference;
    beforeEach(() => {
      mockAccessData.enableMyVoyage = 'Y';
      spyOn(service, 'checkMyvoyageAccess').and.returnValue(
        Promise.resolve(mockAccessData)
      );
      preference = {
        required: false,
        primaryEmail: {
          lastUpdatedDate: '2023-03-29T21:01:27',
          partyContactId: '70720357-e465-450a-a658-e9a1025913d6',
          email: 'jeni.anna@voya.com',
          lastFailedInd: 'N',
        },
        secondaryEmailAllowed: false,
        docDeliveryEmailContactId: '70720357-e465-450a-a658-e9a1025913d6',
        mobilePhone: {
          lastUpdatedDate: '2022-05-24T20:32:10',
          partyContactId: '15a2fbad-ff98-4baf-bfd7-c77d729165b8',
          phoneNumber: '1111111111',
        },
        lastPreferenceResponse: true,
        insightsNotificationPrefs: {},
        highPrioitytNotificationPrefs: {},
        accountAlertPrefs: {},
      };
    });

    it('should call baseService get if data is not already set', async () => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(preference));
      service['accessResult'] = undefined;
      mockAccessData.enableMyVoyage = 'Y';
      const result = await service.checkLastPreferenceUpdated();
      expect(service.checkMyvoyageAccess).toHaveBeenCalled();
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/ws/ers/service/person/lastPreferenceUpdated'
      );
      expect(result).toEqual(preference);
    });

    it('should not call baseService get if myVoyage is not enabled', async () => {
      service['lastPrefUpdatedResult'] = preference;
      mockAccessData.enableMyVoyage = 'N';
      const result = await service.checkLastPreferenceUpdated();
      expect(service.checkMyvoyageAccess).toHaveBeenCalled();
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
      expect(result).toEqual(preference);
    });

    it('should not call baseService get if data is already set', async () => {
      service['lastPrefUpdatedResult'] = preference;
      const result = await service.checkLastPreferenceUpdated();
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
      expect(result).toEqual(preference);
    });
  });
});
