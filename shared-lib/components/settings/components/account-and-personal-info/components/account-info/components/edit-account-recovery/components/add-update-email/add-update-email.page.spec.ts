import {of} from 'rxjs';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {AccountInfoService} from '@shared-lib/services/account-info/account-info.service';
import {UpdateEmailPageText} from '../../models/edit-account.model';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import * as pageText from './constants/displayText.json';
import {AddUpdateEmailPage} from './add-update-email.page';
import {Router} from '@angular/router';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';

describe('AddUpdateEmailPage', () => {
  let component: AddUpdateEmailPage;
  let fixture: ComponentFixture<AddUpdateEmailPage>;
  const displayText: UpdateEmailPageText = (pageText as any).default;
  let headerTypeServiceSpy;
  let router;
  let accountInfoServiceSpy;
  let fetchSpy;
  let actionOption: ActionOptions;

  beforeEach(
    waitForAsync(() => {
      headerTypeServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'publish',
      ]);
      router = {
        navigateByUrl: jasmine.createSpy('navigate'),
      };
      accountInfoServiceSpy = jasmine.createSpyObj('AccountInfoService', [
        'getScreenMessage',
        'getAccountRecovery',
      ]);
      actionOption = {
        headername: '',
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
      TestBed.configureTestingModule({
        declarations: [AddUpdateEmailPage],
        imports: [HttpClientModule, RouterTestingModule, IonicModule.forRoot()],
        providers: [
          {provide: AccountInfoService, useValue: accountInfoServiceSpy},
          {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
          {provide: Router, useValue: router},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(AddUpdateEmailPage);
      component = fixture.componentInstance;
      fetchSpy = spyOn(component, 'fetchRecoveryData');
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

  describe('ngOnInit', () => {
    it('should publish header and call fetchRecoveryData', () => {
      component.ngOnInit();
      expect(headerTypeServiceSpy.publish).toHaveBeenCalledWith({
        type: HeaderType.navbar,
        actionOption: actionOption,
      });
      expect(component.fetchRecoveryData).toHaveBeenCalledWith();
    });
  });

  describe('fetchRecoveryData', () => {
    let accountRecoveryData;
    beforeEach(() => {
      fetchSpy.and.callThrough();
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
    });
    it('should call getRecoveryInfo from accountInfoservice and when there is email id available, should change the header text to update email address', () => {
      accountRecoveryData.security.accountRecoveryInfo = {
        primaryRecoveryMethod: 'email',
        email: 'abc@xyz.com',
      };
      component.addEmail = true;
      component.accountRecoveryData = undefined;
      component.fetchRecoveryData();

      expect(accountInfoServiceSpy.getAccountRecovery).toHaveBeenCalled();
      expect(component.accountRecoveryData).toEqual(accountRecoveryData);
      expect(component.addEmail).toEqual(false);
      expect(component.actionOption.headername).toEqual(
        'Update Recovery Email'
      );
    });

    it('should call getRecoveryInfo from accountInfoservice and when there is  no email id available, should change the header text to add email address', () => {
      accountRecoveryData.security.accountRecoveryInfo = {
        primaryRecoveryMethod: 'mobile',
        mobile: '111111111',
      };
      component.addEmail = false;
      component.accountRecoveryData = undefined;
      component.fetchRecoveryData();
      expect(accountInfoServiceSpy.getAccountRecovery).toHaveBeenCalled();
      expect(component.accountRecoveryData).toEqual(accountRecoveryData);
      expect(component.addEmail).toEqual(true);
      expect(component.actionOption.headername).toEqual('Add Recovery Email');
    });

    describe('valueChanged', () => {
      it('should change the value of email var', () => {
        const email = 'abc@xyz.com';
        component.email = undefined;
        component.valueChanged(email);
        expect(component.email).toEqual(email);
      });
    });

    describe('goBack', () => {
      it('should redirect to account-and-info page', () => {
        component.goBack();
        expect(router.navigateByUrl).toHaveBeenCalledWith(
          '/settings/account-and-personal-info/account-info/edit-account-recovery'
        );
      });
    });

    describe('ngOnDestroy', () => {
      it('should unsubscribe', () => {
        component.ngOnDestroy();
        expect(
          component.recoveryDataSubscription.unsubscribe
        ).toHaveBeenCalled();
      });
    });
  });
});
