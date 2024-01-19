import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {WorkplaceHomePage} from './home.page';
import {CUSTOM_ELEMENTS_SCHEMA, ElementRef} from '@angular/core';
import {of, Subscription} from 'rxjs';
import {RouterTestingModule} from '@angular/router/testing';
import {GreetingService} from '../../../shared/services/greeting/greeting.service';
import {AccessService} from '@shared-lib/services/access/access.service';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {HeaderTypeService} from '@web/app/modules/shared/services/header-type/header-type.service';
import {AccountService} from '@shared-lib/services/account/account.service';
import {AccessResult} from '@shared-lib/services/access/models/access.model';
import {JourneyResponse} from '@shared-lib/services/journey/models/journey.model';
import {MoreResourcesLinks} from '../../../shared/services/header-type/models/MoreResource.model';
import {HomeService} from '../../../../../../../shared-lib/services/home/home.service';
import {AdviceCalloutService} from '@web/app/modules/shared/services/adviceCallout/adviceCallout.service';
import {VoyaGlobalCacheService} from '../../../shared/services/voya-global-cache/voya-global-cache.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {Router} from '@angular/router';
import {AccountGroup} from '../../../../../../../shared-lib/services/account/models/all-accounts.model';
describe('WorkplaceHomePage', () => {
  let component: WorkplaceHomePage;
  let fixture: ComponentFixture<WorkplaceHomePage>;
  let greetingServiceSpy;
  let fetchLocalTimeSpy;
  let subscriptionSpy;
  let accessServiceSpy;
  let journeyServiceSpy;
  let journeyData: JourneyResponse;
  let benefitServiceSpy;
  let headerTypeServiceSpy;
  let accountServiceSpy;
  let homeServiceSpy;
  let fetchDataSpy;
  let fetchAggregatedAccountsSpy;
  let observable;
  let subscription;
  let adviceCalloutServiceSpy;
  let voyaCacheService;
  let scrollToTopSpy;
  let utilityServiceSpy;
  let routerSpy;
  let fetchMoneyOutStatusSpy;
  let setMyBenefitsUserSpy;

  const mockAggregatedAccount: any = {
    hasMXAccount: true,
    categorizedAccounts: [
      {
        accType: 'Investment',
        accountsCount: 3,
        accountsTotalBalance: 106770.48,
        accounts: [
          {
            accountTitle: 'City of Los Angeles DC Plan',
            accountType: 'Investment',
            accountBalance: 71167.48,
            accountBalanceAsOf: '01/12/2023',
            suppressTab: false,
            planId: '20322',
            planLink: 'http://www.voya.com',
            actualPlanLink: 'http://www.voya.com',
            accountNumber: '711016@CITYLA@014633871',
          },
        ],
      },
    ],
    snapshotAccounts: {
      totalBalance: 3250,
      accounts: [
        {
          accountTitle: 'Investment',
          accountBalance: '1000',
        },
        {
          accountTitle: 'WEX',
          accountBalance: '250.0',
        },
        {
          accountTitle: 'HSA',
          accountBalance: '1500.0',
        },
      ],
    },
  };

  const mockAccount: AccountGroup = {
    hasMXAccount: true,
    categorizedAccounts: [{accounts: []}],
  };

  const mockAdviceCalloutData: any = [
    {
      clientId: 'INGWIN',
      messages:
        'The right advice can make all the difference. Investing for retirement can be complicated. Fortunately, getting answers doesn’t have to be. Consider personalized support from a professional.',
      linkName: 'Learn More',
      title: 'Get Advice',
      offerCode: 'MANACCT',
      messageType: 'MESSAGE',
      targetUrl:
        'https%3A%2F%2Flogin.unit.voya.com%2Fsaml%2Fsps%2Fsaml-idp-login%2Fsaml20%2Flogininitial%3FPartnerId%3Dhttps%3A%2F%2Fmy3.unit.voya.com%2Fmga%2Fsps%2Fsaml-sp-my-local%2Fsaml20%26access_token%3D%5Bexchanged_access_token%5D%26Target=https%3A%2F%2Fmy3.unit.voya.com%2Fvoyasso%2FmobileSignOn%3Fdomain%3Dadptotalsource.intg.voya.com%26target%3D/epweb/pweblink.do?s=t5GrHS1kbmdRAVyy0fN0bA11.i9290&domain=adptotalsource.intg.voya.com&cl=INGWIN&act_type=P&page=advice&pageId=ACCT_GET_ADVICE&plan=814059&d=fcd814d3ab4f7100e1b914b3a980526d102e4569',
      imageTargetUrl:
        'https://my3.intg.voya.com/eicc/servlet/MessageEventTrackingServlet?summaryId=041848716814059MANACCT&loginDateTime=10%2F06%2F2023+17%3A22%3A42&sessionId=t5GrHS1kbmdRAVyy0fN0bA11.i9290&msgAction=Yes&messageId=AC.84&msgSource=ACCORDION&targetURL=https%3A%2F%2F%3Cclient+domain%3E%2Fepweb%2Fpweblink.do%3Fpage%3Dadvice%26plan%3D814059%26s%3D%3CSSO+Session+ID%3E%26domain%3D%3CClient+domain%3E%26act_type%3D%26pageId%3DACCT_GET_ADVICE%26d%3D%3Cdigital+sig%3E&d=b9428dfa73d919a62d4bc255118b7e3990de367e',
    },
    {
      clientId: 'INGWIN',
      messages:
        'The right advice can make all the difference. Investing for retirement can be complicated. Fortunately, getting answers doesn’t have to be. Consider personalized support from a professional.',
      linkName: 'Get Started',
      title: 'Compare Yourself',
      offerCode: 'MANACTIPS',
      messageType: 'DEFAULT',
      targetUrl: 'http://voya.com/tool/compare-me/',
      imageTargetUrl: 'http://voya.com/tool/compare-me/',
    },
  ];

  const resourceLinks: MoreResourcesLinks = {
    resourceLink: {
      label: '',
      id: '',
      subLinks: [
        {
          label:
            "Get Investment Advice <span class='languageTag'>(In English)</span>",
          link:
            '/myvoya/link?type=fe&token=urlResourceType%3DFEISSOLINK%26s%3DH7jGNFykQzy5RdWa4Q07eA11.i9290%26clientId%3DDAIMLR%26vendorId%3DFEI%26d%3D10ec95fe1e8279012923e3cc5345df74b6d0d864',
          popup: false,
          order: 0,
        },
        {
          label: 'TD Ameritrade Account',
          link: 'http://www.tdameritraderetirement.com/',
          popup: false,
          order: 0,
        },
      ],
    },
    dataStatus: '',
  };
  const mockPref = {
    dataStatus: 'OK',
    translationEnabled: false,
    modalAlertsEnabled: false,
    contentCaptureEnabled: false,
    oneLinkKeyForEnglish: '50E9-BDF3-115F-286D',
    oneLinkKeyForSpanish: 'D002-7D8C-A50B-FA2D',
    langPreference: {
      preference: 'en-US',
    },
    translationEnabledMyvoyageDsh: false,
    clientTranslationEnabled: true,
    clientId: 'INGWIN',
  };

  beforeEach(
    waitForAsync(async () => {
      voyaCacheService = jasmine.createSpyObj('voyaCacheService', [
        'getTranslationPreference',
      ]);
      utilityServiceSpy = jasmine.createSpyObj('UtilityService', [
        'scrollToTop',
        'getmyvoyaBaseUrl',
        'getMyVoyaDomain',
      ]);
      routerSpy = {
        events: {
          pipe: jasmine.createSpy().and.returnValue(
            of({
              id: 1,
              url: '/coverages/smartCardModal',
            })
          ),
        },
        navigateByUrl: jasmine.createSpy(),
      };
      subscriptionSpy = jasmine.createSpyObj('subscriptionSpy', [
        'unsubscribe',
        'add',
      ]);
      greetingServiceSpy = jasmine.createSpyObj('greetingServiceSpy', [
        'getIsMorningFlag',
        'getIsEveningFlag',
      ]);
      adviceCalloutServiceSpy = jasmine.createSpyObj(
        'adviceCalloutServiceSpy',
        ['getAdviceCallout']
      );
      journeyServiceSpy = jasmine.createSpyObj('journeyServiceSpy', [
        'fetchJourneys',
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
      utilityServiceSpy.getmyvoyaBaseUrl.and.returnValue(
        'https://myvoya-web.intg.voya.com/'
      );
      accessServiceSpy = jasmine.createSpyObj('accessServiceSpy', [
        'checkMyvoyageAccess',
      ]);
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({
          clientDomain: '',
          clientId: '',
          clientName: '',
          enableMyVoyage: 'Y',
          isMxUser: true,
          isMultiClient: true,
          isMyBenefitsUser: true,
        })
      );
      headerTypeServiceSpy = jasmine.createSpyObj('headerTypeServiceSpy', [
        'getMoreResource',
      ]);
      headerTypeServiceSpy.getMoreResource.and.returnValue(of(resourceLinks));
      benefitServiceSpy = jasmine.createSpyObj('benefitServiceSpy', [
        'getBenefitsEnrollment',
      ]);
      benefitServiceSpy.getBenefitsEnrollment.and.returnValue(
        Promise.resolve(
          of({
            enrollmentWindowEnabled: true,
            status: 'NOT_STARTED',
            suppressBanner: false,
          })
        )
      );
      accountServiceSpy = jasmine.createSpyObj('accountServiceSpy', [
        'getAggregatedAccounts',
        'getOffercode',
        'fetchPredictiveMessage',
        'getMoneyOutStatus',
      ]);
      const messagesMockData = {
        OfferCodeAdviceJSON:
          '{"icon":"https://cdn1-originals.webdamdb.com/13947_134637265?cache=1655409017&response-content-disposition=inline;filename=speech%2520bubble%2520filled.svg&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cCo6Ly9jZG4xLW9yaWdpbmFscy53ZWJkYW1kYi5jb20vMTM5NDdfMTM0NjM3MjY1P2NhY2hlPTE2NTU0MDkwMTcmcmVzcG9uc2UtY29udGVudC1kaXNwb3NpdGlvbj1pbmxpbmU7ZmlsZW5hbWU9c3BlZWNoJTI1MjBidWJibGUlMjUyMGZpbGxlZC5zdmciLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjIxNDc0MTQ0MDB9fX1dfQ__&Signature=Ak8hETEvyxXRQb3iAOL10xVlWZbv6iu-1nhFiZVovbZldE5uRqEGs1pdQcdokzklw9Xc0me63HgWkCCIp~mE76YoNyP55-mFSyvIx4oFXkmqi1f9v1Ohhd2VuZtSe58IaafgTeJzEqhp-Erd9FFQGnw0odwMLVVNvWqdCrcYGbetKQu7ebRDnDzFId0Ze414glUBBsgM76OR0ooMYwTZxz5iwRMiUOeFBTQ1C~RdIZimufF~Ris-8s~184eBj2lxG~3uoH8voKi2309aBtWMvBVSGyQ6ftIc9-0ay4U~UwXyyFTWw0Prz0JoG2GFywik39Vs~CtT0DQT0UinyNeV4Q__&Key-Pair-Id=APKAI2ASI2IOLRFF2RHA","MANACCT":{"messages":["The right advice can make all the difference. Investing for retirement can be complicated. Fortunately, getting answers doesn\u2019t have to be. Consider personalized support from a professional."],"link_name":"Get Started","link_url":""},"FE":{"messages":["The right advice can make all the difference. Investing for retirement can be complicated. Fortunately, getting answers doesn\u2019t have to be. Consider personalized support from a professional."],"link_name":"Get Started","link_url":""},"MANACTIPS":{"messages":["The right advice can make all the difference. Investing for retirement can be complicated. Fortunately, getting answers doesn\u2019t have to be. Consider personalized support from a professional."],"link_name":"Get Started","link_url":""}}',
        workplaceAdviceTileJSON:
          '{"icon":"https://cdn1-originals.webdamdb.com/13947_134637265?cache=1655409017&response-content-disposition=inline;filename=speech%2520bubble%2520filled.svg&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cCo6Ly9jZG4xLW9yaWdpbmFscy53ZWJkYW1kYi5jb20vMTM5NDdfMTM0NjM3MjY1P2NhY2hlPTE2NTU0MDkwMTcmcmVzcG9uc2UtY29udGVudC1kaXNwb3NpdGlvbj1pbmxpbmU7ZmlsZW5hbWU9c3BlZWNoJTI1MjBidWJibGUlMjUyMGZpbGxlZC5zdmciLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjIxNDc0MTQ0MDB9fX1dfQ__&Signature=Ak8hETEvyxXRQb3iAOL10xVlWZbv6iu-1nhFiZVovbZldE5uRqEGs1pdQcdokzklw9Xc0me63HgWkCCIp~mE76YoNyP55-mFSyvIx4oFXkmqi1f9v1Ohhd2VuZtSe58IaafgTeJzEqhp-Erd9FFQGnw0odwMLVVNvWqdCrcYGbetKQu7ebRDnDzFId0Ze414glUBBsgM76OR0ooMYwTZxz5iwRMiUOeFBTQ1C~RdIZimufF~Ris-8s~184eBj2lxG~3uoH8voKi2309aBtWMvBVSGyQ6ftIc9-0ay4U~UwXyyFTWw0Prz0JoG2GFywik39Vs~CtT0DQT0UinyNeV4Q__&Key-Pair-Id=APKAI2ASI2IOLRFF2RHA","MANACCT":{"messages":["The right advice can make all the difference. Investing for retirement can be complicated. Fortunately, getting answers doesn\u2019t have to be. Consider personalized support from a professional."],"link_name":"Learn More","link_url":""},"FE":{"messages":["The right advice can make all the difference. Investing for retirement can be complicated. Fortunately, getting answers doesn\u2019t have to be. Consider personalized support from a professional."],"link_name":"Get Started","link_url":""},"MANACTIPS":{"messages":["The right advice can make all the difference. Investing for retirement can be complicated. Fortunately, getting answers doesn\u2019t have to be. Consider personalized support from a professional."],"link_name":"Learn More","link_url":""}}',
      };
      observable = of(messagesMockData);
      subscription = new Subscription();
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(messagesMockData);
        return subscription;
      });
      adviceCalloutServiceSpy.getAdviceCallout.and.returnValue(
        of(mockAdviceCalloutData)
      );
      accountServiceSpy.getAggregatedAccounts.and.returnValue(of(mockAccount));
      accountServiceSpy.fetchPredictiveMessage.and.returnValue(observable);
      homeServiceSpy = jasmine.createSpyObj('HomeService', [
        'openPreferenceSettingModal',
      ]);
      voyaCacheService.getTranslationPreference.and.returnValue(of(mockPref));

      TestBed.configureTestingModule({
        declarations: [WorkplaceHomePage],
        providers: [
          {provide: GreetingService, useValue: greetingServiceSpy},
          {provide: JourneyService, useValue: journeyServiceSpy},
          {provide: AccessService, useValue: accessServiceSpy},
          {provide: BenefitsService, useValue: benefitServiceSpy},
          {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
          {provide: AccountService, useValue: accountServiceSpy},
          {provide: HomeService, useValue: homeServiceSpy},
          {provide: AdviceCalloutService, useValue: adviceCalloutServiceSpy},
          {provide: VoyaGlobalCacheService, useValue: voyaCacheService},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: Router, useValue: routerSpy},
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [RouterTestingModule],
      }).compileComponents();
      fixture = TestBed.createComponent(WorkplaceHomePage);
      component = fixture.componentInstance;
      spyOn(Storage.prototype, 'getItem').and.returnValue('true');
      fetchLocalTimeSpy = spyOn(component, 'fetchLocalTime');
      fetchDataSpy = spyOn(component, 'getOfferCodeValue');
      scrollToTopSpy = spyOn(component, 'scrollToTop');
      fetchMoneyOutStatusSpy = spyOn(component, 'fetchMoneyOutStatus');
      fetchAggregatedAccountsSpy = spyOn(component, 'fetchAggregatedAccounts');
      setMyBenefitsUserSpy = spyOn(component, 'setMyBenefitsUser');
      component['subscription'] = subscriptionSpy;
      fixture.detectChanges();
      await component.ngOnInit();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call scrollToTop', () => {
      expect(component.scrollToTop).toHaveBeenCalled();
    });
    it('should call checkMyvoyageAccess', () => {
      expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      expect(component.isMyVoyageEnabled).toEqual(true);
      expect(component.myVoyageAccess).toEqual({
        clientDomain: '',
        clientId: '',
        clientName: '',
        enableMyVoyage: 'Y',
        isMxUser: true,
        isMultiClient: true,
        isMyBenefitsUser: true,
      } as AccessResult);
    });
    it('should set the data of isMyBenefitsUser', () => {
      expect(component.isMyBenefitsUser).toEqual(true);
      expect(Storage.prototype.getItem).toHaveBeenCalledWith('isMyBenefitshub');
    });
    it('should call setMyBenefitsUser', () => {
      expect(component.setMyBenefitsUser).toHaveBeenCalledWith(true);
    });
  });

  describe('setMyBenefitsUser', () => {
    beforeEach(() => {
      spyOn(component, 'loadMyBenefitsTemp');
      setMyBenefitsUserSpy.and.callThrough();
      spyOn(component, 'loadWorkplaceDashboardTemp');
      component.isTemplateReady = false;
    });
    it('when isMyBenefitsUser will be true', () => {
      component.setMyBenefitsUser(true);
      expect(component.loadMyBenefitsTemp).toHaveBeenCalled();
    });
    it('when isMyBenefitsUser will be false', () => {
      component.setMyBenefitsUser(false);
      expect(component.loadWorkplaceDashboardTemp).toHaveBeenCalled();
    });
    it('isTemplateReady will be true', () => {
      component.setMyBenefitsUser(false);
      expect(component.isTemplateReady).toEqual(true);
    });
  });

  describe('loadMyBenefitsTemp', () => {
    beforeEach(() => {
      spyOn(component, 'getMyBenefitsUrl');
    });
    it('should call getMyBenefitsUrl', () => {
      component.loadMyBenefitsTemp();
      expect(component.getMyBenefitsUrl).toHaveBeenCalled();
    });
  });

  describe('getMyBenefitsUrl', () => {
    it('should call getMyVoyaDomain', () => {
      utilityServiceSpy.getMyVoyaDomain.and.returnValue(
        'https://my3.intg.voya.com/'
      );
      component.getMyBenefitsUrl();
      expect(utilityServiceSpy.getMyVoyaDomain).toHaveBeenCalled();
      expect(component.myBenefitsUrl).toEqual(
        'https://my3.intg.voya.com/myBenefitsHub/billing/overview'
      );
    });
    it('myBenefitsUrl is not null when env is not intg', () => {
      utilityServiceSpy.getMyVoyaDomain.and.returnValue(
        'https://my3.accp.voya.com/'
      );
      component.getMyBenefitsUrl();
      expect(utilityServiceSpy.getMyVoyaDomain).toHaveBeenCalled();
      expect(component.myBenefitsUrl).toEqual(undefined);
    });
  });

  describe('loadWorkplaceDashboardTemp', () => {
    it('should call openPreferenceSettingModal', () => {
      component.loadWorkplaceDashboardTemp();
      expect(homeServiceSpy.openPreferenceSettingModal).toHaveBeenCalled();
    });

    it('should call fetchJourneys and journeys is true', async () => {
      await component.loadWorkplaceDashboardTemp();
      expect(journeyServiceSpy.fetchJourneys).toHaveBeenCalled();
    });
    it('should call fetchMoneyOutStatus', async () => {
      await component.loadWorkplaceDashboardTemp();
      expect(component.fetchMoneyOutStatus).toHaveBeenCalled();
    });
    it('should fetch Aggregated accounts', async () => {
      await component.loadWorkplaceDashboardTemp();
      expect(component.fetchAggregatedAccounts).toHaveBeenCalled();
    });
    it('should call getMoreResource ', async () => {
      await component.loadWorkplaceDashboardTemp();
      expect(headerTypeServiceSpy.getMoreResource).toHaveBeenCalled();
      expect(component.moreResources).toEqual(resourceLinks.resourceLink);
      expect(component['subscription'].add).toHaveBeenCalled();
    });
    it('should call accountService to check value of hasMXAccount', async () => {
      await component.loadWorkplaceDashboardTemp();
      expect(accountServiceSpy.getAggregatedAccounts).toHaveBeenCalled();
      expect(component.hasMXAccount).toBeTrue();
    });
    it('should call getBenefitsEnrollment and set the value of benefitsEnrollment$', async done => {
      await component.loadWorkplaceDashboardTemp();
      component.benefitsEnrollment$.subscribe(data => {
        expect(benefitServiceSpy.getBenefitsEnrollment).toHaveBeenCalled();
        expect(data).toEqual({
          enrollmentWindowEnabled: true,
          status: 'NOT_STARTED',
          suppressBanner: false,
        });
        done();
      });
    });
    it('should set translation object to null when translation message is absent in response', async () => {
      await component.loadWorkplaceDashboardTemp();
      expect(component.translation).toBeNull();
    });
    it('should set translation object when translation message is present', async () => {
      const messagesMockData = {
        translationMessage:
          '{"linkText":"link text here","message":"message here","buttonText":"close"}',
      };
      observable = of(messagesMockData);
      subscription = new Subscription();
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(messagesMockData);
        return subscription;
      });
      accountServiceSpy.fetchPredictiveMessage.and.returnValue(observable);
      await component.loadWorkplaceDashboardTemp();
      expect(component.translation).toEqual({
        linkText: 'link text here',
        message: 'message here',
        buttonText: 'close',
      });
    });
    it('should set translationPref', async () => {
      await component.loadWorkplaceDashboardTemp();
      expect(component.translationPref).toEqual(mockPref);
    });
  });

  describe('scrollToTop', () => {
    beforeEach(() => {
      scrollToTopSpy.and.callThrough();
      component.topmostElement = {
        nativeElement: jasmine.createSpyObj('nativeElement', [
          'scrollIntoView',
        ]),
      } as ElementRef;
    });
    it('should call scroll to top', fakeAsync(() => {
      component.scrollToTop();
      expect(routerSpy.events.pipe).toHaveBeenCalled();
      tick(100);
      expect(utilityServiceSpy.scrollToTop).toHaveBeenCalledWith(
        component.topmostElement
      );
    }));
  });

  describe('fetchLocalTime', () => {
    beforeEach(() => {
      fetchLocalTimeSpy.and.callThrough();
      greetingServiceSpy.getIsMorningFlag.and.returnValue(false);
      greetingServiceSpy.getIsEveningFlag.and.returnValue(false);
    });
    it('should set the values of isMorning & isEvening', () => {
      component.fetchLocalTime();
      expect(greetingServiceSpy.getIsMorningFlag).toHaveBeenCalled();
      expect(greetingServiceSpy.getIsEveningFlag).toHaveBeenCalled();
      expect(component.isEvening).toEqual(false);
      expect(component.isMorning).toEqual(false);
    });
  });

  describe('fetchMoneyOutStatus', () => {
    let subscription;
    let observable;
    let emptyResponse;
    let observableWithNoMsg;
    const result = [
      'Good news! Your hardship withdrawal requested on 12/28/2021 for $2,000.00 has been processed. We are currently preparing your payment for delivery. Once complete, you should receive your payment via check within 5 to 7 business days.',
    ];
    const moneyOutResponse =
      '[{"clientId": "ADPTTL","clientPlanTransactions": [{"planId": "894550","details": {"item": {"clientType": "IPS","moneyoutTotalCount": "1","moneyoutLoanCount": "0","moneyoutWithdrawalCount": "1","paymentStopped": "false","moneyoutComposite": "false","notepadAttached": null},"transactionList": [{ "checkCashDate": "","currentStatus": "PPT_PREPARE_PAYMENT","deliveryMaxDate": "","deliveryRange": "5 to 7","directDepositDate": "", "moneyOutDeliveryMethod": "check","moneyOutSubType": "hardship withdrawal","moneyOutType": "WITHDRAWAL","netCheckAmount": "USD2,000.00","netCheckAmountSource": "OLTP","taskId": "t211228000i","transactionDate": "2021-12-28","transactionCompletionDate": "","upsTrackingAvailable": "false","upsTrackingNumber": "","moneyOutMessage": "Good news! Your hardship withdrawal requested on 12/28/2021 for $2,000.00 has been processed. We are currently preparing your payment for delivery. Once complete, you should receive your payment via check within 5 to 7 business days.","transactionIdentifier": "4325113"}],"moneyOutEnabledInSetIt": true}}]}]';
    const moneyOutResponseWithNoMessage =
      '[{"clientId": "ADPTTL","clientPlanTransactions": [{"planId": "894550","details": {"item": {"clientType": "IPS","moneyoutTotalCount": "1","moneyoutLoanCount": "0","moneyoutWithdrawalCount": "1","paymentStopped": "false","moneyoutComposite": "false","notepadAttached": null},"transactionList": [{ "checkCashDate": "","currentStatus": "PPT_PREPARE_PAYMENT","deliveryMaxDate": "","deliveryRange": "5 to 7","directDepositDate": "", "moneyOutDeliveryMethod": "check","moneyOutSubType": "hardship withdrawal","moneyOutType": "WITHDRAWAL","netCheckAmount": "USD2,000.00","netCheckAmountSource": "OLTP","taskId": "t211228000i","transactionDate": "2021-12-28","transactionCompletionDate": "","upsTrackingAvailable": "false","upsTrackingNumber": "","transactionIdentifier": "4325113"}],"moneyOutEnabledInSetIt": true}}]}]';

    beforeEach(() => {
      fetchMoneyOutStatusSpy.and.callThrough();
      observable = of(JSON.parse(moneyOutResponse));
      emptyResponse = of(JSON.parse('[]'));
      observableWithNoMsg = of(JSON.parse(moneyOutResponseWithNoMessage));
      subscription = new Subscription();
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(JSON.parse(moneyOutResponse));
        return subscription;
      });
      spyOn(emptyResponse, 'subscribe').and.callFake(f => {
        f(JSON.parse('[]'));
        return subscription;
      });
      spyOn(observableWithNoMsg, 'subscribe').and.callFake(f => {
        f(JSON.parse(moneyOutResponseWithNoMessage));
        return subscription;
      });
    });
    it('should call getMoneyOutStatus and set  moneyOutMessagesList value ', () => {
      accountServiceSpy.getMoneyOutStatus.and.returnValue(observable);
      component.fetchMoneyOutStatus();
      expect(component.isMoneyOutAvailable).toBeTruthy();
      expect(accountServiceSpy.getMoneyOutStatus).toHaveBeenCalled();
      expect(component.moneyOutMessagesList).toEqual(result);
    });
    it('should call getMoneyOutStatus and NOT set moneyOutMessagesList value, emit false and set isMoneyoutAvailable to false', () => {
      accountServiceSpy.getMoneyOutStatus.and.returnValue(emptyResponse);
      component.fetchMoneyOutStatus();
      expect(component.isMoneyOutAvailable).toBeFalsy();
      expect(accountServiceSpy.getMoneyOutStatus).toHaveBeenCalled();
      expect(component.moneyOutMessagesList).toEqual(JSON.parse('[]'));
    });
    it('should call getMoneyOutStatus and NOT set moneyOutMessagesList to be empty , emit false and set isMoneyoutAvailable to false', () => {
      accountServiceSpy.getMoneyOutStatus.and.returnValue(observableWithNoMsg);
      component.fetchMoneyOutStatus();
      expect(component.isMoneyOutAvailable).toBeFalsy();
      expect(accountServiceSpy.getMoneyOutStatus).toHaveBeenCalled();
      expect(component.moneyOutMessagesList).toEqual([]);
    });
  });
  describe('fetchAggregatedAccounts', () => {
    let observable;
    let subscription;
    beforeEach(() => {
      fetchAggregatedAccountsSpy.and.callThrough();
      observable = of(mockAggregatedAccount);
      subscription = new Subscription();
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockAggregatedAccount);
        return subscription;
      });
    });
    it('Should fetch getAggregatedAccounts accounts for snapshots', () => {
      accountServiceSpy.getAggregatedAccounts.and.returnValue(observable);
      component.fetchAggregatedAccounts();
      expect(component['subscription'].add).toHaveBeenCalledWith(subscription);
      expect(component.snapshotAccount).toEqual(
        mockAggregatedAccount['snapshotAccounts']
      );
    });
  });

  it('should return height as true if window.innerWidth is > 1100', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(1200);
    fixture.detectChanges();
    const result = component.isSizeOne();
    expect(result).toEqual(true);
  });

  it('should return height as true if window.innerWidth is > 920 and window.innerWidth <= 1100', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(921);
    fixture.detectChanges();
    const result = component.isSizeTwo();
    expect(result).toEqual(true);
  });

  it('should return height as true if window.innerWidth is  >= 800 and window.innerWidth <= 920', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(801);
    fixture.detectChanges();
    const result = component.isSizeThree();
    expect(result).toEqual(true);
  });

  it('should return height as true if window.innerWidth is < 800', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(799);
    fixture.detectChanges();
    const result = component.isSizeFour();
    expect(result).toEqual(true);
  });
  describe('getOfferCodeValue', () => {
    let offerData;
    beforeEach(() => {
      fetchDataSpy.and.callThrough();
      offerData = [
        {
          clientId: 'INGWIN',
          messages:
            'The right advice can make all the difference. Investing for retirement can be complicated. Fortunately, getting answers doesn’t have to be. Consider personalized support from a professional.',
          linkName: 'Learn More',
          title: 'Get Advice',
          offerCode: 'MANACCT',
          messageType: 'MESSAGE',
          targetUrl:
            'https%3A%2F%2Flogin.unit.voya.com%2Fsaml%2Fsps%2Fsaml-idp-login%2Fsaml20%2Flogininitial%3FPartnerId%3Dhttps%3A%2F%2Fmy3.unit.voya.com%2Fmga%2Fsps%2Fsaml-sp-my-local%2Fsaml20%26access_token%3D%5Bexchanged_access_token%5D%26Target=https%3A%2F%2Fmy3.unit.voya.com%2Fvoyasso%2FmobileSignOn%3Fdomain%3Dadptotalsource.intg.voya.com%26target%3D/epweb/pweblink.do?s=t5GrHS1kbmdRAVyy0fN0bA11.i9290&domain=adptotalsource.intg.voya.com&cl=INGWIN&act_type=P&page=advice&pageId=ACCT_GET_ADVICE&plan=814059&d=fcd814d3ab4f7100e1b914b3a980526d102e4569',
          imageTargetUrl:
            'https://my3.intg.voya.com/eicc/servlet/MessageEventTrackingServlet?summaryId=041848716814059MANACCT&loginDateTime=10%2F06%2F2023+17%3A22%3A42&sessionId=t5GrHS1kbmdRAVyy0fN0bA11.i9290&msgAction=Yes&messageId=AC.84&msgSource=ACCORDION&targetURL=https%3A%2F%2F%3Cclient+domain%3E%2Fepweb%2Fpweblink.do%3Fpage%3Dadvice%26plan%3D814059%26s%3D%3CSSO+Session+ID%3E%26domain%3D%3CClient+domain%3E%26act_type%3D%26pageId%3DACCT_GET_ADVICE%26d%3D%3Cdigital+sig%3E&d=b9428dfa73d919a62d4bc255118b7e3990de367e',
        },
        {
          clientId: 'INGWIN',
          messages:
            'The right advice can make all the difference. Investing for retirement can be complicated. Fortunately, getting answers doesn’t have to be. Consider personalized support from a professional.',
          linkName: 'Get Started',
          title: 'Compare Yourself',
          offerCode: 'MANACTIPS',
          messageType: 'DEFAULT',
          targetUrl: 'http://voya.com/tool/compare-me/',
          imageTargetUrl: 'http://voya.com/tool/compare-me/',
        },
      ];
    });
    it('should offerVal would be undefined', async () => {
      adviceCalloutServiceSpy.getAdviceCallout.and.returnValue(
        Promise.resolve(offerData)
      );
      component.offerVal = undefined;
      await component.getOfferCodeValue();
      expect(component.offerVal).toEqual(offerData);
    });
  });

  it('ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(component.subscription.unsubscribe).toHaveBeenCalled();
  });
});
