import {
  MoreDescription,
  AccountRecovery,
} from '@shared-lib/services/account-info/models/account-and-personal-info.model';
import {RouterTestingModule} from '@angular/router/testing';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {AccountInfoService} from './account-info.service';
import {AccountService} from '@shared-lib/services/account/account.service';
import {endPoints} from './constants/endpoints';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';

describe('AccountInfoService', () => {
  let service: AccountInfoService;
  const endpoints: Record<string, string> = endPoints;

  const accountServiceSpy = jasmine.createSpyObj('AccountService', [
    'getPrepObject',
  ]);
  const baseServiceSpy = jasmine.createSpyObj('baseServiceSpy', [
    'get',
    'post',
  ]);

  let utilityServiceSpy;

  beforeEach(() => {
    utilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
      'appendBaseUrlToEndpoints',
    ]);
    utilityServiceSpy.appendBaseUrlToEndpoints.and.callFake(
      endpoints => endpoints
    );
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        {provide: BaseService, useValue: baseServiceSpy},
        {provide: AccountService, useValue: accountServiceSpy},
        {provide: SharedUtilityService, useValue: utilityServiceSpy},
      ],
    });
    service = TestBed.inject(AccountInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      service['subscription'] = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
      ]);
      service.ngOnDestroy();
      expect(service['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });

  describe('getAccountRecovery', () => {
    let accountRecoveryData: AccountRecovery;
    beforeEach(() => {
      accountRecoveryData = {
        login: {
          userName: 'abc',
          passwordLastChangedDate: '01/01/2022',
          canEditInfo: true,
        },
        security: {
          accountRecoveryInfo: {
            primaryRecoveryMethod: 'email',
            mobile: '12323123',
            email: 'abc@xyz.com',
          },
          additionalLinks: [],
        },
      };
    });

    it('get account recovery data', done => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(accountRecoveryData));
      service.getAccountRecovery().subscribe(result => {
        expect(result).toEqual(accountRecoveryData);
        expect(baseServiceSpy.get).toHaveBeenCalledWith(
          'myvoya/ws/ers/service/customers/272c2587-6b79-d874-e053-d22aac0a0939/profile/loginInfo'
        );
        done();
      });
    });

    it('should load account recovery data and force refresh it', async () => {
      baseServiceSpy.get.calls.reset();
      baseServiceSpy.get.and.returnValue(Promise.resolve(accountRecoveryData));

      service.getAccountRecovery().subscribe(data => {
        expect(data).toEqual(accountRecoveryData);
        expect(baseServiceSpy.get).toHaveBeenCalledWith(
          'myvoya/ws/ers/service/customers/272c2587-6b79-d874-e053-d22aac0a0939/profile/loginInfo'
        );
      });

      baseServiceSpy.get.and.returnValue(Promise.resolve(accountRecoveryData));

      service.getAccountRecovery(true).subscribe(data => {
        expect(data).toEqual(accountRecoveryData);
        expect(baseServiceSpy.get).toHaveBeenCalledWith(
          'myvoya/ws/ers/service/customers/272c2587-6b79-d874-e053-d22aac0a0939/profile/loginInfo'
        );
        expect(baseServiceSpy.get).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('getScreenMessage', () => {
    let message: MoreDescription;
    beforeEach(() => {
      message = {
        HealthCoachHeader: 'Health Coach',
        AccountRecoveryDisclosure:
          '<p>Do you use a Financial Aggregation Service?<br />\r\nIf you use an aggregation service such as CashEdge or Personal Capital, you may receive verification code(s) via text or email when your provider accesses this account. If you receive a code, please go to your aggregation service site and reconnect to this account to ensure continued access by your provider.</p>\r\n',
        TimetapURL:
          '<p><a href="https://fpcconsultants.timetap.com/#/" target="_blank">https://fpcconsultants.timetap.com/#/</a></p>\r\n',
        WealthCoachHeader: 'Wealth Coach',
        HealthCoachDesc:
          'Schedule time with a professional today. Same-day appointments are available.\r\n',
        ContactCoachDisclosure: 'TBD',
        WealthCoachDesc:
          'Schedule time with a professional today. Same-day appointments are available.',
      };
    });

    it('return profile data', async () => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(message));

      service.getScreenMessage().subscribe(data => {
        expect(data).toEqual(message);
        expect(baseServiceSpy.get).toHaveBeenCalledWith(
          'myvoyage/ws/ers/content/section/more'
        );
      });
    });

    it('should load profile data and force refresh it', async () => {
      baseServiceSpy.get.calls.reset();
      baseServiceSpy.get.and.returnValue(Promise.resolve(message));

      service.getScreenMessage().subscribe(data => {
        expect(data).toEqual(message);
        expect(baseServiceSpy.get).toHaveBeenCalledWith(
          'myvoyage/ws/ers/content/section/more'
        );
      });

      baseServiceSpy.get.and.returnValue(Promise.resolve(message));

      service.getScreenMessage(true).subscribe(data => {
        expect(data).toEqual(message);
        expect(baseServiceSpy.get).toHaveBeenCalledWith(
          'myvoyage/ws/ers/content/section/more'
        );
        expect(baseServiceSpy.get).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('saveEmail', () => {
    it('should call baseService psost with payload for new email', () => {
      service.saveEmail('test@test.com', null);
      expect(baseServiceSpy.post).toHaveBeenCalledWith(endpoints.saveContact, {
        primaryEmail: {
          email: 'test@test.com',
        },
      });
    });

    it('should call baseService psost with payload for existing email', () => {
      service.saveEmail('test@test.com', 'abc-123');
      expect(baseServiceSpy.post).toHaveBeenCalledWith(endpoints.saveContact, {
        primaryEmail: {
          partyContactId: 'abc-123',
          email: 'test@test.com',
        },
      });
    });
  });

  describe('savePhone', () => {
    it('should call baseService psost with payload for new phone', () => {
      service.savePhone('1111111111', null);
      expect(baseServiceSpy.post).toHaveBeenCalledWith(endpoints.saveContact, {
        mobilePhone: {
          phoneNumber: '1111111111',
        },
      });
    });

    it('should call baseService psost with payload for existing phone', () => {
      service.savePhone('1111111111', 'abc-123');
      expect(baseServiceSpy.post).toHaveBeenCalledWith(endpoints.saveContact, {
        mobilePhone: {
          partyContactId: 'abc-123',
          phoneNumber: '1111111111',
        },
      });
    });
  });

  describe('phoneNumber', () => {
    it('should return empty string if the input is empty', () => {
      const res = service.formatPhoneNumber('');
      expect(res).toEqual('');
    });
    it('should return empty string if the input is null', () => {
      const res = service.formatPhoneNumber(null);
      expect(res).toEqual('');
    });
    it('should format the phone number ', () => {
      const phone = '1111111111';
      const res = service.formatPhoneNumber(phone);
      expect(res).toEqual('111-111-1111');
    });
  });
});
