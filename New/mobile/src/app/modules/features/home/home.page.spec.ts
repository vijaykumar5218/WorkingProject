import {Component, Input} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {IonicModule} from '@ionic/angular';
import {of} from 'rxjs';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {HeaderFooterTypeService} from '@shared-lib/services/header-footer-type/headerFooterType.service';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {JourneyResponse} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {OrangeMoneyService} from '@shared-lib/modules/orange-money/services/orange-money.service';
import {AccountService} from '@shared-lib/services/account/account.service';
import {HomePage} from './home.page';
import {RouterTestingModule} from '@angular/router/testing';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {NetWorthComponent} from '@shared-lib/components/net-worth/net-worth.component';
import {HomeService} from '@shared-lib/services/home/home.service';
@Component({selector: 'journeys-list', template: ''})
class MockJourneysList {
  @Input() headerText;
  @Input() journeys;
}

@Component({selector: 'app-mx-widget', template: ''})
class MockMXWidgetComponent {
  @Input() tagName: string;
  @Input() widgetType: WidgetType;
  @Input() height: string;
}

@Component({selector: 'app-financial-wellness', template: ''})
class MockFinancialWellnessComponent {}

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let headerFooterTypeServiceSpy;
  let accountServiceSpy;
  let journeyServiceSpy;
  let journeyData: JourneyResponse;
  let orangeMoneyServiceSpy;
  let openBenefitSelectionModalSpy;
  let benefitsServiceSpy;
  let participantData;
  let benefitEnrollmentData;
  let finSpy;
  let netSpy;
  let homeServiceServiceSpy;

  beforeEach(
    waitForAsync(() => {
      headerFooterTypeServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'publishType',
      ]);

      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'fetchJourneys',
      ]);

      accountServiceSpy = jasmine.createSpyObj('AccountService', [
        'getParticipant',
        'getDisplayNameOrFirst',
      ]);
      orangeMoneyServiceSpy = jasmine.createSpyObj('OrangeMoneyService', [
        'getOrangeData',
      ]);
      homeServiceServiceSpy = jasmine.createSpyObj('HomeService', [
        'openPreferenceSettingModal',
      ]);

      journeyData = {
        flags: {},
        all: [],
        recommended: [
          {
            journeyID: 1,
            journeyName: 'Adding to your family',
            lastModifiedStepIndex: 0,
            landingAndOverviewContent: '',
            resourcesContent: '',
            parsedLandingAndOverviewContent: {
              intro: {
                header: 'Adding to your family',
                message:
                  'Having a kid changes everything. Learn how to get your finances in order when your family is growing.',
                imgUrl:
                  'assets/icon/journeys/all/Master_Close_Ups_Family_2.svg',
              },
              overview: undefined,
            },
            steps: [],
          },
          {
            journeyID: 2,
            journeyName: 'Adding to your family2',
            lastModifiedStepIndex: 0,
            landingAndOverviewContent: '',
            resourcesContent: '',
            parsedLandingAndOverviewContent: {
              intro: {
                header: 'Adding to your family2',
                message:
                  'Having a kid changes everything. Learn how to get your finances in order when your family is growing. 2',
                imgUrl:
                  'assets/icon/journeys/all/Master_Close_Ups_Family_2.svg2',
              },
              overview: undefined,
            },
            steps: [],
          },
        ],
      };
      journeyServiceSpy.fetchJourneys.and.returnValue(of(journeyData));

      participantData = {
        firstName: 'Joseph',
        lastName: 'lastName',
        birthDate: '',
        displayName: '',
        age: '',
        profileId: 'profileId',
      };

      benefitsServiceSpy = jasmine.createSpyObj('BenefitsService', [
        'openBenefitsSelectionModalIfEnabled',
        'getBenefitsEnrollment',
        'setBenefitSummaryBackButton',
      ]);
      benefitEnrollmentData = {
        status: 'IN_PROGRESS',
        enrollmentWindowEnabled: true,
      };
      benefitsServiceSpy.getBenefitsEnrollment.and.returnValue(
        Promise.resolve(of(benefitEnrollmentData))
      );
      accountServiceSpy.getParticipant.and.returnValue(of(participantData));
      TestBed.configureTestingModule({
        declarations: [
          HomePage,
          MockJourneysList,
          MockFinancialWellnessComponent,
          MockMXWidgetComponent,
        ],
        imports: [IonicModule.forRoot(), RouterTestingModule],
        providers: [
          {
            provide: HeaderFooterTypeService,
            useValue: headerFooterTypeServiceSpy,
          },
          {provide: JourneyService, useValue: journeyServiceSpy},
          {provide: OrangeMoneyService, useValue: orangeMoneyServiceSpy},
          {provide: BenefitsService, useValue: benefitsServiceSpy},
          {provide: AccountService, useValue: accountServiceSpy},
          {provide: HomeService, useValue: homeServiceServiceSpy},
        ],
      }).compileComponents();
      fixture = TestBed.createComponent(HomePage);
      component = fixture.componentInstance;
      openBenefitSelectionModalSpy = spyOn(
        component,
        'openBenefitSelectionModal'
      );

      accountServiceSpy.getDisplayNameOrFirst.and.returnValue(
        'testDisplayName'
      );

      fixture.detectChanges();

      finSpy = jasmine.createSpyObj('FinstrongWidget', ['refreshWidget']);
      netSpy = jasmine.createSpyObj('NetWorthgWidget', ['refreshWidget']);
      component.finstrongWidget = finSpy;
      component.netWorthWidget = {
        widget: netSpy,
      } as NetWorthComponent;
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should fetch parcipant data to get first name', () => {
      expect(accountServiceSpy.getParticipant).toHaveBeenCalled();
      expect(accountServiceSpy.getDisplayNameOrFirst).toHaveBeenCalledWith(
        participantData
      );
      expect(component.firstName).toEqual('testDisplayName');
    });

    it('should getOrangeData', () => {
      expect(orangeMoneyServiceSpy.getOrangeData).toHaveBeenCalled();
    });

    it('should call openBenefitSelectionModal', () => {
      expect(openBenefitSelectionModalSpy).toHaveBeenCalled();
    });

    it('should fetch the benefitsEnrollment data', async () => {
      expect(benefitsServiceSpy.getBenefitsEnrollment).toHaveBeenCalled();
    });
  });

  describe('ionViewWillEnter', () => {
    it('should fetch the journeys', async () => {
      await component.ionViewWillEnter();
      expect(journeyServiceSpy.fetchJourneys).toHaveBeenCalled();
    });

    it('should publish header', async () => {
      await component.ionViewWillEnter();
      expect(headerFooterTypeServiceSpy.publishType).toHaveBeenCalledWith(
        {
          type: HeaderType.navbar,
          actionOption: {
            headername: 'Home',
            btnright: true,
            displayLogo: true,
            buttonRight: {
              name: '',
              link: 'notification',
            },
          },
        },
        {type: FooterType.tabsnav}
      );
      expect(
        benefitsServiceSpy.setBenefitSummaryBackButton
      ).toHaveBeenCalledWith('settings');
    });

    it('should refresh widgets if firstload=false', async () => {
      component.firstLoad = false;
      await component.ionViewWillEnter();

      expect(finSpy.refreshWidget).toHaveBeenCalled();
      expect(netSpy.refreshWidget).toHaveBeenCalled();
    });

    it('should refresh widgets if firstload=true', async () => {
      component.firstLoad = true;
      await component.ionViewWillEnter();

      expect(finSpy.refreshWidget).not.toHaveBeenCalled();
      expect(netSpy.refreshWidget).not.toHaveBeenCalled();
      expect(component.firstLoad).toBeFalse();
    });
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

  describe('ionViewWillLeave', () => {
    it('should set journeyResponse$ to undefined', () => {
      component.journeyResponse$ = of(journeyData);
      component.ionViewWillLeave();
      expect(component.journeyResponse$).toBeUndefined();
    });
  });

  describe('template', () => {
    beforeEach(async () => {
      await component.ionViewWillEnter();
    });

    it('should display the journeys list if there are recommended journeys', () => {
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('journeys-list'))).toBeTruthy();
    });

    it('should not display the journeys list if there are no recommended journeys', () => {
      component.journeyResponse$ = of({flags: {}, recommended: [], all: []});
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('journeys-list'))).toBeFalsy();
    });
  });

  describe('ngOnDestroy', () => {
    it('should call unsubscribe', () => {
      spyOn(component['participantSubscription'], 'unsubscribe');
      component.ngOnDestroy();
      expect(
        component['participantSubscription'].unsubscribe
      ).toHaveBeenCalled();
    });
  });
});
