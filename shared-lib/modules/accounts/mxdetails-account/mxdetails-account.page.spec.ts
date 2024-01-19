import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {MXAccountDetailPage} from './mxdetails-account.page';
import {Component, Input} from '@angular/core';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {of, Subscription} from 'rxjs';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderFooterTypeService} from '@shared-lib/services/header-footer-type/headerFooterType.service';
@Component({selector: 'app-mx-widget', template: ''})
class MockMXWidgetComponent {
  @Input() tagName: string;
  @Input() widgetType: WidgetType;
  @Input() height: string;
}

describe('MXAccountDetailPage', () => {
  let component: MXAccountDetailPage;
  let fixture: ComponentFixture<MXAccountDetailPage>;
  let headerFooterServiceSpy;
  let mxServiceSpy;
  let utilityServiceSpy;

  beforeEach(
    waitForAsync(() => {
      mxServiceSpy = jasmine.createSpyObj('MXService', [
        'getMxData',
        'getMxDataLocalStorage',
      ]);
      headerFooterServiceSpy = jasmine.createSpyObj('HeaderFooterTypeService', [
        'publishType',
      ]);
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy', [
        'getIsWeb',
        'fetchUrlThroughNavigation',
      ]);

      utilityServiceSpy.getIsWeb.and.returnValue(true);

      TestBed.configureTestingModule({
        declarations: [MXAccountDetailPage, MockMXWidgetComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: HeaderFooterTypeService, useValue: headerFooterServiceSpy},
          {provide: MXService, useValue: mxServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(MXAccountDetailPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('constructor', () => {
    expect(component.isWeb).toEqual(true);
    expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
  });

  describe('ionViewWillEnter', () => {
    it('When isweb would be false', () => {
      component.isWeb = false;
      component.actionOption = {headername: ''};
      mxServiceSpy.getMxData.and.returnValue({
        name: 'savings',
      });
      component.ionViewWillEnter();
      expect(component.actionOption.headername).toEqual('savings');
      expect(headerFooterServiceSpy.publishType).toHaveBeenCalledWith(
        {
          type: HeaderType.navbar,
          actionOption: {headername: 'savings'},
        },
        {type: FooterType.none}
      );
    });
    describe('When isweb would be true', () => {
      let mockData;
      let observable;
      let subscription;
      beforeEach(() => {
        component.isWeb = true;
        mockData = {
          paramId: '123',
          url:
            'accounts/mxdetails-account/ACT-8fa39e08-8981-4c4f-8910-177e53836bd1',
        };
        observable = of(mockData);
        subscription = new Subscription();
        spyOn(observable, 'subscribe').and.callFake(f => {
          f(mockData);
          return subscription;
        });
        utilityServiceSpy.fetchUrlThroughNavigation.and.returnValue(observable);
        spyOn(component.subscription, 'add');
        spyOn(component, 'fetchAcct');
      });
      it('should call fetchAcct', () => {
        component.ionViewWillEnter();
        expect(component.fetchAcct).toHaveBeenCalledWith(mockData);
        expect(component.subscription.add).toHaveBeenCalledWith(subscription);
        expect(component.isVisible).toEqual(false);
        expect(
          utilityServiceSpy.fetchUrlThroughNavigation
        ).toHaveBeenCalledWith(3);
      });
    });
  });

  describe('fetchAcct', () => {
    beforeEach(() => {
      component.isVisible = false;
    });
    it('When data.paramId would be equal to this.accountMX.guid', () => {
      mxServiceSpy.getMxDataLocalStorage.and.returnValue(of({guid: '123'}));
      component.fetchAcct({
        paramId: '123',
        url:
          'accounts/mxdetails-account/ACT-8fa39e08-8981-4c4f-8910-177e53836bd1',
      });
      expect(component.isVisible).toEqual(true);
      expect(mxServiceSpy.getMxDataLocalStorage).toHaveBeenCalled();
      expect(component.tagName).toEqual('123-mx-account-transactions');
    });
    it('When data.paramId would not be equal to this.accountMX.guid', () => {
      mxServiceSpy.getMxDataLocalStorage.and.returnValue(of({guid: '1234'}));
      component.fetchAcct({
        paramId: '123',
        url:
          'accounts/mxdetails-account/ACT-8fa39e08-8981-4c4f-8910-177e53836bd1',
      });
      expect(component.isVisible).toEqual(false);
      expect(component.tagName).toEqual('mx-account-transactions');
    });

    it('When call getMxDataLocalStorage and paramId is null', () => {
      const mxAccount = {
        account_type_name: 'Savings',
        account_number: '1234567890',
        radioButtonIconName: 'radio-button-off',
        institution_name: 'mx account',
        medium_logo_url: 'abc.svg',
        guid: 'ACT-8fa39e08-8981-4c4f-8910-177e53836bd1',
        name: 'Savings_Account',
        available_balance: '100',
        currency_code: 'USD',
        balance: '100',
        routing_number: '731775673',
        updated_at: '2022-05-16T10:42:10+00:00',
        user_guid: 'USR-cf7c18a3-5552-4f78-82fc-7013a3b03d12',
        institution_guid: 'INS-68e96dd6-eabd-42d3-9f05-416897f0746c',
        small_logo_url:
          'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/50x50/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_50x50.png',
      };
      mxServiceSpy.getMxDataLocalStorage.and.returnValue(of(mxAccount));
      component.fetchAcct(null);
      expect(component.accountMX).toEqual(mxAccount);
    });
  });

  it('ngOnDestroy', () => {
    spyOn(component.subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscription.unsubscribe).toHaveBeenCalled();
  });
});
