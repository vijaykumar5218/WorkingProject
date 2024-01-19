import {
  ComponentFixture,
  TestBed,
  waitForAsync,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';
import {OrangeMoneyService} from 'shared-lib/modules/orange-money/services/orange-money.service';
import {
  OrangeData,
  OrangeMoneyHeader,
} from '@shared-lib/services/account/models/orange-money.model';
import {AccountGroup} from '@shared-lib/services/account/models/all-accounts.model';
import {of, Subscription} from 'rxjs';
import {delay} from 'rxjs/operators';
import {AccountService} from '@shared-lib/services/account/account.service';
import {OrangeMoneyComponent} from './orange-money.component';
import {By} from '@angular/platform-browser';
import {ContentService} from '../../../../../shared/services/content/content.service';
import {LandingOrangeMoneyContent} from '../../../../../shared/services/content/model/landing-om-content.model';

describe('OrangeMoneyComponenet', () => {
  let component: OrangeMoneyComponent;
  let fixture: ComponentFixture<OrangeMoneyComponent>;
  let fetchSpy;
  let fetchOMDrupalSpy;
  let modalControllerSpy;
  let orangeMoneyServiceSpy;
  let accountServiceSpy;
  let contentServiceSpy;
  const orangeTestData: OrangeData = {
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
      omTitle: 'myOrangeMoney',
    },
  };
  const mockAccounts: AccountGroup = {
    hasMXAccount: true,
    categorizedAccounts: [
      {
        accType: 'Investment',
        accountsCount: 3,
        accountsTotalBalance: 106770.48,
        accounts: [
          {
            accountBalance: '',
            accountBalanceAsOf: '',
            accountNumber: '',
            accountTitle: '',
            accountType: 'Investment',
            accountOpenDate: '',
            suppressTab: false,
            planLink: 'http://www.voya.com',
            mediumLogoUrl: '',
            smallLogoUrl: '',
            bodyText: '',
            buttonText: '',
            ebooksLink: {
              label: '',
              url: '',
            },
            sourceSystem: '',
            voyaSavings: '',
            includedInOrangeMoney: false,
            accountAllowedForMyVoya: false,
            clientId: '',
            planId: '20322',
            actualPlanLink: 'http://www.voya.com',
            planType: '',
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
          },
        ],
      },
    ],
  };

  beforeEach(
    waitForAsync(async () => {
      modalControllerSpy = jasmine.createSpyObj('ModalController', [
        'create',
        'onDidDismiss',
      ]);
      orangeMoneyServiceSpy = jasmine.createSpyObj('OrangeMoneyService', [
        'getOMEligibility',
        'getOrangeData',
        'getOrangeMoneyStatus',
        'getEstimates',
      ]);
      accountServiceSpy = jasmine.createSpyObj('AccountService', [
        'getParticipant',
        'openPwebAccountLink',
        'fetchAccountsContent',
        'getAggregatedAccounts',
      ]);
      accountServiceSpy.getAggregatedAccounts.and.returnValue({
        subscribe: () => undefined,
      });
      contentServiceSpy = jasmine.createSpyObj('ContentService', [
        'getOrangeMoneyContent',
      ]);
      TestBed.configureTestingModule({
        declarations: [OrangeMoneyComponent],
        providers: [
          {provide: OrangeMoneyService, useValue: orangeMoneyServiceSpy},
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: AccountService, useValue: accountServiceSpy},
          {provide: ContentService, useValue: contentServiceSpy},
        ],
        imports: [IonicModule.forRoot()],
      }).compileComponents();
      fixture = TestBed.createComponent(OrangeMoneyComponent);
      component = fixture.componentInstance;
      orangeMoneyServiceSpy.getOMEligibility.and.returnValue(
        Promise.resolve({eligible: 'true', planId: '20232'})
      );
      fetchSpy = spyOn(component, 'fetchData');
      fetchOMDrupalSpy = spyOn(component, 'fetchOMDrupalContent');
      fixture.detectChanges();
    })
  );

  describe('ngOnInit', () => {
    let observable;
    let subscription;
    beforeEach(() => {
      component.accounts = undefined;
      component.detailsLink = undefined;
      observable = of(mockAccounts);
      subscription = new Subscription();
      spyOn(component['subscription'], 'add');
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockAccounts);
        return subscription;
      });
      accountServiceSpy.getAggregatedAccounts.and.returnValue(observable);
    });

    it('should call fetchData, fetchOMDrupalContent', async () => {
      orangeMoneyServiceSpy.getOMEligibility.and.returnValue(
        Promise.resolve({eligible: 'true', planId: '20232'})
      );
      await component.ngOnInit();
      expect(component.omEligibility).toEqual('true');
      expect(orangeMoneyServiceSpy.getOMEligibility).toHaveBeenCalled();
      expect(accountServiceSpy.getAggregatedAccounts).toHaveBeenCalled();
      expect(observable.subscribe).toHaveBeenCalled();
      expect(component['subscription'].add).toHaveBeenCalledWith(subscription);
      expect(
        component.accounts.categorizedAccounts[0].accounts[0].planId
      ).toEqual('20322');
      expect(
        component.accounts.categorizedAccounts[0].accounts[0].accountType
      ).toEqual('Investment');
      expect(
        component.accounts.categorizedAccounts[0].accounts[0].actualPlanLink
      ).toEqual('http://www.voya.com');
      expect(component.fetchData).toHaveBeenCalled();
      expect(component.fetchOMDrupalContent).toHaveBeenCalled();
    });
    it('should not call fetchData, fetchOMDrupalContent', async () => {
      orangeMoneyServiceSpy.getOMEligibility.and.returnValue(
        Promise.resolve({eligible: 'false', planId: '20232'})
      );
      component.omEligibility = 'false';
      await component.ngOnInit();
      expect(component.omEligibility).toEqual('false');
      expect(orangeMoneyServiceSpy.getOMEligibility).toHaveBeenCalled();
      expect(observable.subscribe).not.toHaveBeenCalled();
      expect(component['subscription'].add).not.toHaveBeenCalledWith(
        subscription
      );
    });
  });

  describe('fetchData', () => {
    let estimatesData;

    beforeEach(() => {
      spyOn(component, 'fetchOmTitle');
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

      estimatesData = {
        estimatedMonthlyIncome: 100.0,
        estimatedMonthlyGoal: 500.0,
        difference: 400.0,
        retirementAge: 100,
        currSalary: 150000.0,
      };
      orangeMoneyServiceSpy.getOMEligibility.and.returnValue(
        Promise.resolve({eligible: 'true', planId: '20232'})
      );
    });

    it('should fetch data OM', fakeAsync(() => {
      orangeMoneyServiceSpy.getEstimates.and.returnValue(estimatesData);

      component.fetchData();
      tick(1);
      expect(accountServiceSpy.getParticipant).toHaveBeenCalled();
      expect(orangeMoneyServiceSpy.getOrangeData).toHaveBeenCalled();
      expect(component.fetchOmTitle).toHaveBeenCalled();
      expect(orangeMoneyServiceSpy.getEstimates).toHaveBeenCalledWith(
        orangeTestData
      );
      expect(component.estimates).toEqual(estimatesData);
      expect(accountServiceSpy.fetchAccountsContent).toHaveBeenCalledWith();
      expect(component.omHeader).toEqual({
        OMHeader: 'omheader',
        OMTooltip: 'orange money tooltip test',
      });
    }));
    it('should render the proper title within .header row', () => {
      component.estimates = {
        estimatedMonthlyIncome: 100.0,
        estimatedMonthlyGoal: 500.0,
        difference: 400.0,
        retirementAge: 100,
        currSalary: 150000.0,
      };
      component.omTitle = 'omTitle';
      fixture.detectChanges();
      const headerRow = fixture.debugElement.query(By.css('.header'));
      const headerText = headerRow.nativeElement.textContent.trim();
      expect(headerText).toBe(component.omTitle);
    });

    it('should render the proper text within first .statDescription class instance', () => {
      component.estimates = {
        estimatedMonthlyIncome: 100.0,
        estimatedMonthlyGoal: 500.0,
        difference: 400.0,
        retirementAge: 100,
        currSalary: 150000.0,
      };
      fixture.detectChanges();
      const statDescriptionElements = fixture.debugElement
        .queryAll(By.css('.statDescription'))
        .map(element => element.nativeElement);
      const firstElement = statDescriptionElements[0];

      expect(firstElement.textContent).toBe('Estimated');
    });

    it('should render the proper text within second .statDescription class instance', () => {
      component.estimates = {
        estimatedMonthlyIncome: 100.0,
        estimatedMonthlyGoal: 500.0,
        difference: 400.0,
        retirementAge: 100,
        currSalary: 150000.0,
      };
      fixture.detectChanges();
      const statDescriptionElements = fixture.debugElement
        .queryAll(By.css('.statDescription'))
        .map(element => element.nativeElement);
      const secondElement = statDescriptionElements[1];

      expect(secondElement.textContent).toBe('Monthly Income');
    });
    it('should render the proper text within third .statDescription class instance', () => {
      component.estimates = {
        estimatedMonthlyIncome: 100.0,
        estimatedMonthlyGoal: 500.0,
        difference: -400.0,
        retirementAge: 100,
        currSalary: 150000.0,
      };
      fixture.detectChanges();
      const statDescriptionElements = fixture.debugElement
        .queryAll(By.css('.statDescription'))
        .map(element => element.nativeElement);
      const secondElement = statDescriptionElements[2];
      expect(secondElement.textContent).toBe('Estimated');
    });
    it('should render the proper text within fourth .statDescription class instance', () => {
      component.estimates = {
        estimatedMonthlyIncome: 100.0,
        estimatedMonthlyGoal: 500.0,
        difference: 400.0,
        retirementAge: 100,
        currSalary: 150000.0,
      };
      fixture.detectChanges();
      const statDescriptionElements = fixture.debugElement
        .queryAll(By.css('.statDescription'))
        .map(element => element.nativeElement);
      const firstElement = statDescriptionElements[3];
      expect(firstElement.textContent).toBe('Monthly Goal');
    });
    it('should render the proper text within fivth .statDescription class instance when difference is positive', () => {
      component.estimates = {
        estimatedMonthlyIncome: 100.0,
        estimatedMonthlyGoal: 500.0,
        difference: 400.0,
        retirementAge: 100,
        currSalary: 150000.0,
      };
      fixture.detectChanges();
      const statDescriptionElements = fixture.debugElement
        .queryAll(By.css('.statDescription'))
        .map(element => element.nativeElement);
      const firstElement = statDescriptionElements[4];
      expect(firstElement.textContent).toBe('A Difference Of');
    });
    it('should render the proper text within fivth .statDescription class instance when difference is negetive', () => {
      component.estimates = {
        estimatedMonthlyIncome: 100.0,
        estimatedMonthlyGoal: 500.0,
        difference: -400.0,
        retirementAge: 100,
        currSalary: 150000.0,
      };
      fixture.detectChanges();
      const statDescriptionElements = fixture.debugElement
        .queryAll(By.css('.statDescription'))
        .map(element => element.nativeElement);
      const firstElement = statDescriptionElements[4];
      expect(firstElement.textContent).toBe('You are on track!');
    });
  });

  it('should return height as true if window.innerWidth is > 1100', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(1101);
    fixture.detectChanges();
    const result = component.isSizeOne();
    expect(result).toEqual(true);
  });

  describe('fetchOMDrupalContent', () => {
    beforeEach(async () => {
      fetchOMDrupalSpy.and.callThrough();
      const omContentTestData: LandingOrangeMoneyContent = {
        OMTileIncompleteMadlib: 'madlib text data',
      };
      contentServiceSpy.getOrangeMoneyContent.and.returnValue(
        of(omContentTestData)
      );
    });

    it('should fetch OM Drupal Content', () => {
      component.fetchOMDrupalContent();
      expect(contentServiceSpy.getOrangeMoneyContent).toHaveBeenCalledWith();
      expect(component.omTileIncompleteMadlibText).toEqual('madlib text data');
    });
  });

  it('should return height as true if window.innerWidth is > 920 and window.innerWidth <= 1100', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(921);
    fixture.detectChanges();
    const result = component.isSizeTwo();
    expect(result).toEqual(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('fetchOmTitle', () => {
    it('should fetch omTitle when getrrinfo response is feForecastData', () => {
      (component.orangeData = {
        feForecastData: {
          omTitle: 'myOrangeMoney',
        },
      }),
        component.fetchOmTitle();
      expect(component.omTitle).toEqual(
        component.orangeData.feForecastData.omTitle
      );
    });
    it('should fetch omTitle when getrrinfo response is madLibData', () => {
      (component.orangeData = {
        madLibData: {
          omTitle: 'myOrangeMoney',
        },
      }),
        component.fetchOmTitle();
      expect(component.omTitle).toEqual(
        component.orangeData.madLibData.omTitle
      );
    });
    it('should fetch omTitle when getrrinfo response is orangeData', () => {
      (component.orangeData = {
        orangeData: {
          omTitle: 'myOrangeMoney',
        },
      }),
        component.fetchOmTitle();
      expect(component.omTitle).toEqual(
        component.orangeData.orangeData.omTitle
      );
    });
    it('should fetch omTitle when getrrinfo response is opt-out', () => {
      (component.orangeData = {
        errorCode: 'opt-out',
        omTitle: 'myOrangeMoney',
      }),
        component.fetchOmTitle();
      expect(component.omTitle).toEqual(component.orangeData.omTitle);
    });
    it('should fetch static omTitle when getrrinfo response is null', () => {
      component.pageText.omText = 'myOrangeMoney';
      component.fetchOmTitle();
      expect(component.omTitle).toEqual(component.pageText.omText);
    });
  });

  describe('ngOnDestroy', () => {
    let orangeDataSpy;
    let participantDataSpy;
    let accountContentSpy;
    let omContentSpy;
    let subscriptionSpy;

    beforeEach(() => {
      subscriptionSpy = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
        'add',
      ]);
      orangeDataSpy = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
        'add',
      ]);
      participantDataSpy = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
        'add',
      ]);
      accountContentSpy = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
        'add',
      ]);
      omContentSpy = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
        'add',
      ]);
    });

    it('should call unsubscribe', () => {
      component['subscription'] = subscriptionSpy;
      component['orangeDataSubscription'] = orangeDataSpy;
      component['participantSubscription'] = participantDataSpy;
      component['accountContentSubscription'] = accountContentSpy;
      component['omContentSubscripation'] = omContentSpy;

      component.ngOnDestroy();
      expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
      expect(orangeDataSpy.unsubscribe).toHaveBeenCalled();
      expect(participantDataSpy.unsubscribe).toHaveBeenCalled();
      expect(accountContentSpy.unsubscribe).toHaveBeenCalled();
      expect(omContentSpy.unsubscribe).toHaveBeenCalled();
    });

    it('should not call unsubscribe if subs are null', () => {
      component['subscription'] = null;
      component['orangeDataSubscription'] = null;
      component['participantSubscription'] = null;
      component['accountContentSubscription'] = null;
      component['omContentSubscripation'] = null;

      component.ngOnDestroy();
      expect(subscriptionSpy.unsubscribe).not.toHaveBeenCalled();
      expect(orangeDataSpy.unsubscribe).not.toHaveBeenCalled();
      expect(participantDataSpy.unsubscribe).not.toHaveBeenCalled();
      expect(accountContentSpy.unsubscribe).not.toHaveBeenCalled();
      expect(omContentSpy.unsubscribe).not.toHaveBeenCalled();
    });
  });
});
