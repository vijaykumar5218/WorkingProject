import {
  ComponentFixture,
  TestBed,
  waitForAsync,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';
import * as orangeMoney from './constants/orangeMoney.json';
import {OrangeMoneyComponent} from './orange-money.component';
import {OrangeMoneyService} from './services/orange-money.service';
import {PopupInputDialogComponent} from '@shared-lib/components/popup-input-dialog/popup-input-dialog.component';
import {PopupInputType} from '@shared-lib/components/popup-input-dialog/constants/popup-input-type.enum';
import {
  OMStatus,
  OrangeData,
  OrangeMoneyHeader,
} from '@shared-lib/services/account/models/orange-money.model';
import {of} from 'rxjs';
import {delay} from 'rxjs/operators';
import {AccountService} from '@shared-lib/services/account/account.service';
import * as moment from 'moment';
import {OMTooltipComponent} from './component/om-tooltip/omtooltip.component';
import {AccessService} from '@shared-lib/services/access/access.service';
import {OMEligibleData} from '@shared-lib/services/account/models/omeligible.model';

describe('OrangeMoneyComponent', () => {
  let component: OrangeMoneyComponent;
  let fixture: ComponentFixture<OrangeMoneyComponent>;
  let fetchSpy;
  const orangeText = JSON.parse(JSON.stringify(orangeMoney)).default;
  let modalControllerSpy;
  let orangeMoneyServiceSpy;
  let accountServiceSpy;
  let orangeTestData: OrangeData;
  let fakeAccountData;
  let accessServiceSpy;
  let omEligTestData: OMEligibleData;

  beforeEach(
    waitForAsync(() => {
      modalControllerSpy = jasmine.createSpyObj('ModalController', [
        'create',
        'onDidDismiss',
      ]);
      orangeMoneyServiceSpy = jasmine.createSpyObj('OrangeMoneyService', [
        'getOrangeData',
        'getOrangeMoneyStatus',
        'getEstimates',
        'saveRetiremnetAgeFE',
        'saveRetirementAgeNonFE',
        'saveSalaryFE',
        'saveSalaryNonFE',
        'getOMEligibility',
      ]);
      accountServiceSpy = jasmine.createSpyObj('AccountService', [
        'getParticipant',
        'openPwebAccountLink',
        'fetchAccountsContent',
        'getAccount',
        'getAllAccountsWithOutHSA',
      ]);
      accessServiceSpy = jasmine.createSpyObj('AccessService', [
        'checkMyvoyageAccess',
      ]);
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({myWorkplaceDashboardEnabled: true})
      );

      TestBed.configureTestingModule({
        declarations: [OrangeMoneyComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: OrangeMoneyService, useValue: orangeMoneyServiceSpy},
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: AccountService, useValue: accountServiceSpy},
          {provide: AccessService, useValue: accessServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(OrangeMoneyComponent);
      component = fixture.componentInstance;
      fetchSpy = spyOn(component, 'fetchData');
      fixture.detectChanges();

      fakeAccountData = {
        accountTitle: 'Kohler Co. 401(k) Savings Plan',
        accountBalance: '100',
        accountBalanceAsOf: '08/03/2023',
        suppressTab: true,
        voyaSavings: 'voyaSavings',
        includedInOrangeMoney: false,
        accountAllowedForMyVoya: false,
        clientId: 'KOHLR',
        planId: '623040',
        planType: 'retirement',
        accountNumber: '623040@KOHLER@014649507',
        needOMAutomaticUpdate: false,
        planName: 'Kohler 401k Savings',
        mpStatus: 'mpStatus',
        clientAllowed4myVoyaOrSSO: false,
        useMyvoyaHomepage: false,
        advisorNonMoneyTxnAllowed: false,
        advisorMoneyTxnAllowed: false,
        nqPenCalPlan: false,
        enrollmentAllowed: false,
        autoEnrollmentAllowed: false,
        vruPhoneNumber: '888-000-0000',
        rmdRecurringPaymentInd: 'paymentId',
        navigateToRSPortfolio: false,
        planLink: 'planLink',
        openDetailInNewWindow: false,
        nqPlan: false,
        new: false,
        eligibleForOrangeMoney: false,
        iraplan: false,
        xsellRestricted: false,
        isVoyaAccessPlan: false,
        isRestrictedRetirementPlan: false,
        isVDAApplication: false,
        isVendorPlan: false,
      };

      accountServiceSpy.getAccount.and.returnValue(fakeAccountData);

      orangeTestData = {
        feForecastData: {
          investmentRateOfReturn: 0,
          participantData: {
            selectedRetirementAge: 0,
            salary: {
              amount: 0,
              growthRate: 0,
            },
            retirementAgeSlider: {
              min: 56,
              max: 120,
            },
          },
          feForecast: {
            totalIncome: 0,
            goal: 0,
            errorCode: '',
            desiredGoal: 0,
            minimumGoal: 0,
          },
        },
      };
      omEligTestData = {
        eligible: 'true',
        planId: '776991',
      };
      orangeMoneyServiceSpy.getOMEligibility.and.returnValue(
        Promise.resolve(omEligTestData)
      );
      const accData = {
        retirementAccounts: {
          dataStatus: 'OK',
          errorCode: 'NO_ERROR',
          accounts: [
            {
              agreementId:
                '8B308019A0CC107653A4A2FF35CFDDC7E12CABEEE69ABA2544EEA814032A2984',
              accountTitle: 'VOYA 401(K) SAVINGS PLAN',
              accountType: 'Investment',
              accountBalance: '146215.26',
              accountBalanceAsOf: '10/23/2023',
              sourceSystem: 'EASE',
              suppressTab: false,
              voyaSavings: '146215.26',
              includedInOrangeMoney: false,
              accountAllowedForMyVoya: false,
              clientId: 'INGWIN',
              planId: '776991',
              planType: 'DC',
              accountNumber: '776991@INGWIN@871827530',
              needOMAutomaticUpdate: false,
              planName: 'VOYA 401(K) SAVINGS PLAN',
              mpStatus: '0',
              firstName: 'Gideon',
              lastName: 'Tuikku-DP',
              clientAllowed4myVoyaOrSSO: true,
              useMyvoyaHomepage: true,
              advisorNonMoneyTxnAllowed: false,
              advisorMoneyTxnAllowed: false,
              nqPenCalPlan: false,
              enrollmentAllowed: false,
              autoEnrollmentAllowed: false,
              vruPhoneNumber: '1-800-584-6001',
              rmdRecurringPaymentInd: 'N',
              navigateToRSPortfolio: true,
              planLink:
                'https://my3.intg.voya.com/myvoyaui/index.html#/retirement/details/8B308019A0CC107653A4A2FF35CFDDC7E12CABEEE69ABA2544EEA814032A2984?clientId=INGWIN&domain=voyaretirement.intg.voya.com',
              openDetailInNewWindow: false,
              nqPlan: false,
              portalSupportFlag: true,
              applicationLink: {
                linkName: 'Go To My Account',
                linkHref:
                  '/myvoya/link?type=retirement&token=yRqwSz6IZcZFnTHmUngCrfyvzHocehc2EuUk3gr6ZNH3JDSh7CylDqmnwNQt6o5pUiQ1JHtVIlQdFVYE80WhT9v0c7Ee6XPG348G4zHG%2Fcc%3D',
              },
              clientDomain: 'voyaretirement.intg.voya.com',
              csSessionId: 'aiZKUl6Aw12FQikdNbHKVQ11.i9290',
              new: false,
              xsellRestricted: false,
              iraplan: false,
              eligibleForOrangeMoney: false,
              isVoyaAccessPlan: false,
              isRestrictedRetirementPlan: false,
              isVDAApplication: false,
              isSavingsPlan: true,
            },
          ],
        },
      };
      accountServiceSpy.getAllAccountsWithOutHSA.and.returnValue(
        Promise.resolve(accData)
      );
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call fetchData', async () => {
      component.ngOnInit();
      expect(component.fetchData).toHaveBeenCalled();
    });
    it('should call getAccount from AccountService and set account', () => {
      component.account = undefined;
      component.ngOnInit();
      expect(accountServiceSpy.getAccount).toHaveBeenCalled();
    });
    it('should call getAccess from AccessService and set workplaceDashboardEnabled', async () => {
      component.workplaceDashboardEnabled = undefined;
      component.suppressEdit = undefined;
      component.fromJourneys = true;
      await component.ngOnInit();
      expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      expect(component.workplaceDashboardEnabled).toBeTrue();
    });

    it('should set suppressEdit to default to false if dashboard is not enabled', async () => {
      component.suppressEdit = undefined;
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({myWorkplaceDashboardEnabled: false})
      );
      await component.ngOnInit();
      expect(component.suppressEdit).toBeFalse();
      expect(component['planLink']).toBeUndefined();
    });

    it('should set suppressEdit to false if dashboard is enabled but not from journeys', async () => {
      component.suppressEdit = undefined;
      component.fromJourneys = false;
      await component.ngOnInit();
      expect(component.suppressEdit).toBeFalse();
    });
    it('should not set suppress to false if plan id is not present', async () => {
      component['planLink'] = undefined;
      component.fromJourneys = true;
      orangeMoneyServiceSpy.getOMEligibility.and.returnValue(
        Promise.resolve(undefined)
      );
      await component.ngOnInit();
      expect(component.suppressEdit).toBeTrue();
    });
    it('should set suppressEdit to true if no match account is found', async () => {
      component['planLink'] = undefined;
      component.fromJourneys = true;
      orangeMoneyServiceSpy.getOMEligibility.and.returnValue(
        Promise.resolve({eligible: 'true', planId: '123'})
      );
      accountServiceSpy.getAllAccountsWithOutHSA.and.returnValue(
        Promise.resolve({retirementAccounts: {accounts: []}})
      );
      await component.ngOnInit();
      expect(component.suppressEdit).toBeTrue();
    });
  });

  describe('openTooltip', () => {
    it('should open tooltip modal', async () => {
      const omHeaderData: OrangeMoneyHeader = {
        OMHeader: 'omheader',
        OMTooltip: 'orange money tooltip test',
      };
      component.omHeader = omHeaderData;
      const modal = jasmine.createSpyObj('Modal', ['present']);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modal));

      await component.openTooltip();

      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: OMTooltipComponent,
        cssClass: 'modal-not-fullscreen',
        componentProps: {
          tooltipContent: omHeaderData.OMTooltip,
        },
      });
      expect(modal.present).toHaveBeenCalled();
    });
  });

  describe('fetchData', () => {
    let estimatesData;

    beforeEach(() => {
      fetchSpy.and.callThrough();

      const omHeaderData: OrangeMoneyHeader = {
        OMHeader: 'omheader',
        OMTooltip: 'orange money tooltip test',
      };
      accountServiceSpy.fetchAccountsContent.and.returnValue(of(omHeaderData));

      const participantData = {
        firstName: 'Joseph',
        lastName: 'lastName',
        birthDate: '08/08/1961',
        displayName: '',
        age: '',
        profileId: 'profileId',
      };
      accountServiceSpy.getParticipant.and.returnValue(
        of(participantData).pipe(delay(1))
      );

      orangeMoneyServiceSpy.getOrangeData.and.returnValue(
        of(orangeTestData).pipe()
      );

      spyOn(component, 'omStatusChanged');
      spyOn(component, 'setProgressWidth');

      estimatesData = {
        estimatedMonthlyIncome: 100.0,
        estimatedMonthlyGoal: 500.0,
        difference: 400.0,
        retirementAge: 100,
        currSalary: 150000.0,
      };
    });

    it('if retirement age < current age, set retirement age to current age + 1', fakeAsync(() => {
      estimatesData = {
        estimatedMonthlyIncome: 100.0,
        estimatedMonthlyGoal: 500.0,
        difference: 400.0,
        retirementAge: 2,
        currSalary: 150000.0,
      };
      orangeMoneyServiceSpy.getEstimates.and.returnValue(estimatesData);

      orangeMoneyServiceSpy.getOrangeMoneyStatus.and.returnValue(
        OMStatus.ORANGE_DATA
      );

      component.fetchData();
      tick(1);

      expect(component.estimates.retirementAge).toEqual(
        component.currentAge + 1
      );
    }));

    it('should fetch data OM', fakeAsync(() => {
      orangeMoneyServiceSpy.getEstimates.and.returnValue(estimatesData);

      orangeMoneyServiceSpy.getOrangeMoneyStatus.and.returnValue(
        OMStatus.ORANGE_DATA
      );

      component.fetchData();
      tick(1);

      expect(accountServiceSpy.fetchAccountsContent).toHaveBeenCalledWith();
      expect(component.omHeader).toEqual({
        OMHeader: 'omheader',
        OMTooltip: 'orange money tooltip test',
      });

      expect(accountServiceSpy.getParticipant).toHaveBeenCalled();
      expect(orangeMoneyServiceSpy.getOrangeData).toHaveBeenCalled();
      expect(component.omStatusChanged).toHaveBeenCalledWith(
        OMStatus.ORANGE_DATA
      );
      expect(orangeMoneyServiceSpy.getEstimates).toHaveBeenCalledWith(
        orangeTestData
      );
      expect(component.estimates).toEqual(estimatesData);
      expect(component.setProgressWidth).toHaveBeenCalled();

      const currentYear = 2023;
      expect(component.currentAge).toEqual(currentYear - 1961);
      const currentAge = moment().diff(
        moment('08/10/1961', 'MM/DD/YYYY'),
        'years'
      );
      expect(component.currentAge).toEqual(currentAge);
      expect(component.retirementAgeMin).toEqual(component.currentAge + 1);
      expect(component.retirementAgeMax).toEqual(80);
    }));

    it('should fetch data FE', fakeAsync(() => {
      orangeMoneyServiceSpy.getEstimates.and.returnValue(estimatesData);

      orangeMoneyServiceSpy.getOrangeMoneyStatus.and.returnValue(
        OMStatus.FE_DATA
      );

      component.fetchData();
      tick(1);

      expect(accountServiceSpy.fetchAccountsContent).toHaveBeenCalledWith();
      expect(component.omHeader).toEqual({
        OMHeader: 'omheader',
        OMTooltip: 'orange money tooltip test',
      });

      expect(accountServiceSpy.getParticipant).toHaveBeenCalled();
      expect(orangeMoneyServiceSpy.getOrangeData).toHaveBeenCalled();
      expect(component.omStatusChanged).toHaveBeenCalledWith(OMStatus.FE_DATA);
      expect(orangeMoneyServiceSpy.getEstimates).toHaveBeenCalledWith(
        orangeTestData
      );
      expect(component.estimates).toEqual(estimatesData);
      expect(component.setProgressWidth).toHaveBeenCalled();

      const currentYear = 2023;
      expect(component.currentAge).toEqual(currentYear - 1961);
      const currentAge = moment().diff(
        moment('08/10/1961', 'MM/DD/YYYY'),
        'years'
      );
      expect(component.currentAge).toEqual(currentAge);
      expect(component.retirementAgeMin).toEqual(
        orangeTestData.feForecastData.participantData.retirementAgeSlider.min
      );
      expect(component.retirementAgeMax).toEqual(
        orangeTestData.feForecastData.participantData.retirementAgeSlider.max
      );
    }));

    it('should not call setProgress if estimates = null', fakeAsync(() => {
      orangeMoneyServiceSpy.getEstimates.and.returnValue(null);

      orangeMoneyServiceSpy.getOrangeMoneyStatus.and.returnValue(
        OMStatus.FE_DATA
      );

      component.fetchData();
      tick(1);

      expect(accountServiceSpy.getParticipant).toHaveBeenCalled();
      expect(orangeMoneyServiceSpy.getOrangeData).toHaveBeenCalled();
      expect(component.omStatusChanged).toHaveBeenCalledWith(OMStatus.FE_DATA);
      expect(orangeMoneyServiceSpy.getEstimates).toHaveBeenCalledWith(
        orangeTestData
      );
      expect(component.estimates).toEqual(null);
      expect(component.setProgressWidth).not.toHaveBeenCalled();

      const currentYear = 2023;
      expect(component.currentAge).toEqual(currentYear - 1961);
      const currentAge = moment().diff(
        moment('08/10/1961', 'MM/DD/YYYY'),
        'years'
      );
      expect(component.currentAge).toEqual(currentAge);
      expect(component.retirementAgeMin).toEqual(
        orangeTestData.feForecastData.participantData.retirementAgeSlider.min
      );
      expect(component.retirementAgeMax).toEqual(
        orangeTestData.feForecastData.participantData.retirementAgeSlider.max
      );
    }));
  });

  describe('refreshData', () => {
    it('should refresh the data', () => {
      component.refreshData();
      expect(component.estimates).toEqual(null);
      expect(orangeMoneyServiceSpy.getOrangeData).toHaveBeenCalledWith(true);
    });
  });

  describe('editOrangeMoney', () => {
    it('should open in plan link in same tab when dahsboard ON', async () => {
      component.account = fakeAccountData;
      component.account.planLink = 'planLink';
      component.workplaceDashboardEnabled = true;
      component.fromJourneys = false;
      await component.editOrangeMoney();
      expect(accountServiceSpy.openPwebAccountLink).toHaveBeenCalledWith(
        component.account.planLink,
        '_self'
      );
    });
    it('should open in protifolio/page link in new tab when dahsboard OFF', async () => {
      component.omHeader = {
        OMTooltip:
          '<p><strong>IMPORTANT:</strong></p>\r\n\r\n<p>The Illustrations or other information generated by the calculators are hypothetical&nbsp;in nature, do not reflect actual investment results, and are not guarantees of future results. This information does not serve, either directly or indirectly, as legal, financial or tax advice and you should always consult a qualified professional legal, financial and/or tax advisor when making decisions related to your individual tax situation.</p>\r\n',
        OMHeader: 'myOrangeMoney®',
        OMDeeplink:
          'https://login.intg.voya.com/saml/sps/saml-idp-login/saml20/logininitial?PartnerId=https://my3.intg.voya.com/mga/sps/saml-sp-my-local/saml20&access_token=[exchanged_access_token]&Target=https://my3.intg.voya.com/voyasso/mobileSignOn?domain=smithbarney.intg.voya.com&target=https://my3.intg.voya.com/myvoyaui/index.html#/retirement/portfolio',
      };
      component.workplaceDashboardEnabled = false;
      await component.editOrangeMoney();
      expect(accountServiceSpy.openPwebAccountLink).toHaveBeenCalledWith(
        component.omHeader.OMDeeplink,
        ''
      );
    });
    it('should open in plan link with matched account in same tab when dahsboard ON and fromjourney is true', async () => {
      component.fromJourneys = true;
      component.workplaceDashboardEnabled = true;
      orangeMoneyServiceSpy.getOMEligibility.and.returnValue(
        Promise.resolve({eligible: 'true', planId: '776991'})
      );
      const accData = {
        retirementAccounts: {
          dataStatus: 'OK',
          errorCode: 'NO_ERROR',
          accounts: [
            {
              agreementId:
                '8B308019A0CC107653A4A2FF35CFDDC7E12CABEEE69ABA2544EEA814032A2984',
              accountTitle: 'VOYA 401(K) SAVINGS PLAN',
              accountType: 'Investment',
              accountBalance: '146215.26',
              accountBalanceAsOf: '10/23/2023',
              sourceSystem: 'EASE',
              suppressTab: false,
              voyaSavings: '146215.26',
              includedInOrangeMoney: false,
              accountAllowedForMyVoya: false,
              clientId: 'INGWIN',
              planId: '776991',
              planType: 'DC',
              accountNumber: '776991@INGWIN@871827530',
              needOMAutomaticUpdate: false,
              planName: 'VOYA 401(K) SAVINGS PLAN',
              mpStatus: '0',
              firstName: 'Gideon',
              lastName: 'Tuikku-DP',
              clientAllowed4myVoyaOrSSO: true,
              useMyvoyaHomepage: true,
              advisorNonMoneyTxnAllowed: false,
              advisorMoneyTxnAllowed: false,
              nqPenCalPlan: false,
              enrollmentAllowed: false,
              autoEnrollmentAllowed: false,
              vruPhoneNumber: '1-800-584-6001',
              rmdRecurringPaymentInd: 'N',
              navigateToRSPortfolio: true,
              planLink:
                'https://my3.intg.voya.com/myvoyaui/index.html#/retirement/details/8B308019A0CC107653A4A2FF35CFDDC7E12CABEEE69ABA2544EEA814032A2984?clientId=INGWIN&domain=voyaretirement.intg.voya.com',
              openDetailInNewWindow: false,
              nqPlan: false,
              portalSupportFlag: true,
              applicationLink: {
                linkName: 'Go To My Account',
                linkHref:
                  '/myvoya/link?type=retirement&token=yRqwSz6IZcZFnTHmUngCrfyvzHocehc2EuUk3gr6ZNH3JDSh7CylDqmnwNQt6o5pUiQ1JHtVIlQdFVYE80WhT9v0c7Ee6XPG348G4zHG%2Fcc%3D',
              },
              clientDomain: 'voyaretirement.intg.voya.com',
              csSessionId: 'aiZKUl6Aw12FQikdNbHKVQ11.i9290',
              new: false,
              xsellRestricted: false,
              iraplan: false,
              eligibleForOrangeMoney: false,
              isVoyaAccessPlan: false,
              isRestrictedRetirementPlan: false,
              isVDAApplication: false,
              isSavingsPlan: true,
            },
          ],
        },
      };
      accountServiceSpy.getAllAccountsWithOutHSA.and.returnValue(
        Promise.resolve(accData)
      );
      await component.ngOnInit();
      await component.editOrangeMoney();
      expect(accountServiceSpy.openPwebAccountLink).toHaveBeenCalledWith(
        'https://my3.intg.voya.com/myvoyaui/index.html#/retirement/details/8B308019A0CC107653A4A2FF35CFDDC7E12CABEEE69ABA2544EEA814032A2984?clientId=INGWIN&domain=voyaretirement.intg.voya.com',
        '_self'
      );
    });
  });

  describe('omStatusChanged', () => {
    it('should show if status == ORANGE_DATA', () => {
      component.shouldHide = true;
      component.omStatusChanged(OMStatus.ORANGE_DATA);
      expect(component.shouldHide).toEqual(false);
    });

    it('should show if status == FE_DATA', () => {
      component.shouldHide = true;
      component.omStatusChanged(OMStatus.FE_DATA);
      expect(component.shouldHide).toEqual(false);
    });

    it('should show if status == MADLIB_OM', () => {
      component.shouldHide = false;
      component.omStatusChanged(OMStatus.MADLIB_OM);
      expect(component.shouldHide).toEqual(true);
    });

    it('should show if status == MADLIB_FE', () => {
      component.shouldHide = false;
      component.omStatusChanged(OMStatus.MADLIB_FE);
      expect(component.shouldHide).toEqual(true);
    });

    it('should show if status == SERVICE_DOWN', () => {
      component.shouldHide = false;
      component.omStatusChanged(OMStatus.SERVICE_DOWN);
      expect(component.shouldHide).toEqual(true);
    });

    it('should show if status == UNKNOWN', () => {
      component.shouldHide = false;
      component.omStatusChanged(OMStatus.UNKNOWN);
      expect(component.shouldHide).toEqual(true);
    });
  });

  describe('setProgressWidth', () => {
    it('should set progressWidth', () => {
      component.estimates = {
        estimatedMonthlyIncome: 100.0,
        estimatedMonthlyGoal: 500.0,
        difference: 400.0,
        retirementAge: 65,
        currSalary: 150000.0,
      };

      component.progressWidth = 0;
      component.setProgressWidth();

      const result =
        (component.estimates.estimatedMonthlyIncome * 100.0) /
        component.estimates.estimatedMonthlyGoal;
      expect(component.progressWidth).toBe(result);
    });

    it('should set progressWidth to 100 if > 100', () => {
      component.estimates = {
        estimatedMonthlyIncome: 600.0,
        estimatedMonthlyGoal: 500.0,
        difference: 400.0,
        retirementAge: 65,
        currSalary: 150000.0,
      };

      component.progressWidth = 0;
      component.setProgressWidth();

      expect(component.progressWidth).toBe(100);
    });
  });

  describe('editCurrentSalary', () => {
    it('should show the modal for edit current salary', async () => {
      const modal = jasmine.createSpyObj('HTMLIonModalElement', [
        'present',
        'onDidDismiss',
      ]);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modal));
      modal.onDidDismiss.and.returnValue(
        Promise.resolve({
          data: {
            saved: false,
          },
        })
      );

      component.estimates = {
        estimatedMonthlyIncome: 100.0,
        estimatedMonthlyGoal: 500.0,
        difference: 400.0,
        retirementAge: 65,
        currSalary: 150000.0,
      };
      await component.editCurrentSalary();

      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: PopupInputDialogComponent,
        cssClass: 'modal-not-fullscreen',
        componentProps: {
          title: orangeText.dialogs.currentSalaryTitle,
          inputTitle: orangeText.dialogs.currentSalaryInputTitle,
          value: 150000.0,
          inputType: PopupInputType.currency,
          validator: jasmine.any(Function),
          saveFunction: jasmine.any(Function),
        },
      });
      expect(modal.present).toHaveBeenCalled();
    });

    it('should properly use save function and return true on success', async () => {
      const modal = jasmine.createSpyObj('HTMLIonModalElement', [
        'present',
        'onDidDismiss',
      ]);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modal));
      modal.onDidDismiss.and.returnValue(
        Promise.resolve({
          data: {
            saved: false,
          },
        })
      );

      component.estimates = {
        estimatedMonthlyIncome: 100.0,
        estimatedMonthlyGoal: 500.0,
        difference: 400.0,
        retirementAge: 65,
        currSalary: 150000.0,
      };
      component.growthRate = 2;
      component.minimumGoal = 100;
      component.desiredGoal = 200;
      component.dateOfBirth = '03/28/1950';

      modalControllerSpy.create.calls.reset();
      component.orangeData = orangeTestData;
      await component.editCurrentSalary();

      const saveFunction = modalControllerSpy.create.calls.all()[0].args[0]
        .componentProps.saveFunction;

      orangeMoneyServiceSpy.saveSalaryFE.calls.reset();
      orangeMoneyServiceSpy.saveSalaryNonFE.calls.reset();

      //Test FE
      orangeMoneyServiceSpy.saveSalaryFE.and.returnValue(
        Promise.resolve({
          feForecastData: {},
        })
      );
      component.omStatus = OMStatus.FE_DATA;
      const result1 = await saveFunction('5000.25');
      expect(orangeMoneyServiceSpy.saveSalaryFE).toHaveBeenCalledWith(
        5000.25,
        2,
        200,
        100
      );
      expect(result1).toEqual(true);

      //Test NON FE
      orangeMoneyServiceSpy.saveSalaryNonFE.and.returnValue(
        Promise.resolve({
          success: true,
        })
      );

      const dob = moment(component.dateOfBirth, 'MM/DD/YYYY').toISOString();
      component.omStatus = OMStatus.ORANGE_DATA;
      const result2 = await saveFunction('5000.25');
      expect(orangeMoneyServiceSpy.saveSalaryNonFE).toHaveBeenCalledWith(
        5000.25,
        dob,
        orangeTestData
      );
      expect(result2).toEqual(true);
    });

    it('should properly use validator function', async () => {
      const modal = jasmine.createSpyObj('HTMLIonModalElement', [
        'present',
        'onDidDismiss',
      ]);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modal));
      modal.onDidDismiss.and.returnValue(
        Promise.resolve({
          data: {
            saved: false,
          },
        })
      );

      component.estimates = {
        estimatedMonthlyIncome: 100.0,
        estimatedMonthlyGoal: 500.0,
        difference: 400.0,
        retirementAge: 65,
        currSalary: 150000.0,
      };

      modalControllerSpy.create.calls.reset();
      await component.editCurrentSalary();

      const validator = modalControllerSpy.create.calls.all()[0].args[0]
        .componentProps.validator;

      let result = validator(150000.0);
      expect(result).toEqual(orangeText.dialogs.validations.incomeSame);

      result = validator(92);
      expect(result).toEqual(null);

      result = validator(1);
      expect(result).toEqual(null);

      result = validator(0);
      expect(result).toEqual(orangeText.dialogs.validations.incomeBetween);

      result = validator(9999999.99);
      expect(result).toEqual(orangeText.dialogs.validations.incomeBetween);
    });

    it('should return false if invalid status on save function', async () => {
      orangeMoneyServiceSpy.saveSalaryFE.calls.reset();
      orangeMoneyServiceSpy.saveSalaryNonFE.calls.reset();

      const modal = jasmine.createSpyObj('HTMLIonModalElement', [
        'present',
        'onDidDismiss',
      ]);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modal));
      modal.onDidDismiss.and.returnValue(
        Promise.resolve({
          data: {
            saved: false,
          },
        })
      );

      component.estimates = {
        estimatedMonthlyIncome: 100.0,
        estimatedMonthlyGoal: 500.0,
        difference: 400.0,
        retirementAge: 65,
        currSalary: 150000.0,
      };

      modalControllerSpy.create.calls.reset();
      await component.editCurrentSalary();

      const saveFunction = modalControllerSpy.create.calls.all()[0].args[0]
        .componentProps.saveFunction;

      //Nothing should be set if not a valid status
      component.omStatus = OMStatus.UNKNOWN;
      const result = await saveFunction(15);
      expect(orangeMoneyServiceSpy.saveSalaryNonFE).not.toHaveBeenCalled();
      expect(orangeMoneyServiceSpy.saveSalaryFE).not.toHaveBeenCalled();
      expect(orangeMoneyServiceSpy.saveSalaryNonFE).not.toHaveBeenCalled();
      expect(result).toEqual(false);
    });
  });

  describe('editRetirementAge', () => {
    it('should show the modal for edit retirement age', async () => {
      const modal = jasmine.createSpyObj('HTMLIonModalElement', [
        'present',
        'onDidDismiss',
      ]);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modal));
      modal.onDidDismiss.and.returnValue(
        Promise.resolve({
          data: {
            saved: false,
          },
        })
      );

      component.estimates = {
        estimatedMonthlyIncome: 100.0,
        estimatedMonthlyGoal: 500.0,
        difference: 400.0,
        retirementAge: 65,
        currSalary: 150000.0,
      };
      await component.editRetirementAge();

      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: PopupInputDialogComponent,
        cssClass: 'modal-not-fullscreen',
        componentProps: {
          title: orangeText.dialogs.RetirementAgeTitle,
          inputTitle: orangeText.dialogs.RetirementAgeInputTitle,
          value: 65,
          inputType: PopupInputType.number,
          validator: jasmine.any(Function),
          saveFunction: jasmine.any(Function),
        },
      });
      expect(modal.present).toHaveBeenCalled();
    });

    it('should show the modal and pass undefined for edit retirement age when estimates is null (should not error out)', async () => {
      const modal = jasmine.createSpyObj('HTMLIonModalElement', [
        'present',
        'onDidDismiss',
      ]);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modal));
      modal.onDidDismiss.and.returnValue(
        Promise.resolve({
          data: {
            saved: false,
          },
        })
      );

      component.estimates = null;
      await component.editRetirementAge();

      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: PopupInputDialogComponent,
        cssClass: 'modal-not-fullscreen',
        componentProps: {
          title: orangeText.dialogs.RetirementAgeTitle,
          inputTitle: orangeText.dialogs.RetirementAgeInputTitle,
          value: undefined,
          inputType: PopupInputType.number,
          validator: jasmine.any(Function),
          saveFunction: jasmine.any(Function),
        },
      });
      expect(modal.present).toHaveBeenCalled();
    });

    it('should properly use save function and return true on success', async () => {
      const modal = jasmine.createSpyObj('HTMLIonModalElement', [
        'present',
        'onDidDismiss',
      ]);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modal));
      modal.onDidDismiss.and.returnValue(
        Promise.resolve({
          data: {
            saved: false,
          },
        })
      );

      component.estimates = {
        estimatedMonthlyIncome: 100.0,
        estimatedMonthlyGoal: 500.0,
        difference: 400.0,
        retirementAge: 65,
        currSalary: 150000.0,
      };

      modalControllerSpy.create.calls.reset();
      component.orangeData = orangeTestData;
      await component.editRetirementAge();

      const saveFunction = modalControllerSpy.create.calls.all()[0].args[0]
        .componentProps.saveFunction;

      orangeMoneyServiceSpy.saveRetiremnetAgeFE.calls.reset();
      orangeMoneyServiceSpy.saveRetirementAgeNonFE.calls.reset();

      //Test FE
      orangeMoneyServiceSpy.saveRetiremnetAgeFE.and.returnValue(
        Promise.resolve({
          result: {
            errors: [],
            valid: true,
          },
        })
      );
      component.omStatus = OMStatus.FE_DATA;
      const result1 = await saveFunction(12);
      expect(orangeMoneyServiceSpy.saveRetiremnetAgeFE).toHaveBeenCalledWith(
        12
      );
      expect(result1).toEqual(true);

      //Test NON FE
      orangeMoneyServiceSpy.saveRetirementAgeNonFE.and.returnValue(
        Promise.resolve({
          result: {
            errors: [],
            valid: true,
          },
        })
      );
      component.omStatus = OMStatus.ORANGE_DATA;
      const result2 = await saveFunction(15);
      expect(orangeMoneyServiceSpy.saveRetirementAgeNonFE).toHaveBeenCalledWith(
        15,
        orangeTestData
      );
      expect(result2).toEqual(true);
    });

    it('should properly use save function and return false on error', async () => {
      const modal = jasmine.createSpyObj('HTMLIonModalElement', [
        'present',
        'onDidDismiss',
      ]);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modal));
      modal.onDidDismiss.and.returnValue(
        Promise.resolve({
          data: {
            saved: false,
          },
        })
      );

      component.estimates = {
        estimatedMonthlyIncome: 100.0,
        estimatedMonthlyGoal: 500.0,
        difference: 400.0,
        retirementAge: 65,
        currSalary: 150000.0,
      };

      modalControllerSpy.create.calls.reset();
      component.orangeData = orangeTestData;
      await component.editRetirementAge();

      const saveFunction = modalControllerSpy.create.calls.all()[0].args[0]
        .componentProps.saveFunction;

      orangeMoneyServiceSpy.saveRetiremnetAgeFE.calls.reset();
      orangeMoneyServiceSpy.saveRetirementAgeNonFE.calls.reset();

      //Test FE
      orangeMoneyServiceSpy.saveRetiremnetAgeFE.and.returnValue(
        Promise.resolve({
          result: {
            errors: [],
            valid: false,
          },
        })
      );
      component.omStatus = OMStatus.FE_DATA;
      const result1 = await saveFunction(12);
      expect(orangeMoneyServiceSpy.saveRetiremnetAgeFE).toHaveBeenCalledWith(
        12
      );
      expect(result1).toEqual(false);

      //Test NON FE
      orangeMoneyServiceSpy.saveRetirementAgeNonFE.and.returnValue(
        Promise.resolve({
          result: {
            errors: [],
            valid: false,
          },
        })
      );
      component.omStatus = OMStatus.ORANGE_DATA;
      const result2 = await saveFunction(15);
      expect(orangeMoneyServiceSpy.saveRetirementAgeNonFE).toHaveBeenCalledWith(
        15,
        orangeTestData
      );
      expect(result2).toEqual(false);
    });

    it('should return false if invalid status on save function', async () => {
      orangeMoneyServiceSpy.saveRetiremnetAgeFE.calls.reset();
      orangeMoneyServiceSpy.saveRetirementAgeNonFE.calls.reset();

      const modal = jasmine.createSpyObj('HTMLIonModalElement', [
        'present',
        'onDidDismiss',
      ]);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modal));
      modal.onDidDismiss.and.returnValue(
        Promise.resolve({
          data: {
            saved: false,
          },
        })
      );

      component.estimates = {
        estimatedMonthlyIncome: 100.0,
        estimatedMonthlyGoal: 500.0,
        difference: 400.0,
        retirementAge: 65,
        currSalary: 150000.0,
      };

      modalControllerSpy.create.calls.reset();
      await component.editRetirementAge();

      const saveFunction = modalControllerSpy.create.calls.all()[0].args[0]
        .componentProps.saveFunction;

      //Nothing should be set if not a valid status
      component.omStatus = OMStatus.UNKNOWN;
      const result = await saveFunction(15);
      expect(
        orangeMoneyServiceSpy.saveRetirementAgeNonFE
      ).not.toHaveBeenCalled();
      expect(orangeMoneyServiceSpy.saveRetiremnetAgeFE).not.toHaveBeenCalled();
      expect(result).toEqual(false);
    });

    it('should properly use validator function', async () => {
      const modal = jasmine.createSpyObj('HTMLIonModalElement', [
        'present',
        'onDidDismiss',
      ]);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modal));
      modal.onDidDismiss.and.returnValue(
        Promise.resolve({
          data: {
            saved: false,
          },
        })
      );

      component.estimates = {
        estimatedMonthlyIncome: 100.0,
        estimatedMonthlyGoal: 500.0,
        difference: 400.0,
        retirementAge: 65,
        currSalary: 150000.0,
      };

      component.retirementAgeMax = 80;
      component.retirementAgeMin = 47;

      modalControllerSpy.create.calls.reset();
      await component.editRetirementAge();

      const validator = modalControllerSpy.create.calls.all()[0].args[0]
        .componentProps.validator;

      let result = validator('sdfds');
      expect(result).toEqual(
        orangeText.dialogs.validations.retirementBetween
          .replace('{1}', 47)
          .replace('{2}', 80)
      );

      result = validator(65);
      expect(result).toEqual(orangeText.dialogs.validations.retirementAgeSame);

      result = validator(92);
      expect(result).toEqual(
        orangeText.dialogs.validations.retirementExcedes + 80
      );

      result = validator(12);
      expect(result).toEqual(
        orangeText.dialogs.validations.retirementBelow + 47
      );
    });
  });

  describe('emitMadlibClose', () => {
    it('should emit madlibclose event', () => {
      spyOn(component.madlibClose, 'emit');
      component.emitMadlibClose();
      expect(component.madlibClose.emit).toHaveBeenCalled();
    });
  });
});
