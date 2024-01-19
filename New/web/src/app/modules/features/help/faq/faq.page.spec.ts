import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {FaqPage} from './faq.page';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {of, Subscription} from 'rxjs';
import {HelpService} from '@shared-lib/services/help/help.service';
import {AccountInfoService} from '@shared-lib/services/account-info/account-info.service';
import {AccessService} from '@shared-lib/services/access/access.service';

describe('FaqPage', () => {
  let component: FaqPage;
  let fixture: ComponentFixture<FaqPage>;
  let helpServiceSpy;
  let accountInfoServiceSpy;
  let accessServiceSpy;
  const mockhelpPageJSON = {
    DesktopHelpPageFAQs:
      '{"page Header":"","categoryList":[{"category":{"title":"What is myVoyage?","enableMyVoyage": false,"questionList":[{"question":"What is myVoyage?","enableMyVoyage": false,"description":"myVoyage is the next generation of your financial life. This simplified and seamless mobile app brings personalized guidance and data-driven insights to help you get the most of your workplace benefits and your finances.<br><br> <b>Organize your financial life:</b><br> Connect your checking and savings accounts and credit cards to get a clear view of everything you owe and own<br><br><b>View your holistic financial wellness:</b><br>See where you stand, set and track goals like saving for college or paying off debt and get insights to help along the way<br><br> <b>Benefits enrollment guidance:</b><br> Compare your workplace benefits options and costs, and receive personalized recommendations to maximize your coverage and savings<br><br> <b>Manage your health and retirement savings:</b><br> Understand how much you\'ve saved, what you\'ll need in the future and easily make changes to your savings and investments<br><br> <b>Access medical claims:</b><br> Track out of pocket expenses and get reminders for preventative care<br><br> <b>Personalized nudges and actions:</b><br> Specific steps, tools and resources to help you navigate different life stages and events including everything from daily spending to having children or preparing for retirement<br><br> <b>Get help:</b><br> Schedule time with a financial professional<br><br> myVoyage is only available if your employer has chosen to offer this experience."}]}},{"category":{"title":"Managing My Coverages","questionList":[{"question":"What can I view under coverages?","enableMyVoyage": false,"description":"You can view all of the benefits that you\u2019re currently enrolled in through your employer and details about those benefits.  You can also view insights on your medical benefits."},{"question":"What do I need to authorize claims data and information?","enableMyVoyage": false,"description":"We only pull in this data with your permission...if authorized, we pull in medical claims data from your health insurance provider and give you a view off your health care expenses.  You also get nudges for preventative care available to you."},{"question":"Can I remove authorization to claims?","enableMyVoyage": false,"description":"Yes, you can select \u201cRevoke Claims Authorization\u201d at the bottom of the insights tab under Coverages at any time."},{"question":"How do you calculate the total health spending?","enableMyVoyage": false,"description":"The plan details are based on the latest medical and prescription drug information provided on your behalf.  Any related claim or calculated transaction that is currently pending process completion may not be included in the results"},{"question":"Can I manage my health benefits?","enableMyVoyage": false,"description":"Yes. For your health insurance benefits, here are the thing you can do:<br><br>\u25cf View your health spending including your premiums, co-pays and out-of-pocket services<br><br>\u25cf View your health plan usage such as visits to the doctor and medications<br><br>\u25cf Find healthcare providers and book appointments<br><br> Other health benefits, including life, disability and supplemental benefits:<br><br>\u25cf View coverages<br><br>\u25cf  File and manage claims<br><br>\u25cf Get reminders to use benefits for a covered event"}]}}],"StillHaveQuestionsTile":{"questionsText":"Still have questions?","helpEmailText":"Contact Voya Support","helpEmailLink":"mailto:myvoyage@voya.com"}}',
  };
  const mockhelpPageJSONWithoutCoverage = {
    DesktopHelpPageFAQs:
      '{"page Header":"","categoryList":[{"category":{"title":"What is myVoyage?","enableMyVoyage": false,"questionList":[{"question":"What is myVoyage?","enableMyVoyage": false,"description":"myVoyage is the next generation of your financial life. This simplified and seamless mobile app brings personalized guidance and data-driven insights to help you get the most of your workplace benefits and your finances.<br><br> <b>Organize your financial life:</b><br> Connect your checking and savings accounts and credit cards to get a clear view of everything you owe and own<br><br><b>View your holistic financial wellness:</b><br>See where you stand, set and track goals like saving for college or paying off debt and get insights to help along the way<br><br> <b>Benefits enrollment guidance:</b><br> Compare your workplace benefits options and costs, and receive personalized recommendations to maximize your coverage and savings<br><br> <b>Manage your health and retirement savings:</b><br> Understand how much you\'ve saved, what you\'ll need in the future and easily make changes to your savings and investments<br><br> <b>Access medical claims:</b><br> Track out of pocket expenses and get reminders for preventative care<br><br> <b>Personalized nudges and actions:</b><br> Specific steps, tools and resources to help you navigate different life stages and events including everything from daily spending to having children or preparing for retirement<br><br> <b>Get help:</b><br> Schedule time with a financial professional<br><br> myVoyage is only available if your employer has chosen to offer this experience."}]}}],"StillHaveQuestionsTile":{"questionsText":"Still have questions?","helpEmailText":"Contact Voya Support","helpEmailLink":"mailto:myvoyage@voya.com"}}',
  };
  const mockMyvoyageAccessData: any = {
    enableCoverages: false,
  };
  beforeEach(
    waitForAsync(() => {
      accessServiceSpy = jasmine.createSpyObj('AccessService', [
        'checkMyvoyageAccess',
      ]);
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve(mockMyvoyageAccessData)
      );
      accountInfoServiceSpy = jasmine.createSpyObj('AccountInfoService', [
        'getScreenMessage',
      ]);
      accountInfoServiceSpy.getScreenMessage.and.returnValue({
        subscribe: () => undefined,
      });
      helpServiceSpy = jasmine.createSpyObj('HelpService', [
        'setCategoryData',
        'navigateToHelpContent',
      ]);
      TestBed.configureTestingModule({
        declarations: [FaqPage],
        providers: [
          {provide: HelpService, useValue: helpServiceSpy},
          {provide: AccountInfoService, useValue: accountInfoServiceSpy},
          {provide: AccessService, useValue: accessServiceSpy},
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [RouterTestingModule],
      }).compileComponents();

      fixture = TestBed.createComponent(FaqPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    let subscriptionMock;
    let observable;
    beforeEach(() => {
      subscriptionMock = new Subscription();
      observable = of(mockhelpPageJSON);
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockhelpPageJSON);
        return subscriptionMock;
      });
      spyOn(component.subscription, 'add');
      accountInfoServiceSpy.getScreenMessage.and.returnValue(observable);
    });
    it('when enableCoverages true and enableMyVoyage is false in Drupal', async () => {
      const mockMyvoyageAccessData1: any = {
        enableCoverages: true,
        enableMyVoyage: true,
      };
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve(mockMyvoyageAccessData1)
      );
      await component.ngOnInit();
      expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      expect(
        component.DesktopHelpPageFAQs.categoryList[0].category.enableMyVoyage
      ).toEqual(false);
    });
    it('when enableCoverages will be false', async () => {
      await component.ngOnInit();
      expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      expect(component.subscription.add).toHaveBeenCalledWith(subscriptionMock);
      expect(accountInfoServiceSpy.getScreenMessage).toHaveBeenCalled();
      expect(component.DesktopHelpPageFAQs).toEqual(
        JSON.parse(mockhelpPageJSONWithoutCoverage.DesktopHelpPageFAQs)
      );
    });
  });

  describe('navigateTo', () => {
    const category = JSON.parse(mockhelpPageJSON.DesktopHelpPageFAQs)
      .categoryList[0];
    it('navigateToHelpContent will navigate to help/faq/help-content', () => {
      component.navigateTo(category);
      expect(helpServiceSpy.setCategoryData).toHaveBeenCalledWith(category);
      expect(helpServiceSpy.navigateToHelpContent).toHaveBeenCalledWith(
        'help/faq/help-content'
      );
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      spyOn(component.subscription, 'unsubscribe');
      component.ngOnDestroy();
      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });
});
