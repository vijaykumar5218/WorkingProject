import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {of} from 'rxjs';
import {AccountInfoService} from '@shared-lib/services/account-info/account-info.service';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {UnregisterDevicePage} from './unregister-device.page';
import {Router} from '@angular/router';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';

describe('UnregisterDevicePage', () => {
  let component: UnregisterDevicePage;
  let fixture: ComponentFixture<UnregisterDevicePage>;
  let accountInfoServiceSpy;
  let headerTypeServiceSpy;
  let fetchScreenMessageSpy;
  let router;
  const message = {
    UnregisterDeviceText:
      '{"message":["Keep in mind that if you unregister all devices, you will need to confirm your identity the next time you log in from any device by receiving an entering a verification code. After verifying your identity, you will have the opportunity to register your device, if desired.","Would you like to unregister all devices?"]}',
  };

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
      ]);
      TestBed.configureTestingModule({
        declarations: [UnregisterDevicePage],
        imports: [HttpClientModule, RouterTestingModule, IonicModule.forRoot()],
        providers: [
          {provide: AccountInfoService, useValue: accountInfoServiceSpy},
          {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
          {provide: Router, useValue: router},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(UnregisterDevicePage);
      component = fixture.componentInstance;
      fetchScreenMessageSpy = spyOn(component, 'fetchScreenMessage');
      fixture.detectChanges();
      component.moreContentSubscription = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
      ]);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ionViewWillEnter', () => {
    it(' should publish header', () => {
      const actionOption: ActionOptions = {
        headername: 'Unregister Your Device',
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
    });
  });

  describe('ngOnInit', () => {
    it('should call fetchScreenMessage function onInit', () => {
      component.ngOnInit();
      expect(fetchScreenMessageSpy).toHaveBeenCalled();
    });
  });

  describe('fetchScreenMessage', () => {
    beforeEach(() => {
      fetchScreenMessageSpy.and.callThrough();
      accountInfoServiceSpy.getScreenMessage.and.returnValue(of(message));
    });

    it('should call getScreenMessage from accountInfoService and return message', () => {
      component.fetchScreenMessage();
      expect(accountInfoServiceSpy.getScreenMessage).toHaveBeenCalled();
      expect(component.screenMessage).toEqual(
        JSON.parse(message.UnregisterDeviceText)
      );
    });
  });

  describe('goBack', () => {
    it('should redirect to account-and-info page', () => {
      component.goBack();
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        'settings/account-and-personal-info'
      );
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      component.ngOnDestroy();
      expect(component.moreContentSubscription.unsubscribe).toHaveBeenCalled();
    });
  });
});
