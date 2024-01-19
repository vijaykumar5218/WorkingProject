import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {Router, RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {
  GroupingCategoryDetails,
  HealthContent,
  HealthUtlization,
} from '../models/chart.model';
import {InsightsComponent} from './insights.component';
import {ModalController} from '@ionic/angular';
import {InfoModalComponent} from './info-modal/info-modal.component';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import moment from 'moment';
import {ConsentService} from '../../../services/consent/consent.service';
import {of} from 'rxjs';
import * as pageText from '../constants/text-data.json';
import {AlertComponent} from '@shared-lib/components/alert/alert.component';
import {ConsentType} from '../../../services/consent/constants/consentType.enum';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {ElementRef} from '@angular/core';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {NoBenefitContent} from '@shared-lib/services/benefits/models/noBenefit.model';
import {TPAStreamService} from '@shared-lib/services/tpa-stream/tpastream.service';
import {AccessService} from '@shared-lib/services/access/access.service';
import {AccessResult} from '@shared-lib/services/access/models/access.model';
import {
  GroupingClaimsByYear,
  TPAClaimsData,
} from '@shared-lib/services/tpa-stream/models/tpa.model';

describe('InsightsComponent', () => {
  const pagetext = pageText;
  let component: InsightsComponent;
  let fixture: ComponentFixture<InsightsComponent>;
  let benefitsServiceSpy;
  let modalControllerSpy;
  let healthData;
  let benefitData;
  let healthCheckData;
  let consentServiceSpy;
  let checkAuthSpy;
  let noBenContent;
  let routerSpy;
  let noHealthDataContent;
  let fetchNoHealthContentSpy;
  let sharedUtilityServiceSpy;
  let scrollToTopSpy;
  let accessServiceSpy;
  let checkIsTpaSpy;
  let tpaServiceSpy;
  let tpaTestData: TPAClaimsData;

  const mockAccessData = {
    clientId: 'KOHLER',
    clientDomain: 'kohler.intg.voya.com',
    clientName: 'Kohler Co. 401(k) Savings Plan',
    planIdList: [
      {
        planId: '623040',
        active: true,
        benefitsAdminSystem: 'ADP',
      },
    ],
    firstTimeLogin: false,
    platform: 'ADP',
    currentPlan: {
      planId: '623040',
      active: true,
      benefitsAdminSystem: 'ADP',
    },
    enableMX: 'Y',
    enableMyVoyage: 'N',
    isHealthOnly: false,
    myProfileURL: 'https%3A%2F%2Flogin.intg.voya',
  };

  const slctdYearMockData = {
    year: '1111',
    claimTotalCount: 21,
    outOfPocketAmountTotal: 1234,
    inNetworkTotalCount: 0,
    outNetworkTotalCount: 21,
    aggregateServiceNameClaims: {
      medical: {
        serviceName: 'medicalText',
        claimTotalCount: 21,
        outOfPocketAmountTotal: 1234,
        inNetworkTotalCount: 0,
        outNetworkTotalCount: 21,
      },
    },
  };

  beforeEach(
    waitForAsync(() => {
      benefitData = {
        isEnrollmentWindowEnabled: false,
        planYear: 2022,
        enrolled: [],
        declined: [],
        provided: [],
      };

      healthCheckData = {
        physical: false,
        requiredColonScreen: false,
        requiredCytologyScreen: false,
        requiredMammogramScreen: false,
        year: 2022,
      };
      healthData = {
        categoryDetail: {
          emergencyRoomServices: [
            {
              inNetwork: 'true',
              outOfPocketCost: '22',
              providerName: 'Provider_name_emr',
              serviceDate: '2022-05-05',
            },
            {
              inNetwork: 'false',
              outOfPocketCost: '32',
              providerName: 'Provider_name_emr',
              serviceDate: '2022-05-05',
            },
          ],

          inNetworkCost: {
            preferredDrugs: 22,
            outpatientLabPaths: 22,
            specialVisits: 22,
            preventive: 22,
            genericDrugs: 22,
            outpatientXrays: 22,
            primaryVisits: 22,
            inpatientHosptialCares: 22,
            emergencyRoomServices: 22,
            outpatientSurgery: 22,
            other: 22,
          },
          outNetworkCost: {
            preferredDrugs: 32,
            outpatientLabPaths: 32,
            specialVisits: 32,
            preventive: 32,
            genericDrugs: 32,
            outpatientXrays: 32,
            primaryVisits: 32,
            inpatientHosptialCares: 32,
            emergencyRoomServices: 32,
            outpatientSurgery: 32,
            other: 32,
          },
        },
        inNetworkEventCount: {
          emergencyRoomServices: 23,
          genericDrugs: 23,
          inpatientHosptialCares: 23,
          other: 23,
          outpatientLabPaths: 23,
          outpatientSurgery: 23,
          outpatientXrays: 23,
          preferredDrugs: 0,
          preventive: 23,
          primaryVisits: 23,
          specialVisits: 23,
        },
        outNetworkEventCount: {
          emergencyRoomServices: 23,
          genericDrugs: 23,
          inpatientHosptialCares: 23,
          other: 23,
          outpatientLabPaths: 23,
          outpatientSurgery: 23,
          outpatientXrays: 23,
          preferredDrugs: 0,
          preventive: 23,
          primaryVisits: 23,
          specialVisits: 23,
        },
        inNetworkCost: {
          outOfPocketCost: 22,
        },
        outNetworkCost: {
          outOfPocketCost: 22,
        },
        groupingCategoryDetails: {
          '2022-01': [
            {
              drugName: 'Vitamin D (Ergocalciferol)',

              inNetwork: true,

              outOfPocketCost: 0,

              providerName: 'KROGER PHARMACY 16693',

              serviceDate: '2022-01-20',

              serviceName: 'genericDrugs',
            },
          ],
        },
      };

      tpaTestData = {
        memberId: 12345,
        carriers: [
          {
            carrierId: 471393,
            carrierName: 'Test Carrier',
            claimsCount: 5,
            connectionStatus: 'Enabled',
            crawlCount: 10,
            crawlStatus: 'SUCCESS',
            loginProblem: 'valid',
            logoUrl:
              'https://tpastream-public.s3.amazonaws.com/test-tpastream.png',
            payerId: 1659,
            totalOutOfPocketAmount: 367.72,
          },
        ],
        groupingCategoryDetails: {} as GroupingCategoryDetails,
        claims: [
          {
            inNetwork: true,
            outOfPocketCost: 20,
            providerName: 'Test Provider',
            serviceDate: '2022-01-23',
            carrierName: 'Test Carrier',
          },
        ],
        groupingClaimsByYear: {
          1111: {
            year: '1111',
            claimTotalCount: 21,
            outOfPocketAmountTotal: 1234,
            inNetworkTotalCount: 0,
            outNetworkTotalCount: 21,
            aggregateServiceNameClaims: {
              medical: {
                serviceName: 'medicalText',
                claimTotalCount: 21,
                outOfPocketAmountTotal: 1234,
                inNetworkTotalCount: 0,
                outNetworkTotalCount: 21,
              },
            },
          },
          2222: {
            year: '2222',
            claimTotalCount: 21,
            outOfPocketAmountTotal: 5678,
            inNetworkTotalCount: 0,
            outNetworkTotalCount: 21,
            aggregateServiceNameClaims: {
              medical: {
                serviceName: 'medicalText',
                claimTotalCount: 21,
                outOfPocketAmountTotal: 5678,
                inNetworkTotalCount: 0,
                outNetworkTotalCount: 21,
              },
            },
          },
          3333: {
            year: '3333',
            claimTotalCount: undefined,
            outOfPocketAmountTotal: undefined,
            inNetworkTotalCount: undefined,
            outNetworkTotalCount: undefined,
            aggregateServiceNameClaims: {
              medical: {
                serviceName: 'medicalText',
                claimTotalCount: 21,
                outOfPocketAmountTotal: 5678,
                inNetworkTotalCount: 0,
                outNetworkTotalCount: 21,
              },
            },
          },
        } as GroupingClaimsByYear,
      };

      benefitsServiceSpy = jasmine.createSpyObj('BenefitsService', [
        'fetchSpending',
        'getBenefits',
        'fetchHealthCheckContent',
        'getNoBenefitContents',
        'publishSelectedTab',
        'getNoHealthDataContent',
        'openGuidelines',
        'getGuidanceEnabled',
        'getSelectedTab$',
      ]);

      routerSpy = {
        events: {
          pipe: jasmine.createSpy().and.returnValue(
            of({
              id: 1,
              url: '/coverages/all-coverages/insights',
            })
          ),
        },
        navigateByUrl: jasmine.createSpy(),
      };

      accessServiceSpy = jasmine.createSpyObj('AccessService', [
        'checkMyvoyageAccess',
      ]);
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({...mockAccessData, ...{enableBST: 'N'}})
      );
      noBenContent = {
        NoBenefitsText: 'nobentext',
        Insights_OverlayMessage_ReviewAuthorization: '',
        Insights_ClaimsAuthorization_ReadDisclosure: '',
        Insights_TurnOffClaimsAuthorization: JSON.stringify({
          ClaimsAuth_title: 'test title',
          ClaimsAuth_description: 'test desc',
        }),
        Insights_ManageMyHealthandWealth: JSON.stringify({
          title: 'test title',
          description: 'test desc',
          link_name: 'test desc',
        }),
      };

      noHealthDataContent = {
        AggregateAccountsMSG: '',
        ComeBackMSG: '',
        FinishJourneyMSG: '',
        Insights_TotalHealthSpend_tileMessage_NoDataAvailable: '<p>Test</p>',
        OpenEnrollmentMSG: '',
      };

      benefitsServiceSpy.getNoBenefitContents.and.returnValue(
        Promise.resolve(noBenContent)
      );
      benefitsServiceSpy.getNoHealthDataContent.and.returnValue(
        Promise.resolve(noHealthDataContent)
      );
      const guidance = {
        guidanceEnabled: true,
      };
      benefitsServiceSpy.getGuidanceEnabled.and.returnValue(
        Promise.resolve(guidance)
      );
      modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
      consentServiceSpy = jasmine.createSpyObj('ConsentService', [
        'getMedicalConsent',
        'setConsent',
      ]);
      sharedUtilityServiceSpy = jasmine.createSpyObj(
        'sharedUtilityServiceSpy',
        ['getIsWeb', 'scrollToTop', 'isDesktop']
      );
      sharedUtilityServiceSpy.isDesktop.and.returnValue(of(true));
      tpaServiceSpy = jasmine.createSpyObj('TPAStreamService', ['getTPAData']);

      TestBed.configureTestingModule({
        declarations: [InsightsComponent],
        imports: [IonicModule.forRoot(), RouterModule.forRoot([])],
        providers: [
          {provide: BenefitsService, useValue: benefitsServiceSpy},
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: ConsentService, useValue: consentServiceSpy},
          {provide: Router, useValue: routerSpy},
          {provide: SharedUtilityService, useValue: sharedUtilityServiceSpy},
          {provide: TPAStreamService, useValue: tpaServiceSpy},
          {provide: AccessService, useValue: accessServiceSpy},
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(InsightsComponent);
      component = fixture.componentInstance;

      checkAuthSpy = spyOn(component, 'checkAuthorization');
      fetchNoHealthContentSpy = spyOn(component, 'fetchNoHealthContent');
      scrollToTopSpy = spyOn(component, 'scrollToTop');
      checkIsTpaSpy = spyOn(component, 'checkIsTpa').and.returnValue(
        Promise.resolve()
      );

      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load benefits content', () => {
      component.ngOnInit();
      expect(benefitsServiceSpy.getNoBenefitContents).toHaveBeenCalled();
      expect(component.benefitsContent).toEqual(noBenContent);
      expect(sharedUtilityServiceSpy.getIsWeb).toHaveBeenCalled();
    });
  });

  describe('ionViewWillEnter', () => {
    it('should call checkAuthorization', () => {
      spyOn(component, 'getGuidanceEnable');
      component.ionViewWillEnter();
      expect(scrollToTopSpy).toHaveBeenCalled();
      expect(component.getGuidanceEnable).toHaveBeenCalled();
      expect(checkAuthSpy).toHaveBeenCalled();
    });
  });

  describe('checkAuthorization', () => {
    beforeEach(() => {
      checkAuthSpy.and.callThrough();
    });

    it('should call getMedicalConsent and set property and set loading to false', () => {
      component.loading = true;
      component.hasConsent = true;
      consentServiceSpy.getMedicalConsent.and.returnValue(of(false));

      component.checkAuthorization();
      expect(consentServiceSpy.getMedicalConsent).toHaveBeenCalled();
      expect(component.hasConsent).toBeFalse();
      expect(component.loading).toBeFalse();
    });

    it('should call getMedicalConsent and call loadInsightsData if true', () => {
      spyOn(component, 'loadInsightsData');

      component.hasConsent = true;
      consentServiceSpy.getMedicalConsent.and.returnValue(of(true));

      component.checkAuthorization();
      expect(consentServiceSpy.getMedicalConsent).toHaveBeenCalled();
      expect(component.hasConsent).toBeTrue();
      expect(component.loadInsightsData).toHaveBeenCalled();
    });

    it('should call getMedicalConsent and call loadInsightsData if false and isTPA', () => {
      spyOn(component, 'loadInsightsData');

      component.hasConsent = false;
      component.isTpa = true;
      consentServiceSpy.getMedicalConsent.and.returnValue(of(true));

      component.checkAuthorization();
      expect(consentServiceSpy.getMedicalConsent).toHaveBeenCalled();
      expect(component.hasConsent).toBeTrue();
      expect(component.loadInsightsData).toHaveBeenCalled();
    });
  });

  describe('revokeAuthorization', () => {
    let modalSpy;
    beforeEach(() => {
      modalSpy = jasmine.createSpyObj('Modal', ['present']);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modalSpy));
    });
    it('should open AlertComponent modal and present it', async () => {
      await component.revokeAuthorization();
      const content = JSON.parse(
        noBenContent.Insights_TurnOffClaimsAuthorization
      );
      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: AlertComponent,
        cssClass: 'modal-not-fullscreen',
        componentProps: {
          titleMessage: content.ClaimsAuth_title,
          message: content.ClaimsAuth_description,
          yesButtonTxt: pagetext.yes,
          noButtonTxt: pagetext.notNow,
          saveFunction: jasmine.any(Function),
        },
      });
      expect(modalSpy.present).toHaveBeenCalled();
    });

    describe('should save consent on saveFunction', () => {
      beforeEach(() => {
        consentServiceSpy.setConsent.and.returnValue(Promise.resolve());
      });
      it('when isWeb would be false', async () => {
        component.isWeb = false;
        await component.revokeAuthorization();
        const saveFunction = modalControllerSpy.create.calls.all()[0].args[0]
          .componentProps.saveFunction;
        await saveFunction();
        expect(consentServiceSpy.setConsent).toHaveBeenCalledWith(
          ConsentType.MEDICAL,
          false
        );
        expect(consentServiceSpy.getMedicalConsent).toHaveBeenCalledWith(true);
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
          '/coverages/coverage-tabs/plans'
        );
        expect(benefitsServiceSpy.publishSelectedTab).toHaveBeenCalledWith(
          'plans'
        );
      });
      describe('when isWeb would be true', () => {
        let saveFunction;
        beforeEach(
          waitForAsync(() => {
            component.isWeb = true;
            component.revokeAuthorization();
            saveFunction = modalControllerSpy.create.calls.all()[0].args[0]
              .componentProps.saveFunction;
          })
        );
        it('When isDesktop would be true', async () => {
          component.isDesktop = true;
          await saveFunction();
          expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
            '/coverages/all-coverages/insights'
          );
        });
        it('When isDesktop would be false', async () => {
          component.isDesktop = false;
          await saveFunction();
          expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
            '/coverages/all-coverages/plans'
          );
        });
      });
    });
  });

  describe('loadInsightsData', () => {
    beforeEach(() => {
      spyOn(component, 'getSelectedYear');
      spyOn(component, 'getSpending');
      spyOn(component, 'fetchBenefits');
      spyOn(component, 'getHealthCheckContent');
    });
    it('should call getSelectedYear', () => {
      component.loadInsightsData();
      expect(component.getSelectedYear).toHaveBeenCalled();
    });
    it('should call getSpending', () => {
      component.loadInsightsData();
      expect(component.getSpending).toHaveBeenCalled();
    });
    it('should call fetchBenefits', () => {
      component.loadInsightsData();
      expect(component.fetchBenefits).toHaveBeenCalled();
    });
    it('should call getHealthCheckContent', () => {
      component.loadInsightsData();
      expect(component.getHealthCheckContent).toHaveBeenCalled();
    });
    it('should call NoHealthCheckContent', () => {
      component.loadInsightsData();
      expect(component.fetchNoHealthContent).toHaveBeenCalled();
    });
    it('make isHealthUtilizationAvail isTPA', () => {
      component.isHealthUtilizationAvail = false;
      component.isTpa = true;
      component.loadInsightsData();
      expect(component.isHealthUtilizationAvail).toEqual(true);
    });
    it('make isHealthUtilizationAvail isTPA', () => {
      component.isHealthUtilizationAvail = true;
      component.isTpa = false;
      component.loadInsightsData();
      expect(component.isHealthUtilizationAvail).toEqual(false);
    });
  });

  describe('getSpending', () => {
    beforeEach(() => {
      spyOn(component, 'getSpendingRegular');
      spyOn(component, 'getSpendingTPA');
    });

    it('should call getSpendingRegular if not tpa', () => {
      component.isTpa = false;
      component.getSpending();
      expect(component.getSpendingRegular).toHaveBeenCalled();
    });

    it('should call getSpendingTPA if tpa', () => {
      component.isTpa = true;
      component.getSpending();
      expect(component.getSpendingTPA).toHaveBeenCalled();
    });
  });

  describe('getSpendingRegular', () => {
    beforeEach(() => {
      spyOn(component, 'createPieData');
      spyOn(component, 'loadChart');
      spyOn(component, 'createBubleData');
      spyOn(component, 'bubbleChart');
    });
    describe('when res would not be null', () => {
      it('when groupingCategoryDetails key length not equal 0', async () => {
        benefitsServiceSpy.fetchSpending.and.returnValue(
          Promise.resolve(healthData)
        );
        await component.getSpendingRegular();
        expect(component.createPieData).toHaveBeenCalled();
        expect(component.loadChart).toHaveBeenCalled();
        expect(component.createBubleData).toHaveBeenCalled();
        expect(component.bubbleChart).toHaveBeenCalled();
        expect(component.isHealthUtilizationAvail).toEqual(true);
        expect(component.healthData).toEqual(healthData);
        expect(component.contentP.title).toEqual(44);
        expect(component.totalHealthSpend).toEqual(44);
      });
      it('when groupingCategoryDetails key length equal 0', async () => {
        benefitsServiceSpy.fetchSpending.and.returnValue(
          Promise.resolve({
            inNetworkEventCount: {
              emergencyRoomServices: 23,
              genericDrugs: 23,
              inpatientHosptialCares: 23,
              other: 23,
              outpatientLabPaths: 23,
              outpatientSurgery: 23,
              outpatientXrays: 23,
              preferredDrugs: 0,
              preventive: 23,
              primaryVisits: 23,
              specialVisits: 23,
            },
            outNetworkEventCount: {
              emergencyRoomServices: 23,
              genericDrugs: 23,
              inpatientHosptialCares: 23,
              other: 23,
              outpatientLabPaths: 23,
              outpatientSurgery: 23,
              outpatientXrays: 23,
              preferredDrugs: 0,
              preventive: 23,
              primaryVisits: 23,
              specialVisits: 23,
            },
            inNetworkCost: {
              outOfPocketCost: 22,
            },
            outNetworkCost: {
              outOfPocketCost: 22,
            },
            groupingCategoryDetails: {},
          })
        );
        await component.getSpendingRegular();
        expect(component.isHealthUtilizationAvail).toEqual(false);
      });
    });
    it('when totalSpend would be 0', async () => {
      benefitsServiceSpy.fetchSpending.and.returnValue(
        Promise.resolve({
          inNetworkEventCount: {
            emergencyRoomServices: 23,
            genericDrugs: 23,
            inpatientHosptialCares: 23,
            other: 23,
            outpatientLabPaths: 23,
            outpatientSurgery: 23,
            outpatientXrays: 23,
            preferredDrugs: 0,
            preventive: 23,
            primaryVisits: 23,
            specialVisits: 23,
          },
          outNetworkEventCount: {
            emergencyRoomServices: 23,
            genericDrugs: 23,
            inpatientHosptialCares: 23,
            other: 23,
            outpatientLabPaths: 23,
            outpatientSurgery: 23,
            outpatientXrays: 23,
            preferredDrugs: 0,
            preventive: 23,
            primaryVisits: 23,
            specialVisits: 23,
          },
          inNetworkCost: {
            outOfPocketCost: 0,
          },
          outNetworkCost: {
            outOfPocketCost: 0,
          },
          groupingCategoryDetails: {
            '2022-01': [
              {
                drugName: 'Vitamin D (Ergocalciferol)',
                inNetwork: true,
                outOfPocketCost: 0,
                providerName: 'KROGER PHARMACY 16693',
                serviceDate: '2022-01-20',
                serviceName: 'genericDrugs',
              },
            ],
          },
        })
      );
      await component.getSpendingRegular();
      expect(component.contentP.title).toEqual(0);
      expect(component.totalHealthSpend).toEqual(0);
    });
    it('when res would be null', async () => {
      benefitsServiceSpy.fetchSpending.and.returnValue(Promise.resolve(null));
      await component.getSpendingRegular();
      expect(component.isHealthUtilizationAvail).toEqual(false);
    });
  });

  describe('getSpendingTPA', () => {
    beforeEach(() => {
      spyOn(component, 'createPieDataTpa');
      spyOn(component, 'loadChart');
      spyOn(component, 'createBubleDataTpa');
      spyOn(component, 'bubbleChart');
    });

    it('should call getTPAData and set hasConsent to false if claims.length < 1', () => {
      const emptyClaimsTPAData = {
        memberId: 12345,
        carriers: [],
        groupingCategoryDetails: {} as GroupingCategoryDetails,
        claims: [],
        groupingClaimsByYear: {} as GroupingClaimsByYear,
      };
      tpaServiceSpy.getTPAData.and.returnValue(of(emptyClaimsTPAData));

      component.selectedYear = '1111';

      component.getSpendingTPA();
      expect(component.hasConsent).toBeFalse();
    });

    it('should call getTPAData and then transform it', () => {
      tpaServiceSpy.getTPAData.and.returnValue(of(tpaTestData));

      component.selectedYear = '1111';

      component.getSpendingTPA();

      expect(tpaServiceSpy.getTPAData).toHaveBeenCalled();
      expect(component.createPieDataTpa).toHaveBeenCalled();
      expect(component.loadChart).toHaveBeenCalled();
      expect(component.tpaData).toEqual(tpaTestData);
      expect(component.slctdYearTPAData).toEqual({
        year: '1111',
        claimTotalCount: 21,
        outOfPocketAmountTotal: 1234,
        inNetworkTotalCount: 0,
        outNetworkTotalCount: 21,
        aggregateServiceNameClaims: {
          medical: {
            serviceName: 'medicalText',
            claimTotalCount: 21,
            outOfPocketAmountTotal: 1234,
            inNetworkTotalCount: 0,
            outNetworkTotalCount: 21,
          },
        },
      });
      expect(component.contentP.title).toEqual(1234);
      expect(component.totalHealthSpend).toEqual(1234);
      expect(component.hasConsent).toBeTrue();
      expect(component.healthData).toEqual({
        inNetworkCountTotal: 0,
        outNetworkCountTotal: 21,
      } as HealthUtlization);
      expect(component.createBubleDataTpa).toHaveBeenCalled();
      expect(component.bubbleChart).toHaveBeenCalled();
    });

    it('should call getTPAData leave properties null if selected year values are null', () => {
      tpaServiceSpy.getTPAData.and.returnValue(of(tpaTestData));

      component.selectedYear = '3333';

      component.getSpendingTPA();

      expect(component.contentP.title).toEqual(0);
      expect(component.totalHealthSpend).toEqual(0);
      expect(component.healthData).toEqual({
        inNetworkCountTotal: undefined,
        outNetworkCountTotal: undefined,
      } as HealthUtlization);
    });

    it('should call getTPAData leave properties null if selected year tpa data null', () => {
      tpaServiceSpy.getTPAData.and.returnValue(of(tpaTestData));

      component.selectedYear = '4444';

      component.getSpendingTPA();

      expect(component.contentP.title).toEqual(0);
      expect(component.totalHealthSpend).toEqual(0);
      expect(component.healthData).toEqual({
        inNetworkCountTotal: undefined,
        outNetworkCountTotal: undefined,
      } as HealthUtlization);
    });
  });

  describe('fetchBenefits', () => {
    beforeEach(() => {
      component.coverages = undefined;
      component.totalPremium = undefined;
    });

    it('should load benefitData', async () => {
      benefitsServiceSpy.getBenefits.and.returnValue(
        Promise.resolve(benefitData)
      );
      await component.fetchBenefits();
      expect(benefitsServiceSpy.getBenefits).toHaveBeenCalled();
      expect(component.coverages).toEqual(benefitData);
      expect(component.totalPremium).toEqual(undefined);
    });

    it('when totalPremium will not be undefined', async () => {
      spyOn(component, 'getSpending');
      const benefitEnrollData = {
        isEnrollmentWindowEnabled: false,
        planYear: 2022,
        enrolled: [
          {
            name: 'name',
            coverage: 1,
            premium: 2,
            totalPremium: 1234,
            premiumFrequency: 'premiumFrequency',
            deductible: 3,
            type: 'medical_plan',
            id: 'id23',
            deductibleObj: {
              coinsurance: 45,
              copay: 76,
              family: 36,
              individual: 90,
              single: 98,
            },
            coverage_levels: {
              subscriber: 2,
              spouse: 1,
              child: 0,
            },
            coverageType: 'coverageType',
            first_name: 'demo',
            benefit_type_title: 'benefit_type_title',
            coverage_start_date: '01-01-2021',
            plan_summary: null,
            planDetails: null,
            benAdminFlag: false,
          },
        ],
        declined: [],
        provided: [],
      };
      benefitsServiceSpy.getBenefits.and.returnValue(
        Promise.resolve(benefitEnrollData)
      );
      await component.fetchBenefits();
      expect(component.coverages).toEqual(benefitEnrollData);
      expect(component.totalPremium).toEqual(
        benefitEnrollData.enrolled[0].totalPremium
      );
    });

    it('when benefitData would be null', async () => {
      benefitsServiceSpy.getBenefits.and.returnValue(Promise.resolve(null));
      await component.fetchBenefits();
      expect(component.coverages).toEqual(null);
    });
  });

  describe('getHealthCheckContent', () => {
    beforeEach(() => {
      spyOn(component, 'getSelectedYear');
    });
    describe('when isHealthcheckup would be true', () => {
      beforeEach(
        waitForAsync(() => {
          benefitsServiceSpy.fetchHealthCheckContent.and.returnValue(
            Promise.resolve(healthCheckData)
          );
        })
      );
      it('should load healthData', async () => {
        await component.getHealthCheckContent();
        expect(component.getSelectedYear).toHaveBeenCalled();
        expect(benefitsServiceSpy.fetchHealthCheckContent).toHaveBeenCalledWith(
          component.healthDates
        );
        expect(component.healthCheckUp).toEqual(healthCheckData);
      });
    });
  });

  describe('createPieData', () => {
    it('should load newData', () => {
      component.healthData = healthData;
      component.createPieData();
      expect(component.newData).toEqual([
        {name: 'Preferred Drugs', y: 54, color: '#bde3f2'},
        {name: 'Outpatient Labs', y: 54, color: '#99d5dd'},
        {name: 'Specialist Care', y: 54, color: '#d7b8c9'},
        {name: 'Preventative Care', y: 54, color: '#d7b8c9'},
        {name: 'Generic Drugs', y: 54, color: '#bde3f2'},
        {name: 'X-rays', y: 54, color: '#b5a7ba'},
        {name: 'Primary Care', y: 54, color: '#d7b8c9'},
        {name: 'Inpatient Care', y: 54, color: '#99d5dd'},
        {name: 'ER Services', y: 54, color: '#b5a7ba'},
        {name: 'Outpatient Surgery', y: 54, color: '#99d5dd'},
        {name: 'Other Services', y: 54, color: '#d9d9d9'},
      ]);
    });
    it('should not load newData', () => {
      component.healthData = null;
      component.createPieData();
      expect(component.newData).toEqual([]);
    });
  });

  describe('createBubleDataTpa', () => {
    it('should not reassign bubbleData if !tpaData', () => {
      const data = [
        {
          data: [],
          name: 'test',
          showInLegend: false,
        },
      ];
      component.selectedYear = '2021';
      component.bubbleData = data;
      component.tpaData = {
        groupingClaimsByYear: {},
      } as TPAClaimsData;

      component.createBubleDataTpa();

      expect(component.bubbleData).toEqual(data);
    });

    it('should create tpa bubble data', () => {
      component.selectedYear = '2022';
      component.tpaData = {
        carriers: [],
        claims: [],
        groupingCategoryDetails: {},
        memberId: 1234,
        groupingClaimsByYear: {
          '2022': {
            claimTotalCount: 50,
            inNetworkTotalCount: 20,
            outNetworkTotalCount: 30,
            outOfPocketAmountTotal: 50000,
            year: '2022',
            aggregateServiceNameClaims: {
              medical: {
                claimTotalCount: 12,
                inNetworkTotalCount: 4,
                outNetworkTotalCount: 8,
                outOfPocketAmountTotal: 25000,
                serviceName: 'medical',
              },
            },
          },
        },
      };

      component.createBubleDataTpa();

      expect(component.bubbleData).toEqual([
        {
          name: 'Medical Care',
          data: [
            {
              name: 'Medical Care',
              value: 12,
              color: '#d7b8c9',
              in: 4,
              out: 8,
            },
          ],
          showInLegend: false,
        },
      ]);
    });
  });

  describe('createBubleData', () => {
    it('should load bubbleData', () => {
      component.healthData = healthData;

      component.bubbleData = undefined;
      component.createBubleData();

      const result = [
        {
          name: 'ER Services',
          data: [
            {name: 'ER Services', value: 46, color: '#b5a7ba', in: 23, out: 23},
          ],
          showInLegend: false,
        },
        {
          name: 'Generic Drugs',
          data: [
            {
              name: 'Generic Drugs',
              value: 46,
              color: '#bde3f2',
              in: 23,
              out: 23,
            },
          ],
          showInLegend: false,
        },
        {
          name: 'Inpatient Care',
          data: [
            {
              name: 'Inpatient Care',
              value: 46,
              color: '#99d5dd',
              in: 23,
              out: 23,
            },
          ],
          showInLegend: false,
        },
        {
          name: 'Other Services',
          data: [
            {
              name: 'Other Services',
              value: 46,
              color: '#d9d9d9',
              in: 23,
              out: 23,
            },
          ],
          showInLegend: false,
        },
        {
          name: 'Outpatient Labs',
          data: [
            {
              name: 'Outpatient Labs',
              value: 46,
              color: '#99d5dd',
              in: 23,
              out: 23,
            },
          ],
          showInLegend: false,
        },
        {
          name: 'Outpatient Surgery',
          data: [
            {
              name: 'Outpatient Surgery',
              value: 46,
              color: '#99d5dd',
              in: 23,
              out: 23,
            },
          ],
          showInLegend: false,
        },
        {
          name: 'X-rays',
          data: [
            {name: 'X-rays', value: 46, color: '#b5a7ba', in: 23, out: 23},
          ],
          showInLegend: false,
        },
        {
          name: 'Preventative Care',
          data: [
            {
              name: 'Preventative Care',
              value: 46,
              color: '#d7b8c9',
              in: 23,
              out: 23,
            },
          ],
          showInLegend: false,
        },
        {
          name: 'Primary Care',
          data: [
            {
              name: 'Primary Care',
              value: 46,
              color: '#d7b8c9',
              in: 23,
              out: 23,
            },
          ],
          showInLegend: false,
        },
        {
          name: 'Specialist Care',
          data: [
            {
              name: 'Specialist Care',
              value: 46,
              color: '#d7b8c9',
              in: 23,
              out: 23,
            },
          ],
          showInLegend: false,
        },
      ];

      expect(component.bubbleData).toEqual(result);
    });
    it('should not load newData', () => {
      component.healthData = null;
      component.createBubleData();
      expect(component.bubbleData).toEqual([]);
    });
  });

  describe('viewClaims', () => {
    let spy;
    beforeEach(() => {
      spy = jasmine.createSpyObj('Spy', ['next']);
      benefitsServiceSpy.getSelectedTab$.and.returnValue(spy);
    });

    it('should call router navigateByURL if isweb and tpa', () => {
      component.isTpa = true;
      component.isWeb = true;
      component.viewClaims();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        '/coverages/all-coverages/tpaclaims'
      );
    });

    it('should call router navigateByURL if !isweb and tpa', () => {
      component.isTpa = true;
      component.isWeb = false;
      component.viewClaims();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        '/coverages/coverage-tabs/tpaclaims'
      );
    });

    it('should call router navigateByURL if isweb and bst', () => {
      component.isTpa = false;
      component.isWeb = true;
      component.viewClaims();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        '/coverages/all-coverages/claims'
      );
    });

    it('should call router navigateByURL if !isweb and bst', () => {
      component.isTpa = false;
      component.isWeb = false;
      component.viewClaims();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        '/coverages/coverage-tabs/claims'
      );
    });

    it('should call next of benefitsService getSelectedTab$ if bst', () => {
      component.isTpa = false;
      component.viewClaims();
      expect(spy.next).toHaveBeenCalledWith('claims');
    });

    it('should call next of benefitsService getSelectedTab$ if tpa', () => {
      component.isTpa = true;
      component.viewClaims();
      expect(spy.next).toHaveBeenCalledWith('tpaclaims');
    });
  });

  describe('checkForContainer', () => {
    it('should call getElementById, and resolve if non null', async () => {
      const elSpy = spyOn(document, 'getElementById');
      elSpy.and.returnValue(null);
      setTimeout(() => {
        elSpy.and.returnValue({offsetWidth: 350} as HTMLElement);
      }, 1000);

      const time = new Date().getTime();

      await component.checkForContainer('');

      const timeAfter = new Date().getTime();
      const diff = timeAfter - time;

      expect(diff).toBeGreaterThan(500);
    });

    it('should call getElementById, and resolve if non null resolve imediately', async () => {
      const elSpy = spyOn(document, 'getElementById');
      elSpy.and.returnValue({offsetWidth: 350} as HTMLElement);

      const time = new Date().getTime();

      await component.checkForContainer('');

      const timeAfter = new Date().getTime();
      const diff = timeAfter - time;

      expect(diff).toBeLessThan(50);
    });
  });

  describe('loadChart', () => {
    beforeEach(() => {
      spyOn(component, 'checkForContainer');
    });

    it('Should load chart  ', async () => {
      const highChartSpy = jasmine.createSpyObj('HighCharts', ['chart']);
      component.newData = [
        {
          name: 'Abc',
          y: 100,
          color: '#ccc',
        },
      ];

      component.hc = highChartSpy;
      await component.loadChart();
      expect(component.checkForContainer).toHaveBeenCalledWith('container');
      expect(component.hc.chart).toHaveBeenCalledWith('container', {
        credits: false,
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: 0,
          plotShadow: false,
          height: 330,
        },
        title: {
          text: '',
        },
        tooltip: {
          enabled: false,
        },
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: true,
              distance: -50,
              style: {
                fontWeight: 'bold',
                color: 'white',
              },
            },
            startAngle: 90,
            endAngle: 90,
            center: ['50%', '50%'],
            opacity: 1,
            borderWidth: 1,
            fillColor: '#a6a6a6',
          },
        },
        series: [
          {
            type: 'pie',
            name: '',
            innerSize: '80%',
            dataLabels: {
              enabled: false,
            },

            states: {
              inactive: {
                opacity: 1,
              },
            },

            events: {
              click: jasmine.any(Function),
              mouseOut: jasmine.any(Function),
            },
            data: [
              {
                name: 'Abc',
                y: 100,
                color: '#ccc',
              },
            ],
          },
        ],
      });
    });

    it('test on click', async () => {
      spyOn(component, 'changePie');
      const highChartSpy = jasmine.createSpyObj('HighCharts', ['chart']);

      component.hc = highChartSpy;
      await component.loadChart();
      const clickFunction = highChartSpy.chart.calls.all()[0].args[1].series[0]
        .events.click;

      const event = {
        point: {
          name: 'test',
          y: 200,
        },
      };

      clickFunction(event);

      expect(component.changePie).toHaveBeenCalledWith('test', 200);
    });

    it('test resetPieData on mouseOut', async () => {
      spyOn(component, 'resetPieData');
      const highChartSpy = jasmine.createSpyObj('HighCharts', ['chart']);

      component.hc = highChartSpy;
      await component.loadChart();
      const mouseOutFunction = highChartSpy.chart.calls.all()[0].args[1]
        .series[0].events.mouseOut;

      component.contentP = {
        pieDefaultSubTitle: 'All Services',
      } as HealthContent;

      component.healthData = {
        inNetworkCost: {
          outOfPocketCost: 1200,
        },
        outNetworkCost: {
          outOfPocketCost: 1200,
        },
      } as HealthUtlization;

      mouseOutFunction(
        component.contentP,
        component.healthData.inNetworkCost.outOfPocketCost +
          component.healthData.outNetworkCost.outOfPocketCost
      );

      expect(component.resetPieData).toHaveBeenCalledWith('All Services', 2400);
    });
  });

  describe('bubbleChart', () => {
    it('Should load bubbleChart  ', async () => {
      spyOn(component, 'checkForContainer');
      const highChartSpy = jasmine.createSpyObj('HighCharts', ['chart']);
      component.bubbleData = [
        {
          name: 'name',
          showInLegend: false,
          data: [
            {
              color: 'string',
              in: 10,
              name: 'string',
              out: 10,
              value: 20,
            },
          ],
        },
      ];

      component.hc = highChartSpy;
      await component.bubbleChart();
      expect(component.checkForContainer).toHaveBeenCalledWith(
        'bubbleContainer'
      );

      expect(highChartSpy.chart).toHaveBeenCalledWith({
        credits: false,
        chart: {
          renderTo: 'bubbleContainer',
          type: 'packedbubble',
        },
        title: {
          text: '',
        },
        tooltip: {
          outside: true,
          useHTML: true,
          headerFormat: '',
          pointFormat:
            "<p style='font-size:16px;font-weight:bold;margin:0;'>{point.value}</p> <p style='font-size:14px;font-weight:bold;margin:5px 0 5px 0;'> {point.name} </p>   {point.in} In Network Visits  <br/> {point.out} Out of Network Visits ",
          backgroundColor: '#fff',

          style: {
            color: 'black',
            textAlign: 'center',
            minWidth: 200,
            fontSize: '12px',
            zIndex: 11111,
            opacity: 0.9,
          },
        },
        plotOptions: {
          packedbubble: {
            clip: false,
            minSize: '65%',
            maxSize: '450%',
            allowOverlap: false,
            zIndex: 100,
            zMin: 1,
            zMax: 1000,
            stickyTracking: false,
            layoutAlgorithm: {
              splitSeries: false,
              gravitationalConstant: 0.01,
              bubblePadding: 5,
            },
            dataLabels: {
              enabled: true,
              useHTML: true,
              align: 'center',
              allowOverlap: false,
              className: 'highlight',
              format: '{point.value} <br/>{point.name}',
              inside: false,

              filter: {
                property: 'value',
                operator: '>=',
                value: 0,
              },
              style: {
                color: 'black',
                textOutline: 'none',
                fontWeight: 'normal',
                textAlign: 'center',
                width: 62,
              },
            },
            marker: {
              fillOpacity: 1,
            },
          },
        },
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 300,
              },
            },
          ],
        },
        series: component.bubbleData,
      });
    });
  });

  describe('changePie', () => {
    it('should call change pie', () => {
      const name = 'All Services';
      const val = 300;
      component.changePie(name, val);
      expect(component.contentP.title).toEqual(val);
      expect(component.contentP.pieSubTitle).toEqual(name);
    });
  });

  describe('resetPieData', () => {
    it('should call resetPieData', () => {
      const name = 'All Categories';
      const val = 300;

      component.resetPieData(name, val);

      expect(component.contentP.title).toEqual(val);
      expect(component.contentP.pieSubTitle).toEqual(name);
    });
  });

  describe('openModal', () => {
    let presentModalSpy;
    beforeEach(() => {
      presentModalSpy = jasmine.createSpyObj('Modal', ['present']);
      modalControllerSpy.create.and.returnValue(
        Promise.resolve(presentModalSpy)
      );

      component.benefitsContent = {
        TotalHealthSpend_DisclaimerTile: JSON.stringify({
          disclaimer_title: 'test_title',
        }),
        TotalHealthSpending_Disclaimer: JSON.stringify({
          disclaimer_message: 'test_message',
        }),
      } as NoBenefitContent;
    });

    it('should call create on modalController', async () => {
      await component.openModal();
      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: InfoModalComponent,
        cssClass: 'modal-not-fullscreen',
        componentProps: {
          headerText: 'test_title',
          bodyText: 'test_message',
        },
      });
      expect(presentModalSpy.present).toHaveBeenCalled();
    });
  });

  describe('getSelectedYear', () => {
    it('if segment is 0 then healthdate is current year', () => {
      component.segment = '0';
      component.healthDates = undefined;

      component.getSelectedYear();

      expect(component.healthDates).toEqual({
        startDate: moment()
          .startOf('year')
          .format('MM/DD/YYYY'),
        endDate: moment()
          .endOf('year')
          .format('MM/DD/YYYY'),
      });
    });
    it('if segment is 1 then healthdate is previous year', () => {
      component.segment = '1';

      component.healthDates = undefined;

      component.getSelectedYear();

      expect(component.healthDates).toEqual({
        startDate: moment()
          .startOf('year')
          .add(-1, 'years')
          .format('MM/DD/YYYY'),
        endDate: moment()
          .endOf('year')
          .add(-1, 'years')
          .format('MM/DD/YYYY'),
      });
    });
  });

  describe('toggle year', () => {
    beforeEach(() => {
      spyOn(component, 'getSelectedYear');
      spyOn(component, 'getHealthCheckContent');
      spyOn(component, 'getSpending');
      spyOn(component, 'fetchBenefits');
      spyOn(component, 'resetPieData');
      spyOn(component, 'allCatgryValue');
    });
    it('should change the value of segment and call getSpending() and getHealthCheckContent() ', () => {
      component.segment = undefined;
      component.toggleYear('0');
      expect(component.segment).toEqual('0');
      expect(component.getSelectedYear).toHaveBeenCalled();
      expect(component.getSpending).toHaveBeenCalled();
      expect(component.getHealthCheckContent).toHaveBeenCalled();
      expect(component.fetchBenefits).toHaveBeenCalled();
    });
    it('should change the value of segment and call getSpending() and getHealthCheckContent() ', () => {
      component.segment = '1';
      component.toggleYear('1');
      expect(component.segment).toEqual('1');
      expect(component.totalPremium).toEqual(0);
      expect(component.getSelectedYear).toHaveBeenCalled();
      expect(component.getSpending).toHaveBeenCalled();
      expect(component.getHealthCheckContent).toHaveBeenCalled();
    });
  });

  it('openGuidelines', () => {
    component.openGuidelines();
    expect(benefitsServiceSpy.openGuidelines).toHaveBeenCalled();
  });

  describe('fetchNoHealthContent', () => {
    beforeEach(() => {
      fetchNoHealthContentSpy.and.callThrough();
    });

    it('should get the benefit content from the service', async () => {
      component.nohealthData = undefined;
      await component.fetchNoHealthContent();
      expect(benefitsServiceSpy.getNoHealthDataContent).toHaveBeenCalled();
      expect(component.nohealthData).toEqual(noHealthDataContent);
    });
  });

  describe('scrollToTop', () => {
    beforeEach(() => {
      scrollToTopSpy.and.callThrough();
      spyOn(component.subscription, 'add');
      component.topmostElement = {
        nativeElement: jasmine.createSpyObj('nativeElement', [
          'scrollIntoView',
        ]),
      } as ElementRef;
    });
    it('When isWeb would be true', fakeAsync(() => {
      component.isWeb = true;
      component.scrollToTop();
      expect(routerSpy.events.pipe).toHaveBeenCalled();
      tick(100);
      expect(component.subscription.add).toHaveBeenCalled();
      expect(sharedUtilityServiceSpy.scrollToTop).toHaveBeenCalledWith(
        component.topmostElement
      );
    }));
    it('When isWeb would be false', () => {
      component.isWeb = false;
      component.scrollToTop();
      expect(routerSpy.events.pipe).not.toHaveBeenCalled();
    });
  });

  it('ngOnDestroy', () => {
    spyOn(component.subscription, 'unsubscribe');
    spyOn(component.tpaSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscription.unsubscribe).toHaveBeenCalled();
    expect(component.tpaSubscription.unsubscribe).toHaveBeenCalled();
  });

  describe('onMouseClick', () => {
    it('isFocus should be true', () => {
      component.isFocus = false;
      component.onMouseClick();
      expect(component.isFocus).toBe(true);
    });
  });

  describe('onKeyboardNavigation', () => {
    it('isFocus should be false', () => {
      component.isFocus = true;
      component.onKeyboardNavigation();
      expect(component.isFocus).toBe(false);
    });
  });

  describe('checkIsTpa', () => {
    beforeEach(() => {
      checkIsTpaSpy.and.callThrough();
    });

    it('isTpa true if enableTPA is "Y" ', async () => {
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({enableBST: 'N', enableTPA: 'Y'} as AccessResult)
      );
      await component.checkIsTpa();
      expect(component.isTpa).toBe(true);
    });

    it('isTpa true if enableTPA is "Y" ', async () => {
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({enableBST: 'Y', enableTPA: 'N'} as AccessResult)
      );
      await component.checkIsTpa();
      expect(component.isTpa).toBe(false);
    });
  });

  describe('createPieDataTpa', () => {
    it('should load newData', () => {
      component.slctdYearTPAData = slctdYearMockData;
      component.createPieDataTpa();
      expect(component.newData).toEqual([
        {
          color: '#d7b8c9',
          name: 'Medical Care',
          y: 1234,
        },
      ]);
    });
  });
});
