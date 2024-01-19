import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {ManageAccountsPage} from './manage-accounts.page';
import {Component, Input} from '@angular/core';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderFooterTypeService} from '@shared-lib/services/header-footer-type/headerFooterType.service';
import { AccountService } from '@shared-lib/services/account/account.service';
@Component({selector: 'app-mx-widget', template: ''})
class MockMXWidgetComponent {
  @Input() tagName: string;
  @Input() widgetType: WidgetType;
  @Input() height: string;
}

describe('ManageAccountsPage', () => {
  let component: ManageAccountsPage;
  let fixture: ComponentFixture<ManageAccountsPage>;
  let headerFooterServiceSpy;
  let mxServiceSpy;
  let sharedUtilityServiceSpy;
  let accountServiceSpy;

  beforeEach(
    waitForAsync(() => {
      sharedUtilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'getIsWeb',
      ]);
      headerFooterServiceSpy = jasmine.createSpyObj('HeaderFooterTypeService', [
        'publishType',
      ]);
      mxServiceSpy = jasmine.createSpyObj('MXService', [
        'getMxMemberConnect',
        'getMxAccountConnect',
        'addMXWindowEventListener',
        'removeMXWindowEventListener',
        'getUserAccountUpdate'
      ]);
      accountServiceSpy = jasmine.createSpyObj('AccountService', [
        'getAggregatedAccounts'
      ]);
      TestBed.configureTestingModule({
        declarations: [ManageAccountsPage, MockMXWidgetComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: HeaderFooterTypeService, useValue: headerFooterServiceSpy},
          {provide: MXService, useValue: mxServiceSpy},
          {provide: SharedUtilityService, useValue: sharedUtilityServiceSpy},
          {provide: AccountService, useValue:accountServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ManageAccountsPage);
      component = fixture.componentInstance;

      component.contentView = {
        nativeElement: jasmine.createSpyObj('NativeEl', [''], {
          offsetHeight: 500,
        }),
      };

      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set height', () => {
      expect(component.height).toEqual('600%');
    });
  });

  describe('ionViewWillEnter', () => {
    it('should set header, footerwhen isWeb would be false', () => {
      component.isWeb = false;
      component.ionViewWillEnter();
      expect(headerFooterServiceSpy.publishType).toHaveBeenCalledWith(
        {
          type: HeaderType.navbar,
          actionOption: {
            headername: 'Manage Accounts',
            btnleft: true,
            buttonLeft: {
              name: 'Back',
              link: 'back',
            },
          },
        },
        {type: FooterType.none}
      );
    });
    it('should not set header, footerwhen isWeb would be true', () => {
      component.isWeb = true;
      component.ionViewWillEnter();
      expect(headerFooterServiceSpy.publishType).not.toHaveBeenCalled();
    });
  });

  describe('ionViewDidEnter', () => {
    it('should load mx widget and call mx service addMXWindowEventListener', () => {
      component.ionViewDidEnter();
      expect(mxServiceSpy.addMXWindowEventListener).toHaveBeenCalled();
    });
  });

  describe('ionViewWillLeave', () => {
    it('should refresh mx manage data', () => {
      component.ionViewWillLeave();
      expect(mxServiceSpy.getMxMemberConnect).toHaveBeenCalledWith(true);
    });
    it('should refresh mx manage account linked data', () => {
      component.ionViewWillLeave();
      expect(mxServiceSpy.getMxAccountConnect).toHaveBeenCalledWith(true);
    });
    it('should refresh/fetch AggregatedAccounts data', () => {
      component.ionViewWillLeave();
      expect(accountServiceSpy.getAggregatedAccounts).toHaveBeenCalledWith(mxServiceSpy.getUserAccountUpdate());
    });
    it('should call mx service removeMXWindowEventListener', () => {
      component.ionViewWillLeave();
      expect(mxServiceSpy.removeMXWindowEventListener).toHaveBeenCalled();
    });
  });
});
