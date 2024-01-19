import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {RouterTestingModule} from '@angular/router/testing';
import {of} from 'rxjs';
import {ConsentService} from '@shared-lib/services/consent/consent.service';
import {MedicalSpendingComponent} from './medical-spending.component';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {Router} from '@angular/router';
import {AccessService} from '@shared-lib/services/access/access.service';
import {AccessResult} from '../../../services/access/models/access.model';
import {TPAStreamService} from '@shared-lib/services/tpa-stream/tpastream.service';
import {TPACarrier} from '@shared-lib/services/tpa-stream/models/tpa.model';
import {NameCategory} from '@shared-lib/components/coverages/models/chart.model';

describe('MedicalSpendingComponent', () => {
  let component: MedicalSpendingComponent;
  let fixture: ComponentFixture<MedicalSpendingComponent>;
  let benefitsServiceSpy;
  let routerSpy;
  let consentServiceSpy;
  const mockHealthData = {
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
  let accessServiceSpy;
  let tpaServiceSpy;

  beforeEach(
    waitForAsync(() => {
      consentServiceSpy = jasmine.createSpyObj('ConsentService', [
        'getMedicalConsent',
      ]);
      accessServiceSpy = jasmine.createSpyObj('ConsentService', [
        'checkMyvoyageAccess',
      ]);
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({
          enableTPA: 'N',
        } as AccessResult)
      );
      consentServiceSpy.getMedicalConsent.and.returnValue({
        subscribe: () => undefined,
      });
      benefitsServiceSpy = jasmine.createSpyObj('BenefitsService', [
        'fetchSpending',
        'getBenefits',
        'getTotalPremium',
        'getTotalCostBST',
      ]);
      routerSpy = jasmine.createSpyObj('Subscription', ['navigateByUrl']);

      tpaServiceSpy = jasmine.createSpyObj('TPAService', ['getTPAData']);

      TestBed.configureTestingModule({
        declarations: [MedicalSpendingComponent],
        imports: [RouterTestingModule, IonicModule.forRoot()],
        providers: [
          {provide: ConsentService, useValue: consentServiceSpy},
          {provide: BenefitsService, useValue: benefitsServiceSpy},
          {provide: Router, useValue: routerSpy},
          {provide: AccessService, useValue: accessServiceSpy},
          {provide: TPAStreamService, useValue: tpaServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(MedicalSpendingComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'checkAuthorization');
      spyOn(component, 'skipConsentInitTPA');
    });

    it('should set currentDate', async () => {
      await component.ngOnInit();
      expect(component.currentDate).toBeDefined();
    });

    it('Should call checkMyvoyageAccess and then checkAuthorization if bst', async () => {
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({
          enableTPA: 'N',
          enableMyVoyage: 'Y',
        } as AccessResult)
      );
      await component.ngOnInit();
      expect(component.isTPA).toBeFalse();
      expect(component.isMyvoyageEnabled).toEqual(true);
      expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      expect(component.checkAuthorization).toHaveBeenCalled();
      expect(component.skipConsentInitTPA).not.toHaveBeenCalled();
    });

    it('Should call checkMyvoyageAccess and then skipConsentInitTPA if TPA', async () => {
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({
          enableTPA: 'Y',
        } as AccessResult)
      );
      await component.ngOnInit();
      expect(component.isTPA).toBeTrue();
      expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      expect(component.checkAuthorization).not.toHaveBeenCalled();
      expect(component.skipConsentInitTPA).toHaveBeenCalled();
    });
  });

  describe('skipConsentInitTPA', () => {
    beforeEach(() => {
      spyOn(component, 'getBenefits');
      spyOn(component, 'getTotalSpendTPA');
    });
    it('should set hasConsent to true, call getBenefits, and then getTotalSpendTPA', () => {
      component.skipConsentInitTPA();
      expect(component.getBenefits).toHaveBeenCalled();
      expect(component.getTotalSpendTPA).toHaveBeenCalled();
    });
  });

  describe('checkAuthorization', () => {
    beforeEach(() => {
      component.hasConsent = false;
      spyOn(component, 'getSpending');
      spyOn(component, 'getBenefits');
      spyOn(component.subscription, 'add');
    });
    it('when hasConsent would be true', () => {
      const observable = of(true);
      consentServiceSpy.getMedicalConsent.and.returnValue(observable);
      component.checkAuthorization();
      expect(component.hasConsent).toEqual(true);
      expect(component.getSpending).toHaveBeenCalled();
      expect(component.getBenefits).toHaveBeenCalled();
      expect(consentServiceSpy.getMedicalConsent).toHaveBeenCalled();
      expect(component.subscription.add).toHaveBeenCalled();
    });
    it('when hasConsent would be false', () => {
      const observable = of(false);
      consentServiceSpy.getMedicalConsent.and.returnValue(observable);
      component.checkAuthorization();
      expect(component.hasConsent).toEqual(false);
      expect(component.getSpending).not.toHaveBeenCalled();
      expect(component.getBenefits).not.toHaveBeenCalled();
    });
  });

  describe('getTotalSpendTPA', () => {
    beforeEach(() => {
      jasmine.clock().install();
      const today = new Date('2023-01-25');
      jasmine.clock().mockDate(today);
      spyOn(component.subscription, 'add');
    });

    it('should set hasConsent to true if has carriers and tpaWaiting to true if no claims', () => {
      const tpaData = {
        claims: [],
        carriers: [{} as TPACarrier],
        groupingClaimsByYear: {
          2023: {
            claimTotalCount: 20,
            inNetworkTotalCount: 10,
            outNetworkTotalCount: 10,
            outOfPocketAmountTotal: 5000,
            year: '2023',
            aggregateServiceNameClaims: {},
          },
        },
      };
      tpaServiceSpy.getTPAData.and.returnValue(of(tpaData));
      component.getTotalSpendTPA();
      expect(component.hasConsent).toBeTrue();
      expect(component.isTPAWaiting).toBeTrue();
    });

    it('should set tpaWaiting to false if has carriers and claims', () => {
      const tpaData = {
        claims: [{} as NameCategory],
        carriers: [{} as TPACarrier],
        groupingClaimsByYear: {
          2023: {
            claimTotalCount: 20,
            inNetworkTotalCount: 10,
            outNetworkTotalCount: 10,
            outOfPocketAmountTotal: 5000,
            year: '2023',
            aggregateServiceNameClaims: {},
          },
        },
      };
      tpaServiceSpy.getTPAData.and.returnValue(of(tpaData));
      component.getTotalSpendTPA();
      expect(component.hasConsent).toBeTrue();
      expect(component.isTPAWaiting).toBeFalse();
    });

    it('should call getTPAData and set totalSpend, hasConsent & isTPAWaiting', () => {
      const tpaData = {
        claims: [],
        carriers: [],
        groupingClaimsByYear: {
          2023: {
            claimTotalCount: 20,
            inNetworkTotalCount: 10,
            outNetworkTotalCount: 10,
            outOfPocketAmountTotal: 5000,
            year: '2023',
            aggregateServiceNameClaims: {},
          },
        },
      };
      tpaServiceSpy.getTPAData.and.returnValue(of(tpaData));
      component.getTotalSpendTPA();
      expect(component.totalSpend).toEqual(5000);
      expect(component.subscription.add).toHaveBeenCalled();
      expect(component.hasConsent).toEqual(false);
      expect(component.isTPAWaiting).toEqual(false);
    });

    it('should call getTPAData and set totalSpend to 0 if no data', () => {
      component.totalSpend = 0;
      const tpaData = {
        groupingClaimsByYear: {
          2021: {
            claimTotalCount: 20,
            inNetworkTotalCount: 10,
            outNetworkTotalCount: 10,
            outOfPocketAmountTotal: 5000,
            year: '2021',
            aggregateServiceNameClaims: {},
          },
        },
        claims: [],
        carriers: [],
      };
      tpaServiceSpy.getTPAData.and.returnValue(of(tpaData));
      component.getTotalSpendTPA();
      expect(component.totalSpend).toEqual(0);
    });

    it('should handle any errors with getting data from tpa and set values to 0', () => {
      const tpaData = {
        claims: [],
        carriers: [],
      };
      tpaServiceSpy.getTPAData.and.returnValue(of(tpaData));
      component.getTotalSpendTPA();
      expect(component.totalSpend).toEqual(0);
      expect(component.hasConsent).toBeFalse();
      expect(component.isTPAWaiting).toBeFalse();
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });
  });

  describe('getSpending', () => {
    beforeEach(() => {
      component.totalSpend = 0;
      benefitsServiceSpy.getTotalCostBST.and.returnValue(6);
    });
    it('should call getTotalCostBST and fetchSpending func of benefitsService', async () => {
      benefitsServiceSpy.fetchSpending.and.returnValue(
        Promise.resolve(mockHealthData)
      );
      await component.getSpending();
      expect(benefitsServiceSpy.fetchSpending).toHaveBeenCalled();
      expect(benefitsServiceSpy.getTotalCostBST).toHaveBeenCalled();
      expect(component.totalSpend).toEqual(6);
    });
  });

  describe('getBenefits', () => {
    const mockBenefits = {
      isEnrollmentWindowEnabled: false,
      planYear: 2022,
      enrolled: [],
      declined: [],
      provided: [],
    };
    beforeEach(() => {
      benefitsServiceSpy.getBenefits.and.returnValue(
        Promise.resolve(mockBenefits)
      );
      component.totalPremiumSavvi = 0;
      benefitsServiceSpy.getTotalPremium.and.returnValue(10);
    });
    it('should call getTotalPremium and getBenefits fun of benefitsService', async () => {
      await component.getBenefits();
      expect(benefitsServiceSpy.getBenefits).toHaveBeenCalled();
      expect(benefitsServiceSpy.getTotalPremium).toHaveBeenCalled();
      expect(component.totalPremiumSavvi).toEqual(10);
    });
  });

  it('viewDetails', () => {
    component.viewDetails();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('coverages');
  });

  it('ngOnDestroy', () => {
    spyOn(component.subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscription.unsubscribe).toHaveBeenCalled();
  });
});
