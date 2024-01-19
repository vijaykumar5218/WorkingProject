import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {HeaderTypeService} from '@web/app/modules/shared/services/header-type/header-type.service';
import {HomePage} from './home.page';
import {Component, Input, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {AccountService} from '@shared-lib/services/account/account.service';
import {of} from 'rxjs';
import {RouterTestingModule} from '@angular/router/testing';
import {FooterTypeService} from '@shared-lib/modules/footer/services/footer-type/footer-type.service';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {PlatformService} from '@shared-lib/services/platform/platform.service';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {HomeService} from '@shared-lib/services/home/home.service';

@Component({selector: 'journeys-status', template: ''})
class MockJourneysStatusComponent {
  @Input() status;
}

@Component({selector: 'app-benefits-banner', template: ''})
class MockBenefitsBannerComponent {}

@Component({selector: 'app-net-worth', template: ''})
class MockAppNetWorthComponent {
  @Input() tagName;
  @Input() height;
}

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let headerTypeServiceSpy;
  let accountServiceSpy;
  let footerTypeServiceSpy;
  let openBenefitSelectionModalSpy;
  let benefitsServiceSpy;
  let platformServiceSpy;
  let mxServiceSpy;
  let participantData;
  let fetchDisplayNameSpy;
  let homeServiceServiceSpy;

  beforeEach(
    waitForAsync(() => {
      homeServiceServiceSpy = jasmine.createSpyObj('HomeService', [
        'openPreferenceSettingModal',
      ]);
      mxServiceSpy = jasmine.createSpyObj('mxServiceSpy', [
        'displayWidget',
        'hasUser',
      ]);
      headerTypeServiceSpy = jasmine.createSpyObj('headerTypeServiceSpy', [
        'publishSelectedTab',
      ]);
      accountServiceSpy = jasmine.createSpyObj('accountServiceSpy', [
        'getAuthResult',
        'getParticipant',
        'getDisplayNameOrFirst',
      ]);
      footerTypeServiceSpy = jasmine.createSpyObj('footerTypeServiceSpy', [
        'publish',
      ]);
      benefitsServiceSpy = jasmine.createSpyObj('BenefitsService', [
        'openBenefitsSelectionModalIfEnabled',
        'getBenefitsEnrollment',
        'setBenefitSummaryBackButton',
      ]);
      platformServiceSpy = jasmine.createSpyObj('PlatformService', [
        'isDesktop',
        'navigateByUrl',
      ]);
      platformServiceSpy.isDesktop.and.returnValue(of(true));

      participantData = {
        firstName: 'VILJAMI',
        lastName: 'AILIN-DP',
        birthDate: '',
        displayName: 'VILJAMI AILIN-DP',
        age: '',
        profileId: 'profileId',
      };

      TestBed.configureTestingModule({
        declarations: [
          HomePage,
          MockJourneysStatusComponent,
          MockBenefitsBannerComponent,
          MockAppNetWorthComponent,
        ],
        providers: [
          {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
          {provide: AccountService, useValue: accountServiceSpy},
          {provide: FooterTypeService, useValue: footerTypeServiceSpy},
          {provide: BenefitsService, useValue: benefitsServiceSpy},
          {provide: PlatformService, useValue: platformServiceSpy},
          {provide: MXService, useValue: mxServiceSpy},
          {provide: HomeService, useValue: homeServiceServiceSpy},
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [RouterTestingModule],
      }).compileComponents();

      fixture = TestBed.createComponent(HomePage);
      component = fixture.componentInstance;
      component.isLoad = false;
      openBenefitSelectionModalSpy = spyOn(
        component,
        'openBenefitSelectionModal'
      );
      fetchDisplayNameSpy = spyOn(component, 'fetchDisplayName');

      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should called fetchDisplayName', async () => {
      await component.ngOnInit();
      expect(component.fetchDisplayName).toHaveBeenCalled();
    });
    it('should called openBenefitSelectionModal', async () => {
      await component.ngOnInit();
      expect(component.openBenefitSelectionModal).toHaveBeenCalled();
    });
  });

  describe('ionViewWillEnter', () => {
    it('should called publishSelectedTab', () => {
      component.ionViewWillEnter();
      expect(headerTypeServiceSpy.publishSelectedTab).toHaveBeenCalledWith(
        'HOME'
      );
    });
  });

  describe('fetchDisplayName', () => {
    beforeEach(() => {
      fetchDisplayNameSpy.and.callThrough();
      accountServiceSpy.getParticipant.and.returnValue(of(participantData));
    });

    it('should call getParticipant then call getDisplayNameOrFirst', () => {
      accountServiceSpy.getDisplayNameOrFirst.and.returnValue(
        'testDisplayName'
      );
      component.participantName = undefined;
      component.fetchDisplayName();
      expect(accountServiceSpy.getParticipant).toHaveBeenCalled();
      expect(accountServiceSpy.getDisplayNameOrFirst).toHaveBeenCalledWith(
        participantData
      );
      expect(component.participantName).toEqual('testDisplayName');
    });
  });

  it('displayWidgets', () => {
    component.displayWidgets();
    expect(mxServiceSpy.displayWidget).toHaveBeenCalledWith(
      WidgetType.FINSTRONG_MINI,
      {
        id: 'mx-finstrong-mini',
        height: '400px',
        autoload: false,
      }
    );
    expect(mxServiceSpy.displayWidget).toHaveBeenCalledWith(
      WidgetType.NET_WORTH_MINI,
      {
        id: 'mx-net-worth-mini',
        height: '410px',
        autoload: false,
      }
    );
  });

  describe('openBenefitSelectionModal', () => {
    beforeEach(() => {
      openBenefitSelectionModalSpy.and.callThrough();
    });

    it('should call BenefitsService openBenefitsSelectionModalIfEnabled', async () => {
      component.openBenefitSelectionModal();
      expect(
        benefitsServiceSpy.openBenefitsSelectionModalIfEnabled
      ).toHaveBeenCalled();
    });
  });

  it('ngAfterViewInit', () => {
    component.ngAfterViewInit();
    expect(footerTypeServiceSpy.publish).toHaveBeenCalledWith({
      type: FooterType.tabsnav,
      selectedTab: 'home',
    });
  });

  describe('ngAfterViewChecked', () => {
    beforeEach(() => {
      spyOn(component, 'displayWidgets');
    });
    it('when isLoad will be true', () => {
      component.isLoad = true;
      component.ngAfterViewChecked();
      expect(component.displayWidgets).toHaveBeenCalled();
      expect(component.isLoad).toEqual(false);
    });
    it('when isViewChecked will be false', () => {
      component.isLoad = false;
      component.ngAfterViewChecked();
      expect(component.displayWidgets).not.toHaveBeenCalled();
      expect(component.isLoad).toEqual(false);
    });
  });

  describe('netWorthClicked', () => {
    it('when view netwoth button clicked will be redirecting to net-worth page', () => {
      component.netWorthClicked();
      expect(platformServiceSpy.navigateByUrl).toHaveBeenCalled();
    });
  });

  describe('completeFinancialSummaryClicked', () => {
    it('when view complete financial summary button clicked will be redirecting to financial-wellness page', () => {
      component.completeFinancialSummaryClicked();
      expect(platformServiceSpy.navigateByUrl).toHaveBeenCalledWith(
        '/financial-wellness'
      );
    });
  });

  it('ngOnDestroy', () => {
    spyOn(component.subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscription.unsubscribe).toHaveBeenCalled();
  });
});
