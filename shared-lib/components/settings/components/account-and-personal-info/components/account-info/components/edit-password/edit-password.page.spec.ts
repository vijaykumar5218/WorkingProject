import {AlertComponent} from '@shared-lib/components/alert/alert.component';
import {AccountRecovery} from '@shared-lib/services/account-info/models/account-and-personal-info.model';
import {of} from 'rxjs';
import {AccountInfoService} from '@shared-lib/services/account-info/account-info.service';
import {ReactiveFormsModule} from '@angular/forms';
import {EditPasswordPage} from './edit-password.page';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';
import {Router} from '@angular/router';
import {DisplayText} from './models/edit-password.model';
import * as pageText from './constants/displayText.json';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';

describe('EditDisplayNamePage', () => {
  const displayText: DisplayText = (pageText as any).default;
  let component: EditPasswordPage;
  let fixture: ComponentFixture<EditPasswordPage>;
  let headerTypeServiceSpy;
  let router;
  let accountInfoServiceSpy;
  let fetchRecoverySpy;
  let modalControllerSpy;

  beforeEach(
    waitForAsync(() => {
      headerTypeServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'publish',
      ]);
      router = {
        navigateByUrl: jasmine.createSpy('navigate'),
      };
      accountInfoServiceSpy = jasmine.createSpyObj('accountServiceSpy', [
        'getAccountRecovery',
      ]);
      modalControllerSpy = jasmine.createSpyObj('ModalController', [
        'create',
        'onDidDismiss',
      ]);

      TestBed.configureTestingModule({
        declarations: [EditPasswordPage],
        imports: [
          HttpClientModule,
          RouterTestingModule,
          IonicModule.forRoot(),
          ReactiveFormsModule,
        ],
        providers: [
          {provide: AccountInfoService, useValue: accountInfoServiceSpy},
          {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
          {provide: Router, useValue: router},
          {provide: ModalController, useValue: modalControllerSpy},
        ],
      }).compileComponents();

      //jasmine.DEFAULT_TIMEOUT_INTERVAL = 99999;
      fixture = TestBed.createComponent(EditPasswordPage);
      component = fixture.componentInstance;
      fetchRecoverySpy = spyOn(component, 'fetchRecoveryData');
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ionViewWillEnter', () => {
    it(' should publish header', () => {
      const actionOption: ActionOptions = {
        headername: 'Edit Password',
        btnleft: true,
        btnright: true,
        buttonLeft: {
          name: '',
          link: 'settings/account-and-personal-info',
        },
        buttonRight: {
          name: '',
          link: 'notification',
        },
      };
      component.ionViewWillEnter();
      expect(headerTypeServiceSpy.publish).toHaveBeenCalledWith({
        type: HeaderType.navbar,
        actionOption: actionOption,
      });
      expect(component.fetchRecoveryData).toHaveBeenCalled();
    });
  });

  describe('routeToNotification', () => {
    it('should redirect to notification page', () => {
      component.routeToNotification();
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        '/settings/notification-settings'
      );
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

  describe('toggleShowPassword', () => {
    it('should show password when the value is "old"', () => {
      component.showPassword = false;
      component.toggleShowPassword('old');
      expect(component.showPassword).toEqual(true);
    });

    it('should show password when the value is "new"', () => {
      component.showNewPassword = false;
      component.toggleShowPassword('new');
      expect(component.showNewPassword).toEqual(true);
    });

    it('should show password when the value is "confirm"', () => {
      component.showConfirmPassword = false;
      component.toggleShowPassword('confirm');
      expect(component.showConfirmPassword).toEqual(true);
    });
  });

  describe('fetchRecoveryData', () => {
    let accountRecoveryData: AccountRecovery;
    beforeEach(() => {
      fetchRecoverySpy.and.callThrough();
      accountRecoveryData = {
        login: {
          userName: 'abc',
          passwordLastChangedDate: '01/01/2022',
          canEditInfo: true,
        },
        security: {
          accountRecoveryInfo: {
            primaryRecoveryMethod: 'email',
            email: 'abc@xyz.com',
            mobile: '11111111',
          },
          additionalLinks: [],
        },
      };
      accountInfoServiceSpy.getAccountRecovery.and.returnValue(
        of(accountRecoveryData)
      );
    });
    it('should call getRecoveryInfo from accountInfoservice and when there is no mobile value, should change the status text to add', () => {
      component.accountRecoveryData = undefined;
      component.fetchRecoveryData();
      expect(accountInfoServiceSpy.getAccountRecovery).toHaveBeenCalled();
      expect(component.accountRecoveryData).toEqual(accountRecoveryData);
    });
  });

  describe('passwordChanged', () => {
    it('set password to the value in input field', () => {
      component.password = undefined;
      component.passwordChanged('abc');
      expect(component.password).toEqual('abc');
    });
  });

  describe('submitNewPassword', () => {
    it('should show the alert modal for confirmation of save of password', async () => {
      const modal = jasmine.createSpyObj('HTMLIonModalElement', [
        'present',
        'onDidDismiss',
      ]);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modal));
      modal.onDidDismiss.and.returnValue(Promise.resolve({}));
      await component.submitNewPassword();
      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: AlertComponent,
        cssClass: 'modal-not-fullscreen',
        componentProps: {
          titleMessage: displayText.alert.message,
          imageUrl: displayText.alert.imageUrl,
        },
      });
      expect(modal.present).toHaveBeenCalled();
    });
  });
});
