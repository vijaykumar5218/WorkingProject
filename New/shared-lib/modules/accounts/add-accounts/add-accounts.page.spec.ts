import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {AddAccountsPage} from './add-accounts.page';
import {Component, Input} from '@angular/core';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderFooterTypeService} from '@shared-lib/services/header-footer-type/headerFooterType.service';
import { AccountService } from '@shared-lib/services/account/account.service';
@Component({selector: 'app-mx-widget', template: ''})
class MockMXWidgetComponent {
  @Input() tagName: string;
  @Input() widgetType: WidgetType;
  @Input() height: string;
}

describe('AddAccountsPage', () => {
  let component: AddAccountsPage;
  let fixture: ComponentFixture<AddAccountsPage>;
  let headerFooterServiceSpy;
  let mxServiceSpy;
  let sharedUtilityServiceSpy;
  let activeRouteSpy;
  let journeyServiceSpy;
  let modalControllerSpy;
  let accountServiceSpy;
  beforeEach(
    waitForAsync(() => {
      sharedUtilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'getIsWeb',
        'setSuppressHeaderFooter',
      ]);
      headerFooterServiceSpy = jasmine.createSpyObj('HeaderFooterTypeService', [
        'publishType',
      ]);
      mxServiceSpy = jasmine.createSpyObj('MXService', [
        'getMxMemberConnect',
        'getMxAccountConnect',
        'getUserAccountUpdate',
        'addMXWindowEventListener',
        'removeMXWindowEventListener',
        'getIsMxUserByMyvoyageAccess',
      ]);
      accountServiceSpy = jasmine.createSpyObj('AccountService', [
        'getAggregatedAccounts'
      ]);
      modalControllerSpy = jasmine.createSpyObj('ModalControllerSpy', [
        'dismiss',
      ]);
      activeRouteSpy = jasmine.createSpyObj('ActivatedRoute', [''], {});
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'setRefreshMxAccount',
      ]);

      TestBed.configureTestingModule({
        declarations: [AddAccountsPage, MockMXWidgetComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: HeaderFooterTypeService, useValue: headerFooterServiceSpy},
          {provide: MXService, useValue: mxServiceSpy},
          {provide: SharedUtilityService, useValue: sharedUtilityServiceSpy},
          {provide: ActivatedRoute, useValue: activeRouteSpy},
          {provide: JourneyService, useValue: journeyServiceSpy},
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: AccountService, useValue: accountServiceSpy}
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(AddAccountsPage);
      component = fixture.componentInstance;

      component.contentView = {
        nativeElement: jasmine.createSpyObj('NativeEl', [''], {
          offsetHeight: 500,
        }),
      };

      activeRouteSpy.queryParams = of({
        backRoute: '/journeys/journey/7/overview',
      });
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('when offsetHeight is zero & preInitHeight be undefined', () => {
      component.preInitHeight = '';
      component.contentView.nativeElement.offsetHeight = 0;
      component.ngOnInit();
      expect(component.height).toEqual('530px');
    });
    it('when preInitHeight be defined', () => {
      component.preInitHeight = '530px';
      component.contentView.nativeElement.offsetHeight = 500;
      component.ngOnInit();
      expect(component.height).toEqual('530px');
    });
    it('should set backRoute', () => {
      component.ngOnInit();
      expect(component['backRoute']).toEqual('/journeys/journey/7/overview');
    });
    it('should not set backRoute', () => {
      component['backRoute'] = '/account/summary';
      activeRouteSpy.queryParams = of({});
      component.ngOnInit();
      expect(component['backRoute']).toEqual('/account/summary');
    });
  });

  describe('ionViewWillEnter', () => {
    it('should set header, footer when isWeb would be false', () => {
      component.isWeb = false;
      component.ionViewWillEnter();
      expect(headerFooterServiceSpy.publishType).toHaveBeenCalledWith(
        {
          type: HeaderType.navbar,
          actionOption: {
            headername: 'Add Accounts',
            btnleft: true,
            buttonLeft: {
              name: 'Back',
              link: component['backRoute'],
            },
          },
        },
        {type: FooterType.none}
      );
    });
    it('should not set header, footer when isWeb would be true', () => {
      component.isWeb = true;
      component.ionViewWillEnter();
      expect(headerFooterServiceSpy.publishType).not.toHaveBeenCalled();
    });
  });

  describe('ngAfterViewInit', () => {
    it('should load mx widget and call mx service addMXWindowEventListener', () => {
      component['ref'] = {nativeElement: {offsetHeight: 500}};

      component.ngAfterViewInit();

      expect(mxServiceSpy.addMXWindowEventListener).toHaveBeenCalled();
    });
  });

  describe('ionViewWillLeave', () => {
    it('should setRefreshMxAccount to true', () => {
      component.ionViewWillLeave();
      expect(journeyServiceSpy.setRefreshMxAccount).toHaveBeenCalledWith(
        'true'
      );
    });
    it('should refresh mx connect data', () => {
      component.ionViewWillLeave();
      expect(mxServiceSpy.getMxMemberConnect).toHaveBeenCalledWith(true);
    });
    it('should refresh mx connect account linked data', () => {
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
    it('should call mx service getIsMxUserByMyvoyageAccess', () => {
      component.ionViewWillLeave();
      expect(mxServiceSpy.getIsMxUserByMyvoyageAccess).toHaveBeenCalledWith(
        true
      );
    });
  });

  describe('closeModal', () => {
    it('should call setSuppressHeaderFooter with false and call dismiss', () => {
      component.closeModal();
      expect(mxServiceSpy.getIsMxUserByMyvoyageAccess).toHaveBeenCalledWith(
        true
      );
      expect(
        sharedUtilityServiceSpy.setSuppressHeaderFooter
      ).toHaveBeenCalledWith(false);
      expect(modalControllerSpy.dismiss).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should call unsubscribe', () => {
      spyOn(component['subscription'], 'unsubscribe');
      component.ngOnDestroy();
      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });
});
