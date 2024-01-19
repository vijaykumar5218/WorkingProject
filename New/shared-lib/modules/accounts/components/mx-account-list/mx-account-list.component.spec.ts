import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {
  HAS_CREATED_ZERO_EVENT,
  MXAccountListComponent,
} from './mx-account-list.component';
import {ToastController} from '@ionic/angular';
import {of, Subscription} from 'rxjs';
import pageText from '../../../../services/account/models/retirement-account/info/info-tab.json';
import {MXAccount} from '@shared-lib/services/mx-service/models/mx.model';
import {EventTrackingService} from '@shared-lib/services/event-tracker/event-tracking.service';
import {EventTrackingConstants} from '@shared-lib/services/event-tracker/models/event-tracking.model';
import * as eventC from '@shared-lib/services/event-tracker/constants/event-tracking.json';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {AccountService} from '@shared-lib/services/account/account.service';
import {Router} from '@angular/router';

describe('MXAccountListComponent', () => {
  let component: MXAccountListComponent;
  let mxServiceSpy;
  let fixture: ComponentFixture<MXAccountListComponent>;
  let toastCtrlSpy;
  let mockMXAccountData;
  let eventTrackingSpy;
  const eventContent: EventTrackingConstants = (eventC as any).default;
  let utilityServiceSpy;
  let routerSpy;
  let accountServiceSpy;

  beforeEach(
    waitForAsync(() => {
      mockMXAccountData = {
        accounts: [
          {
            account_number: 'XXXXX9200',
            account_type_name: 'CREDIT_CARD',
            available_balance: '1000.0',
            balance: '1000.0',
            currency_code: 'USD',
            guid: 'ACT-8fa39e08-8981-4c4f-8910-177e53836bd1',
            name: 'Gringotts Credit card',
            routing_number: '731775673',
            updated_at: '2022-05-16T10:42:10+00:00',
            user_guid: 'USR-cf7c18a3-5552-4f78-82fc-7013a3b03d12',
            institution_guid: 'INS-68e96dd6-eabd-42d3-9f05-416897f0746c',
            small_logo_url:
              'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/50x50/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_50x50.png',
            medium_logo_url:
              'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_100x100.png',
            institution_name: 'MX Bank (Oauth)',
          },
        ],
      };

      mxServiceSpy = jasmine.createSpyObj('MXService', [
        'getMxAccountConnect',
        'setMxData',
        'setMxDataLocalStorage',
        'checkIsAltAccessUser',
      ]);
      toastCtrlSpy = jasmine.createSpyObj('ToastController', ['create']);
      mxServiceSpy.getMxAccountConnect.and.returnValue({
        subscribe: () => undefined,
      });
      mxServiceSpy.checkIsAltAccessUser.and.returnValue(of(false));
      eventTrackingSpy = jasmine.createSpyObj('EventTrackingService', [
        'eventTracking',
      ]);

      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy', [
        'getIsWeb',
        'fetchUrlThroughNavigation',
      ]);
      accountServiceSpy = jasmine.createSpyObj('accountServiceSpy', [
        'getAggregatedAccounts',
      ]);
      routerSpy = {
        navigateByUrl: jasmine.createSpy(),
      };
      utilityServiceSpy.fetchUrlThroughNavigation.and.returnValue({
        subscribe: () => undefined,
      });

      TestBed.configureTestingModule({
        declarations: [MXAccountListComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: MXService, useValue: mxServiceSpy},
          {provide: ToastController, useValue: toastCtrlSpy},
          {provide: EventTrackingService, useValue: eventTrackingSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: Router, useValue: routerSpy},
          {provide: AccountService, useValue: accountServiceSpy},
        ],
      }).compileComponents();
      fixture = TestBed.createComponent(MXAccountListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      component['subscription'] = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
      ]);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'getMXAccountData');
      spyOn(component, 'fetchGuid');
      spyOn(component, 'checkAltAccessUser');

      component.isWeb = false;
    });
    it('Should call getMXAccountData', () => {
      component.ngOnInit();
      expect(component.getMXAccountData).toHaveBeenCalled();
    });
    it('Should call fetchGuid', () => {
      component.ngOnInit();
      expect(component.fetchGuid).toHaveBeenCalled();
    });
    it('isWeb would be true', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      component.ngOnInit();
      expect(component.isWeb).toEqual(true);
    });
    it('Should call fetchGuid', () => {
      component.ngOnInit();
      expect(component.checkAltAccessUser).toHaveBeenCalled();
    });
  });

  describe('getMXAccountData', () => {
    beforeEach(() => {
      spyOn(component, 'mxAccountsChanged');
    });
    it('should call mxAccountsChanged with new data', () => {
      component['subscription'] = new Subscription();
      mxServiceSpy.getMxAccountConnect.and.returnValue(of(mockMXAccountData));

      component.getMXAccountData();

      expect(component.mxAccountsChanged).toHaveBeenCalledWith(
        mockMXAccountData
      );
    });
  });

  describe('checkAltAccessUser', () => {
    beforeEach(() => {
      spyOn(component, 'checkAltAccessUser');
    });
    it('should call checkAltAccessUser', () => {
      mxServiceSpy.checkIsAltAccessUser.and.returnValue(of(true));
      component.checkAltAccessUser();
      expect(mxServiceSpy.checkIsAltAccessUser).toHaveBeenCalled();
    });
  });

  describe('mxAccountsChanged', () => {
    const account = {
      name: 'test account 1',
    } as MXAccount;

    beforeEach(() => {
      spyOn(component, 'createMXZeroEvent');
      spyOn(component, 'updateMXEvent');
      spyOn(component, 'presentToast');
    });

    it('should set component mxAccounts', () => {
      const mxRoot = {
        accounts: [account],
      };

      component.mxAccountsChanged(mxRoot);
      expect(component.mxAccountData).toEqual(mxRoot.accounts);
    });

    it('should call mxZeroEvent', () => {
      component.mxAccountsChanged({
        accounts: [],
      });
      expect(component.createMXZeroEvent).toHaveBeenCalled();
    });

    it('should call mxZeroEvent if null', () => {
      component.mxAccountsChanged(null);
      expect(component.createMXZeroEvent).toHaveBeenCalled();
    });

    it('should call updateMXEvent', () => {
      component.mxAccountsChanged({
        accounts: [account],
      });
      expect(component.updateMXEvent).toHaveBeenCalled();
    });

    it('should call presentToast with added if had old accounts data and if new accounts are > old ones', () => {
      component.mxAccountData = [account];
      component.mxAccountsChanged({
        accounts: [account, account],
      });

      expect(component.presentToast).toHaveBeenCalledWith(
        pageText.accountsLinkedToast
      );
      expect(accountServiceSpy.getAggregatedAccounts).toHaveBeenCalledWith(
        true
      );
    });

    it('should call presentToast with removed if had old accounts data and if new accounts are < old ones', () => {
      component.mxAccountData = [account, account];
      component.mxAccountsChanged({
        accounts: [account],
      });

      expect(component.presentToast).toHaveBeenCalledWith(
        pageText.accountsUnLinkedToast
      );
      expect(accountServiceSpy.getAggregatedAccounts).toHaveBeenCalledWith(
        true
      );
    });

    it('should call createMXZeroEvent if had old accounts data and if new accounts are < old ones and new accounts == 0', () => {
      component.mxAccountData = [account, account];
      component.mxAccountsChanged({
        accounts: [],
      });

      expect(component.createMXZeroEvent).toHaveBeenCalledWith(true);
    });
  });

  describe('updateMXEvent', () => {
    it('should call even tracking with update', () => {
      component.updateMXEvent();
      expect(eventTrackingSpy.eventTracking).toHaveBeenCalledWith({
        eventName: eventContent.eventTrackingMx.eventName,
        updateInd: eventContent.eventTrackingMx.updateInd,
      });
    });
  });

  describe('createMXZeroEvent', () => {
    beforeEach(() => {
      spyOn(Storage.prototype, 'setItem');
    });

    it('should call eventTracking and set HAS_CREATED_ZERO_EVENT if HAS_CREATED_ZERO_EVENT is false', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue('false');

      component.createMXZeroEvent();

      expect(Storage.prototype.getItem).toHaveBeenCalledWith(
        HAS_CREATED_ZERO_EVENT
      );
      expect(eventTrackingSpy.eventTracking).toHaveBeenCalledWith({
        eventName: eventContent.eventTrackingMx.eventName,
      });
      expect(Storage.prototype.setItem).toHaveBeenCalledWith(
        HAS_CREATED_ZERO_EVENT,
        'true'
      );
    });

    it('should call eventTracking and set HAS_CREATED_ZERO_EVENT if HAS_CREATED_ZERO_EVENT is null', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue(null);

      component.createMXZeroEvent();

      expect(Storage.prototype.getItem).toHaveBeenCalledWith(
        HAS_CREATED_ZERO_EVENT
      );
      expect(eventTrackingSpy.eventTracking).toHaveBeenCalledWith({
        eventName: eventContent.eventTrackingMx.eventName,
      });
      expect(Storage.prototype.setItem).toHaveBeenCalledWith(
        HAS_CREATED_ZERO_EVENT,
        'true'
      );
    });

    it('should not call eventTracking and set HAS_CREATED_ZERO_EVENT if HAS_CREATED_ZERO_EVENT is true', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue('true');

      component.createMXZeroEvent();

      expect(eventTrackingSpy.eventTracking).not.toHaveBeenCalledWith({
        eventName: eventContent.eventTrackingMx.eventName,
      });
      expect(Storage.prototype.setItem).not.toHaveBeenCalledWith(
        HAS_CREATED_ZERO_EVENT,
        'true'
      );
    });

    it('should call eventTracking and set HAS_CREATED_ZERO_EVENT if HAS_CREATED_ZERO_EVENT is true and force = true', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue('true');

      component.createMXZeroEvent(true);

      expect(eventTrackingSpy.eventTracking).toHaveBeenCalledWith({
        eventName: eventContent.eventTrackingMx.eventName,
      });
      expect(Storage.prototype.setItem).toHaveBeenCalledWith(
        HAS_CREATED_ZERO_EVENT,
        'true'
      );
    });
  });

  describe('presentToast', () => {
    it('Shoud present toast with message', async () => {
      const mockRes = {
        present: jasmine.createSpy(),
      };
      toastCtrlSpy.create.and.returnValue(Promise.resolve(mockRes));
      await component.presentToast('test toast');
      expect(toastCtrlSpy.create).toHaveBeenCalledWith({
        message: 'test toast',
        duration: 3000,
        position: 'top',
        color: 'dark',
        cssClass: 'toast-below-nav',
        animated: false,
      });
      expect(mockRes.present).toHaveBeenCalled();
    });
  });

  describe('sendmxtitle', () => {
    it('When isWeb would be false', () => {
      component.isWeb = false;
      component.mxAccountClicked.emit = jasmine.createSpy();
      component.sendmxtitle(mockMXAccountData.accounts[0]);
      expect(mxServiceSpy.setMxData).toHaveBeenCalledWith(
        mockMXAccountData.accounts[0]
      );
      expect(component.mxAccountClicked.emit).toHaveBeenCalledWith(
        mockMXAccountData.accounts[0]
      );
      expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
    });
    it('When isWeb would be true', () => {
      component.isWeb = true;
      component.sendmxtitle(mockMXAccountData.accounts[0]);
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        `accounts/mxdetails-account/${mockMXAccountData.accounts[0].guid}`
      );
    });
  });

  describe('fetchGuid', () => {
    let subscriptionMock;
    let observable;
    let mockData;
    beforeEach(() => {
      mockData = {
        paramId: '123',
        url: '/accounts/account-details/123/info',
      };
      component['subscription'] = jasmine.createSpyObj('Subscription', [
        'add',
        'unsubscribe',
      ]);
      observable = of(mockData);
      subscriptionMock = new Subscription();
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockData);
        return subscriptionMock;
      });
      component.guid = undefined;
    });
    it("When guid would be '1234'", () => {
      utilityServiceSpy.fetchUrlThroughNavigation.and.returnValue(observable);
      component.fetchGuid();
      expect(component.guid).toEqual(mockData['paramId']);
      expect(component['subscription'].add).toHaveBeenCalledWith(
        subscriptionMock
      );
      expect(utilityServiceSpy.fetchUrlThroughNavigation).toHaveBeenCalledWith(
        3
      );
    });
    it('When guid would be undefined', () => {
      utilityServiceSpy.fetchUrlThroughNavigation.and.returnValue(of(null));
      component.fetchGuid();
      expect(component.guid).toEqual(undefined);
    });
  });

  describe('manageWidthOfCard', () => {
    beforeEach(() => {
      component.isWeb = true;
    });
    describe('isWeb would be true', () => {
      it('When Width would be 480px', () => {
        component.guid = mockMXAccountData.accounts[0].guid;
        const output = component.manageWidthOfCard(
          mockMXAccountData.accounts[0]
        );
        expect(output).toEqual({width: '480px'});
        expect(mxServiceSpy.setMxDataLocalStorage).toHaveBeenCalledWith(
          mockMXAccountData.accounts[0]
        );
      });
      it('When Width would be auto', () => {
        component.guid = 'guid124';
        const output = component.manageWidthOfCard(
          mockMXAccountData.accounts[0]
        );
        expect(output).toEqual({width: 'auto'});
        expect(mxServiceSpy.setMxDataLocalStorage).not.toHaveBeenCalled();
      });
    });
    it('isWeb would be false', () => {
      component.isWeb = false;
      const output = component.manageWidthOfCard(mockMXAccountData.accounts[0]);
      expect(output).toEqual(null);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe getMxAccountConnect', () => {
      component.ngOnDestroy();
      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });
});
