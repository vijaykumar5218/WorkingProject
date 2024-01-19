import {of} from 'rxjs';
import {AccountInfoService} from '@shared-lib/services/account-info/account-info.service';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {EditAccountRecoveryPage} from './edit-account-recovery.page';
import {Router} from '@angular/router';
import * as pageText from './constants/recoveryText.json';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';

describe('EditAccountRecoveryPage', () => {
  let component: EditAccountRecoveryPage;
  let fixture: ComponentFixture<EditAccountRecoveryPage>;
  let headerTypeServiceSpy;
  let router;
  let fetchSpy;
  let fetchRecoverySpy;
  let accountInfoServiceSpy;
  const displayText: any = JSON.parse(JSON.stringify(pageText)).default;

  beforeEach(
    waitForAsync(() => {
      headerTypeServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'publish',
      ]);
      router = {
        navigateByUrl: jasmine.createSpy('navigate'),
      };
      accountInfoServiceSpy = jasmine.createSpyObj('accountServiceSpy', [
        'getScreenMessage',
        'getAccountRecovery',
        'formatPhoneNumber',
      ]);
      TestBed.configureTestingModule({
        declarations: [EditAccountRecoveryPage],
        imports: [HttpClientModule, RouterTestingModule, IonicModule.forRoot()],
        providers: [
          {provide: AccountInfoService, useValue: accountInfoServiceSpy},
          {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
          {provide: Router, useValue: router},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(EditAccountRecoveryPage);
      component = fixture.componentInstance;
      fetchSpy = spyOn(component, 'fetchScreenContent');
      fetchRecoverySpy = spyOn(component, 'fetchRecoveryData');
      component.moreContentSubscription = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
      ]);
      component.recoveryDataSubscription = jasmine.createSpyObj(
        'Subscription',
        ['unsubscribe']
      );
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ionViewWillEnter', () => {
    it(' should publish header', () => {
      const actionOption: ActionOptions = {
        headername: displayText.actionOption.header,
        btnleft: true,
        btnright: true,
        buttonLeft: {
          name: '',
          link: displayText.actionOption.buttonLeft,
        },
        buttonRight: {
          name: '',
          link: displayText.actionOption.buttonRight,
        },
      };
      component.ionViewWillEnter();
      expect(headerTypeServiceSpy.publish).toHaveBeenCalledWith({
        type: HeaderType.navbar,
        actionOption: actionOption,
      });
    });
  });

  describe('goBack', () => {
    it('should redirect to account-and-info page', () => {
      component.goBack();
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        '/settings/account-and-personal-info'
      );
    });
  });

  describe('ngOnInit', () => {
    it('should call fetchScreenContent function', () => {
      component.ngOnInit();
      expect(component.fetchScreenContent).toHaveBeenCalled();
    });
  });

  describe('fetchScreenContent', () => {
    let message;
    beforeEach(() => {
      fetchSpy.and.callThrough();
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
      accountInfoServiceSpy.getScreenMessage.and.returnValue(of(message));
    });

    it('should call getScreenMessage from accountInfoService and return message', async () => {
      component.screenMessage = undefined;
      await component.fetchScreenContent();
      expect(accountInfoServiceSpy.getScreenMessage).toHaveBeenCalled();
      expect(component.screenMessage).toEqual(message);
    });
  });

  describe('fetchRecoveryData', () => {
    let accountRecoveryData;
    beforeEach(() => {
      fetchRecoverySpy.and.callThrough();
      accountRecoveryData = {
        login: {
          userName: 'abc',
          passwordLastChangedDate: '01/01/2022',
          canEditInfo: true,
        },
        security: {
          accountRecoveryInfo: {},
          additionalLinks: [],
        },
      };
      accountInfoServiceSpy.getAccountRecovery.and.returnValue(
        of(accountRecoveryData)
      );
      accountInfoServiceSpy.formatPhoneNumber.and.returnValue('111-111-1111');
    });
    it('should call getRecoveryInfo from accountInfoservice and when there is no mobile value, should change the status text to add', () => {
      accountRecoveryData.security.accountRecoveryInfo = {
        primaryRecoveryMethod: 'email',
        email: 'abc@xyz.com',
      };
      component.addMobile = undefined;
      component.addEmail = undefined;
      component.fetchRecoveryData();
      expect(accountInfoServiceSpy.getAccountRecovery).toHaveBeenCalled();
      expect(component.accountRecoveryData).toEqual(accountRecoveryData);
      expect(component.addMobile).toEqual(true);
      expect(component.addEmail).toEqual(false);
    });

    it('should call getRecoveryInfo from accountInfoservice  and when there is no email value, should change the status text to add', () => {
      accountRecoveryData.security.accountRecoveryInfo = {
        primaryRecoveryMethod: 'mobile',
        mobile: '1111111111',
      };
      component.addMobile = undefined;
      component.addEmail = undefined;
      component.fetchRecoveryData();
      expect(accountInfoServiceSpy.getAccountRecovery).toHaveBeenCalled();
      expect(accountInfoServiceSpy.formatPhoneNumber).toHaveBeenCalled();
      expect(component.accountRecoveryData).toEqual(accountRecoveryData);
      expect(component.addMobile).toEqual(false);
      expect(component.addEmail).toEqual(true);
      expect(component.mobile).toEqual('111-111-1111');
    });
  });

  describe('updateContent', () => {
    it('should redirect to edit mobile page, if type==="mobile"', () => {
      component.updateContent('mobile');
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        '/settings/account-and-personal-info/account-info/edit-account-recovery/add-update-mobile'
      );
    });

    it('should redirect to edit email page, if type==="email"', () => {
      component.updateContent('email');
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        '/settings/account-and-personal-info/account-info/edit-account-recovery/add-update-email'
      );
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      component.ngOnDestroy();
      expect(component.moreContentSubscription.unsubscribe).toHaveBeenCalled();
      expect(component.recoveryDataSubscription.unsubscribe).toHaveBeenCalled();
    });
  });
});
