import {Component, ElementRef, Input} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonContent, IonicModule} from '@ionic/angular';
import {of, Subscription} from 'rxjs';
import {OrangeMoneyService} from '@shared-lib/modules/orange-money/services/orange-money.service';
import {AccountService} from '@shared-lib/services/account/account.service';
import {InfoPage} from './info.page';
import {Account} from '@shared-lib/services/account/models/accountres.model';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {EventManagerService} from '@shared-lib/modules/event-manager/event-manager/event-manager.service';
import {eventKeys} from '@shared-lib/constants/event-keys';
import {JourneyService} from '../../../../services/journey/journey.service';
@Component({selector: 'app-loading-text', template: ''})
class MockAppLoadingText {
  @Input() isLoading;
}

@Component({selector: 'app-more-account-info', template: ''})
class MockAppMoreAccountInfo {
  @Input() isLoading;
}

describe('InfoPage', () => {
  let component: InfoPage;
  let fixture: ComponentFixture<InfoPage>;
  let accountServiceSpy;
  let sharedUtilityServiceSpy;
  let orangeMoneyService;
  let eventManagerServiceSpy;
  let journeyServiceSpy;
  const emptyOrangeMoneyData = {
    orangeData: {
      adminUser: false,
      advisor: false,
      annuityFactors: [],
      callCenterPhoneNumber: '232-323-4434',
      content: {},
      csrId: '',
      irsLimits: {},
      omTitle: 'myOrangeMoney&reg;',
      otherAssets: {},
      participantData: {
        annualSalaryIncrementRate: 0,
        closeTheGapPlans: [],
        currentAnnualSalary: 60020,
        currentDcBalance: 1600483.63,
        displayOMVideos: true,
        dob: '1941-01-06T00:00:00',
        firstName: 'PARTICIPAN',
        firstTimeVisitor: false,
        guaranteedIncome: 0,
        hcData: {age: 65, hcEnable: true, healthCareViewed: false, state: 'MA'},
        includeSocialSecurity: true,
        incomeReplacementRatio: 0.7,
        inflationRate: 0.023,
        investmentRateOfReturn: 0.02,
        omSectionExpanded: true,
        otherAccountPrompt: true,
        outsideRetAssetPrompt: false,
        participantStatus: 'ACTIVE',
        pensionView: null,
        personId: '2143941201',
        replacementIncomeCalcType: 'Balanced',
        retirementAge: 80,
        rothBumpRate: 0.25,
        showSurvey: true,
        socialSecData: {},
      },
      participantDefinedContributionAccounts: [
        {
          contributionData: {
            catchupContributionUnit: null,
            catchupEligible: '',
            catchupIneligibilityReason: '',
            catchupPending: null,
            crcEligible: '',
            crcIneligibilityReason: '',
            regularContributionUnit: 'UNIT',
            regularPending: {
              txDate: '',
              txNumber: '',
            },
          },
          planInfo: {
            planId: 'planId',
            catchupContributionType: 'AMOUNT',
            regularContributionType: 'AMOUNT',
            crcAllowed: false,
            sources: [
              {
                amountMod: 0.01,
                contribution: 0.05,
                id: '',
                ircCode: '',
                limits: {max: 1, min: 0},
                name: 'name',
                percentLimits: '',
                percentMod: 0.2,
                type: 'AMT',
              },
              {
                amountMod: 0.01,
                contribution: 0.05,
                id: '',
                ircCode: '',
                limits: {max: 1, min: 0},
                name: 'name',
                percentLimits: '',
                percentMod: 0.2,
                type: 'AMT',
              },
            ],
          },
        },
      ],
      pension: {enabled: true, monthlyPension: 0},
      quickEnrollAllowed: false,
      quickEnrollData: {plan: '', quickEnrollAllowed: false},
      ssBenefits: [],
      urls: {},
      usStates: [],
      voyaOtherAccounts: [],
    },
  };
  const mockEstimatesData = {
    estimatedMonthlyIncome: 13500,
    estimatedMonthlyGoal: 8000,
    difference: -5500,
    retirementAge: 70,
    currSalary: 1000.11,
  };

  beforeEach(
    waitForAsync(() => {
      accountServiceSpy = jasmine.createSpyObj('AccountService', [
        'getAccount',
        'getParticipant',
        'getGainLoss',
        'getLoan',
        'getRateOfReturn',
        'getVestedBalance',
        'getContribution',
        'getYTDContribution',
        'getEmployersMatch',
        'getDividends',
        'posNegSymbol',
        'getPlanAdviceStatuses',
      ]);
      orangeMoneyService = jasmine.createSpyObj('OrangeMoneyService', [
        'getOMEligibility',
        'getOrangeData',
        'getEstimates',
      ]);
      sharedUtilityServiceSpy = jasmine.createSpyObj(
        'sharedUtilityServiceSpy',
        ['getIsWeb']
      );
      eventManagerServiceSpy = jasmine.createSpyObj('EventManagerService', [
        'createSubscriber',
      ]);
      journeyServiceSpy = jasmine.createSpyObj(
        'JourneyService',
        [
          'getJourneyCompletionStatus',
          'setCurrentJourney',
          'setStepContent',
          'fetchJourneys',
        ],
        {
          journeyServiceMap: {},
        }
      );

      TestBed.configureTestingModule({
        declarations: [InfoPage, MockAppLoadingText, MockAppMoreAccountInfo],
        imports: [IonicModule.forRoot(), RouterTestingModule],
        providers: [
          {provide: AccountService, useValue: accountServiceSpy},
          {provide: SharedUtilityService, useValue: sharedUtilityServiceSpy},
          {provide: OrangeMoneyService, useValue: orangeMoneyService},
          {provide: EventManagerService, useValue: eventManagerServiceSpy},
          {provide: JourneyService, useValue: journeyServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(InfoPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  const emptyAccount: Account = {
    accountTitle: '',
    accountBalance: '',
    accountBalanceAsOf: '',
    sourceSystem: 'EASE',
    suppressTab: false,
    voyaSavings: '',
    includedInOrangeMoney: false,
    accountAllowedForMyVoya: false,
    clientId: '2345',
    planId: '32323',
    planType: '',
    accountNumber: '',
    needOMAutomaticUpdate: false,
    planName: '',
    mpStatus: '',
    clientAllowed4myVoyaOrSSO: false,
    useMyvoyaHomepage: false,
    advisorNonMoneyTxnAllowed: false,
    advisorMoneyTxnAllowed: false,
    nqPenCalPlan: false,
    enrollmentAllowed: false,
    autoEnrollmentAllowed: false,
    vruPhoneNumber: '',
    rmdRecurringPaymentInd: '',
    navigateToRSPortfolio: false,
    planLink: '',
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

  const vendorAccount: Account = {
    accountTitle: '',
    accountBalance: '',
    accountBalanceAsOf: '',
    sourceSystem: 'VENDOR',
    suppressTab: false,
    voyaSavings: '',
    includedInOrangeMoney: false,
    accountAllowedForMyVoya: false,
    clientId: '2345',
    planId: '32323',
    planType: '',
    accountNumber: '',
    needOMAutomaticUpdate: false,
    planName: '',
    mpStatus: '',
    clientAllowed4myVoyaOrSSO: false,
    useMyvoyaHomepage: false,
    advisorNonMoneyTxnAllowed: false,
    advisorMoneyTxnAllowed: false,
    nqPenCalPlan: false,
    enrollmentAllowed: false,
    autoEnrollmentAllowed: false,
    vruPhoneNumber: '',
    rmdRecurringPaymentInd: '',
    navigateToRSPortfolio: false,
    planLink: '',
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

  const emptyHsaAccount: Account = {
    accountTitle: '',
    accountBalance: '',
    accountBalanceAsOf: '',
    sourceSystem: 'EASE',
    suppressTab: false,
    voyaSavings: '',
    includedInOrangeMoney: false,
    accountAllowedForMyVoya: false,
    clientId: '2345',
    planId: '32323',
    planType: '',
    accountNumber: '',
    needOMAutomaticUpdate: false,
    planName: '',
    mpStatus: '',
    clientAllowed4myVoyaOrSSO: false,
    useMyvoyaHomepage: false,
    advisorNonMoneyTxnAllowed: false,
    advisorMoneyTxnAllowed: false,
    nqPenCalPlan: false,
    enrollmentAllowed: false,
    autoEnrollmentAllowed: false,
    vruPhoneNumber: '',
    rmdRecurringPaymentInd: '',
    navigateToRSPortfolio: false,
    planLink: '',
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
    isHSAAccount: true,
    hsaAccountData: {
      HAS_PARTY_ID: '',
      Plan_ID: 0,
      Current_Or_Prior: '',
      Plan_Year_End_Date: '',
      Plan_Type: '',
      Plan_Name: 'Health Savings Account',
      Election_Amount: 0,
      Calculated_Contribution: 0,
      YTD_Contributions: 0,
      Employer_Election_Amount: 0,
      Employer_YTD_Contributions: 0,
      AvailableBalance: 0,
      CashBalance: 0,
      TotalBalance: 0,
      InvestmentBalance: 0,
      AsOfDate: '',
      YTD_Wellness_Contributions: 0,
    },
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit', () => {
    component.isWeb = false;
    sharedUtilityServiceSpy.getIsWeb.and.returnValue(true);
    component.ngOnInit();
    expect(component.isWeb).toEqual(true);
  });

  describe('doGainLossCalculation', () => {
    it('should calculate gainLoss', () => {
      const account = emptyAccount;
      account.accountBalance = '1000.0';

      const gainLossData = {
        balDate: '',
        balance: '500',
      };

      component.account = account;
      component.gainLoss = gainLossData;
      component.gainLossValue = '200.00';
      component.doGainLossCalculation();
      expect(component.gainLossValue).toEqual('500.00');
    });

    it('should return null gainLoss', () => {
      const account = emptyAccount;
      account.accountBalance = '1000.0';
      const gainLossData = null;
      component.account = account;
      component.gainLoss = gainLossData;
      component.gainLossValue = '200.00';
      component.doGainLossCalculation();
      expect(component.gainLossValue).toEqual(null);
    });
  });

  describe('posNegSymbol', () => {
    it('should return - for negative numbers', () => {
      component.posNegSymbol(-1);
      expect(accountServiceSpy.posNegSymbol).toHaveBeenCalledWith(-1);
    });
  });

  describe('posNegColor', () => {
    it('should return #B30000(red) for negative numbers', () => {
      const result = component.posNegColor(-1);
      expect(result).toEqual('#B30000');
    });

    it('should return #00a137(green) for positive numbers', () => {
      const result = component.posNegColor(+1);
      expect(result).toEqual('#00a137');
    });

    it('should return #000000(black) for 0', () => {
      const result = component.posNegColor(0);
      expect(result).toEqual('#000000');
    });
  });

  describe('ionViewWillEnter', () => {
    beforeEach(() => {
      spyOn(component, 'fetchData');
    });
    it('When isWeb would be false', () => {
      component.isWeb = false;
      component.ionViewWillEnter();
      expect(component.fetchData).toHaveBeenCalled();
    });
    it('When isWeb would be true', () => {
      component.isWeb = true;
      component.ionViewWillEnter();
      expect(component.fetchData).not.toHaveBeenCalled();
    });
  });

  describe('fetchData', () => {
    let participantData;
    let gainLossData;
    let loanData;
    let returnRate;
    let vestedBal;
    let dividends;
    let contrib;
    let employersMatch;
    let ytdContrib;
    let eligibilityData;
    let planAdviceStatusData;
    let orangeDataObservable;
    let orangeDataSubscription;

    beforeEach(() => {
      participantData = {
        firstName: '',
        lastName: '',
        birthDate: '',
        displayName: '',
        age: '',
        profileId: '',
      };
      accountServiceSpy.getParticipant.and.returnValue(
        Promise.resolve(participantData)
      );
      accountServiceSpy.getParticipant.and.returnValue(
        of(participantData).pipe()
      );

      planAdviceStatusData = {
        clients: [
          {
            id: 'client',
            domain: 'domain',
            plans: [
              {
                id: '13324',
                adviceStatus: 'FE_MANAGED',
              },
            ],
          },
        ],
      };

      accountServiceSpy.getPlanAdviceStatuses.and.returnValue(
        Promise.resolve(planAdviceStatusData)
      );

      gainLossData = {
        balDate: '',
        balance: '',
      };
      accountServiceSpy.getGainLoss.and.returnValue(
        Promise.resolve(gainLossData)
      );

      eligibilityData = {eligible: 'true'};
      orangeMoneyService.getOMEligibility.and.returnValue(
        Promise.resolve(eligibilityData)
      );

      loanData = {
        outstandingLoan: {
          allLoanCount: 0,
          defaultedLoanBal: 0,
          defaultedLoanCount: 0,
          defaultedIntArrears: 0,
          genLoanCount: 0,
          eligEarlyPayoff: false,
          outstandLoanCount: 0,
          resLoanCount: 0,
          hardshipLoanCount: 0,
          totLoanBal: 0,
          totLoanPayment: 0,
          totLoanPrincipal: 0,
          monthlyAchPaymentCount: 0,
          outstandingLoanDtls: [
            {
              loanNumber: 1,
              balance: 0,
            },
            {
              loanNumber: 2,
              balance: 0,
            },
          ],
        },
      };
      accountServiceSpy.getLoan.and.returnValue(Promise.resolve(loanData));

      returnRate = {
        prr: {
          pct: 0,
          asofdate: '',
        },
      };
      accountServiceSpy.getRateOfReturn.and.returnValue(
        Promise.resolve(returnRate)
      );

      vestedBal = {totalVestedBal: 0};
      accountServiceSpy.getVestedBalance.and.returnValue(
        Promise.resolve(vestedBal)
      );

      dividends = {
        ytdDividend: 0,
      };
      accountServiceSpy.getDividends.and.returnValue(
        Promise.resolve(dividends)
      );

      contrib = {
        employersContribution: 20,
      };
      accountServiceSpy.getContribution.and.returnValue(
        Promise.resolve(contrib)
      );

      ytdContrib = {
        totalYTDContrib: 20,
        employeeContrib: 40,
        contribType: 'PCT',
        catchupType: 'PCT',
        puertoRicoResidentFlag: false,
        totalCatchup: 20,
      };
      accountServiceSpy.getYTDContribution.and.returnValue(
        Promise.resolve(ytdContrib)
      );

      employersMatch = {
        showMatch: false,
        matchPercentage: 22,
        showMatchPercentageValue: true,
        icon: '',
        header: '',
        subHeader: '',
        urlText: '',
        url: '',
        actualEmployerMatch: 32,
        actualContributionPercentage: 32,
        peerComparisonContributionRate: 32,
        age: 32,
        toolTipText: '',
      };
      accountServiceSpy.getEmployersMatch.and.returnValue(
        Promise.resolve(employersMatch)
      );
      spyOn(component, 'setPlanAdviceStatus');

      orangeDataSubscription = new Subscription();
      orangeDataObservable = of(emptyOrangeMoneyData);
      spyOn(orangeDataObservable, 'subscribe').and.callFake(f => {
        f(emptyOrangeMoneyData);
        return orangeDataSubscription;
      });
      orangeMoneyService.getOrangeData.and.returnValue(orangeDataObservable);
      orangeMoneyService.getEstimates.and.returnValue(
        Promise.resolve(mockEstimatesData)
      );
      spyOn(component.subscription, 'add');
    });

    it('should call HSA fetch data if is HSA', async () => {
      accountServiceSpy.getAccount.and.returnValue(emptyHsaAccount);
      spyOn(component, 'fetchHsaData');
      await component.fetchData();
      expect(component.fetchHsaData).toHaveBeenCalled();
      expect(accountServiceSpy.getPlanAdviceStatuses).not.toHaveBeenCalled();
    });

    it('Call the Url data', async () => {
      component.isWeb = false;
      accountServiceSpy.getAccount.and.returnValue(emptyAccount);
      await component.fetchData();

      expect(accountServiceSpy.getAccount).toHaveBeenCalled();
      expect(component.account).toEqual(emptyAccount);

      expect(accountServiceSpy.getParticipant).toHaveBeenCalled();
      expect(component.participant).toEqual(participantData);

      expect(accountServiceSpy.getPlanAdviceStatuses).toHaveBeenCalled();
      expect(component.setPlanAdviceStatus).toHaveBeenCalledWith(
        planAdviceStatusData
      );

      expect(accountServiceSpy.getGainLoss).toHaveBeenCalled();
      expect(component.gainLoss).toEqual(gainLossData);

      expect(orangeMoneyService.getOMEligibility).toHaveBeenCalled();
      expect(component.omEligibility).toBeTruthy();

      expect(accountServiceSpy.getLoan).toHaveBeenCalled();
      expect(component.loan).toEqual(loanData);

      expect(accountServiceSpy.getRateOfReturn).toHaveBeenCalled();
      expect(component.rateOfReturn).toEqual(returnRate);

      expect(accountServiceSpy.getVestedBalance).toHaveBeenCalled();
      expect(component.vestedBalance).toEqual(vestedBal);

      expect(accountServiceSpy.getDividends).toHaveBeenCalled();
      expect(component.dividends).toEqual(dividends);

      expect(accountServiceSpy.getContribution).toHaveBeenCalled();
      expect(component.contribution).toEqual(contrib);

      expect(accountServiceSpy.getEmployersMatch).toHaveBeenCalled();
      expect(component.employersMatch).toEqual(employersMatch);

      expect(accountServiceSpy.getYTDContribution).toHaveBeenCalled();
      expect(component.contributions).toEqual(ytdContrib);
    });

    it('Call the Url data with vendor accounts', async () => {
      component.isWeb = false;
      accountServiceSpy.getAccount.and.returnValue(vendorAccount);
      await component.fetchData();

      expect(accountServiceSpy.getAccount).toHaveBeenCalled();
      expect(component.account).toEqual(vendorAccount);

      expect(accountServiceSpy.getParticipant).toHaveBeenCalled();
      expect(component.participant).toEqual(participantData);

      expect(accountServiceSpy.getPlanAdviceStatuses).not.toHaveBeenCalled();
      expect(component.setPlanAdviceStatus).not.toHaveBeenCalledWith(
        planAdviceStatusData
      );

      expect(accountServiceSpy.getGainLoss).not.toHaveBeenCalled();
      expect(orangeMoneyService.getOMEligibility).not.toHaveBeenCalled();
      expect(accountServiceSpy.getLoan).not.toHaveBeenCalled();
      expect(accountServiceSpy.getRateOfReturn).not.toHaveBeenCalled();
      expect(accountServiceSpy.getVestedBalance).not.toHaveBeenCalled();
      expect(accountServiceSpy.getDividends).not.toHaveBeenCalled();
      expect(accountServiceSpy.getContribution).not.toHaveBeenCalled();
      expect(accountServiceSpy.getEmployersMatch).not.toHaveBeenCalled();
      expect(accountServiceSpy.getYTDContribution).not.toHaveBeenCalled();
    });

    it('should set estimates and set omCorrectPlan to false if plans dont match', async () => {
      component.isWeb = false;
      accountServiceSpy.getAccount.and.returnValue(emptyAccount);
      component.omCorrectPlan = true;

      await component.fetchData();
      expect(orangeMoneyService.getOrangeData).toHaveBeenCalled();
      expect(orangeMoneyService.getEstimates).toHaveBeenCalledWith(
        emptyOrangeMoneyData
      );
      expect(component.subscription.add).toHaveBeenCalledWith(
        orangeDataSubscription
      );
      expect(component.estimates).toEqual(mockEstimatesData);
      expect(component.omCorrectPlan).toBeFalse();
    });

    it('should set estimates and set omCorrectPlan to true if plans match', async () => {
      component.isWeb = false;

      const empAcc = JSON.parse(JSON.stringify(emptyAccount));
      empAcc.planId = 'planId';

      accountServiceSpy.getAccount.and.returnValue(empAcc);
      component.omCorrectPlan = false;

      await component.fetchData();
      expect(orangeMoneyService.getOrangeData).toHaveBeenCalled();
      expect(orangeMoneyService.getEstimates).toHaveBeenCalledWith(
        emptyOrangeMoneyData
      );
      expect(component.subscription.add).toHaveBeenCalledWith(
        orangeDataSubscription
      );
      expect(component.estimates).toEqual(mockEstimatesData);
      expect(component.omCorrectPlan).toBeTrue();
    });
  });

  describe('fetchHsaData', () => {
    let hsaJourneyStatus;

    beforeEach(() => {
      hsaJourneyStatus = {
        journeyID: 7,
        isCompleted: true,
      };
      journeyServiceSpy.getJourneyCompletionStatus.and.returnValue(
        Promise.resolve(hsaJourneyStatus)
      );
    });

    it('should check if hsa journey is complete and load the hsa journey if so', async () => {
      const hsaJourney = {journeyID: 7};
      const journeys = {
        all: [{journeyID: 1}, hsaJourney, {journeyID: 2}],
      };
      journeyServiceSpy.fetchJourneys.and.returnValue(of(journeys));
      component.hsaJourneyLoading = true;
      await component.fetchHsaData();

      expect(journeyServiceSpy.getJourneyCompletionStatus).toHaveBeenCalled();
      expect(journeyServiceSpy.fetchJourneys).toHaveBeenCalled();
      expect(journeyServiceSpy.setStepContent).toHaveBeenCalledWith(hsaJourney);
      expect(journeyServiceSpy.setCurrentJourney).toHaveBeenCalledWith(
        hsaJourney
      );
      expect(component.hsaJourneyLoading).toBeFalse();
    });

    it('should check if hsa journey is complete and not load hsa journey if no', async () => {
      hsaJourneyStatus.isCompleted = false;
      component.hsaJourneyStatus = undefined;
      await component.fetchHsaData();
      expect(component.hsaJourneyStatus).toEqual(hsaJourneyStatus);
      expect(journeyServiceSpy.fetchJourneys).not.toHaveBeenCalled();
    });
  });

  describe('ionViewDidEnter', () => {
    let observable;
    let featchSubscription;
    beforeEach(() => {
      featchSubscription = new Subscription();
      observable = of('viewWillEnter');
      spyOn(observable, 'subscribe').and.callFake(f => {
        f('viewWillEnter');
        return featchSubscription;
      });
      eventManagerServiceSpy.createSubscriber.and.returnValue(observable);
      spyOn(component, 'fetchData');
      spyOn(component.featchSubscription, 'add');
      spyOn(component.featchSubscription, 'unsubscribe');
    });
    it('should call fetchData if isWeb is true', () => {
      component.isWeb = true;
      component.ionViewDidEnter();
      expect(eventManagerServiceSpy.createSubscriber).toHaveBeenCalledWith(
        eventKeys.refreshAccountInfo
      );
      expect(component.featchSubscription.unsubscribe).toHaveBeenCalled();
      expect(component.fetchData).toHaveBeenCalled();
    });
    it('should not call fetchData if isWeb is false', () => {
      component.isWeb = false;
      component.ionViewDidEnter();
      expect(eventManagerServiceSpy.createSubscriber).not.toHaveBeenCalled();
      expect(component.fetchData).not.toHaveBeenCalled();
    });
  });

  describe('setPlanAdviceStatus', () => {
    beforeEach(() => {
      component.account = {planId: '13324'} as Account;
    });

    it('should set morningstar flag for m*', () => {
      const data = {
        clients: [
          {
            id: 'client',
            domain: 'domain',
            plans: [
              {
                id: '13324',
                adviceStatus: 'M*_MANAGED',
              },
            ],
          },
        ],
      };

      component.setPlanAdviceStatus(data);
      expect(component.flagMorningStar).toEqual(true);
      expect(component.flagFeManaged).toEqual(false);
    });

    it('should not match with account plan ID', () => {
      component.flagMorningStar = undefined;
      component.flagFeManaged = undefined;
      const data = {
        clients: [
          {
            id: 'client',
            domain: 'domain',
            plans: [
              {
                id: '13333',
                adviceStatus: 'M*_MANAGED',
              },
            ],
          },
        ],
      };
      component.setPlanAdviceStatus(data);
      expect(component.flagMorningStar).not.toBeDefined();
      expect(component.flagFeManaged).not.toBeDefined();
    });

    it('should set fe flag for FE', () => {
      const data = {
        clients: [
          {
            id: 'client',
            domain: 'domain',
            plans: [
              {
                id: '13324',
                adviceStatus: 'FE_MANAGED',
              },
            ],
          },
        ],
      };

      component.setPlanAdviceStatus(data);
      expect(component.flagMorningStar).toEqual(false);
      expect(component.flagFeManaged).toEqual(true);
    });

    it('should set no flags otherwise', () => {
      const data = {
        clients: [
          {
            id: 'client',
            domain: 'domain',
            plans: [
              {
                id: '13324',
                adviceStatus: 'NONE',
              },
            ],
          },
        ],
      };

      component.setPlanAdviceStatus(data);
      expect(component.flagMorningStar).toEqual(false);
      expect(component.flagFeManaged).toEqual(false);
    });
  });

  describe('scrollToOrangeMoney', () => {
    let contentSpy;
    let nativeElementSpy;
    beforeEach(() => {
      contentSpy = jasmine.createSpyObj('content', ['scrollToPoint']);
      nativeElementSpy = jasmine.createSpyObj('nativeElementSpy', [''], {
        offsetTop: 100,
      });
      component.content = contentSpy as IonContent;
      component.omComp = {
        nativeElement: nativeElementSpy,
      } as ElementRef;
    });
    it('should call scrollToPoint', () => {
      component.scrollToOrangeMoney();
      expect(contentSpy.scrollToPoint).toHaveBeenCalledWith(0, 200, 1000);
    });
  });

  describe('ngOnDestroy', () => {
    beforeEach(() => {
      spyOn(component.subscription, 'unsubscribe');
    });
    it('should unsubscribe from the subscription', () => {
      component.ngOnDestroy();
      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });
});
