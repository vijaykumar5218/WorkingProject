import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {BillingPaymentsComponent} from './billing-payments.component';

import {ContentService} from '@web/app/modules/shared/services/content/content.service';
import {Subscription, of} from 'rxjs';
import {MyBenefitHubService} from '@web/app/modules/shared/services/myBenefitHub/mybenefithub.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
describe('BillingPaymentsComponent', () => {
  let component: BillingPaymentsComponent;
  let fixture: ComponentFixture<BillingPaymentsComponent>;
  let contentServiceSpy;
  let subscriptionSpy;
  let myBenefitHubServiceSpy;
  let loadDataSpy;
  let utilityServiceSpy;
  const mockBillingAccounts = {
    billingAccounts: [
      {
        financialAccountId: '932722',
        balance: 166.7,
        totalSuspense: '0',
        billingConfigs: {
          billingServiceTechId: '697356',
          paymentFormat: 'ACH Initiate',
          nextBillingGenerationDate: '2024-01-04 00:00:00.0',
          nextBillingPeriodStartDate: '2024-02-01 00:00:00.0',
          achDay: '',
          achNextDay: '',
          lapseDate: '',
          status: 'Active - In-Force',
          effectiveDate: '2020-11-01 00:00:00.0',
          terminationDate: '',
          invoiceFrequency: 'Quarterly',
          bankAccountTechId: '',
          bankName: '',
          accountType: '',
          routingNumber: '',
          bankAccountNumber: '',
          bankAccountName: '',
          achEffectiveDate: '',
          surrenderStatus: '',
          downstreamProcessingStatus: null,
        },
      },
    ],
  };
  const mockContent = {
    billingandpayments:
      '{"billingPayments":{"header":"Billing and Payments","nonAutoPay":{"noPaymentDue":{"message":"You have no payment due at this time."},"paymentDue":{"message":"Action Required: You have a total payment due of ${{totalPaymentDue}}.","isShowAlertIcon": true,"linkName":"Make a payment"}},"autoPay":{"noPaymentDue":{"message":"You have no scheduled payment due at this time."},"paymentDue":{"message":"You have a total scheduled payment due of ${{totalPaymentDue}}.","linkName":"View your account"}}}\r\n}\r\n',
  };

  beforeEach(
    waitForAsync(() => {
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy', [
        'getEnvironment',
      ]);
      contentServiceSpy = jasmine.createSpyObj('contentServiceSpy', [
        'getMbhDashboardContent',
      ]);
      subscriptionSpy = jasmine.createSpyObj('subscriptionSpy', [
        'unsubscribe',
        'add',
      ]);
      contentServiceSpy.getMbhDashboardContent.and.returnValue({
        subscribe: () => undefined,
      });
      myBenefitHubServiceSpy = jasmine.createSpyObj('myBenefitHubServiceSpy', [
        'allAccountsHaveNonforfeitureOptionStatus',
        'fetchBillingAccounts',
        'hasNonAutoPay',
        'setPaymentDueDetails',
      ]);
      TestBed.configureTestingModule({
        declarations: [BillingPaymentsComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {
            provide: ContentService,
            useValue: contentServiceSpy,
          },
          {
            provide: MyBenefitHubService,
            useValue: myBenefitHubServiceSpy,
          },
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(BillingPaymentsComponent);
      component = fixture.componentInstance;
      loadDataSpy = spyOn(component, 'loadData');
      component['subscription'] = subscriptionSpy;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call loadData', () => {
      expect(component.loadData).toHaveBeenCalled();
    });
  });

  describe('loadData', () => {
    beforeEach(() => {
      loadDataSpy.and.callThrough();
      spyOn(component, 'fetchBillingAccounts');
    });
    it('when showPanel will be true', () => {
      myBenefitHubServiceSpy.allAccountsHaveNonforfeitureOptionStatus.and.returnValue(
        of(true)
      );
      component.loadData();
      expect(
        myBenefitHubServiceSpy.allAccountsHaveNonforfeitureOptionStatus
      ).toHaveBeenCalled();
      expect(component.showPanel).toEqual(true);
      expect(component.fetchBillingAccounts).toHaveBeenCalled();
    });
    it('when showPanel will be false', () => {
      myBenefitHubServiceSpy.allAccountsHaveNonforfeitureOptionStatus.and.returnValue(
        of(false)
      );
      component.loadData();
      expect(component.showPanel).toEqual(false);
      expect(component.fetchBillingAccounts).not.toHaveBeenCalled();
    });
  });

  describe('fetchBillingAccounts', () => {
    let subscription;
    let observable;
    beforeEach(() => {
      spyOn(component, 'fetchMbhDashboardContent');
      subscription = new Subscription();
      observable = of(mockBillingAccounts);
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockBillingAccounts);
        return subscription;
      });
      myBenefitHubServiceSpy.fetchBillingAccounts.and.returnValue(observable);
      myBenefitHubServiceSpy.hasNonAutoPay.and.returnValue(true);
      myBenefitHubServiceSpy.setPaymentDueDetails.and.returnValue({
        totalPaymentDue: 166.7,
        nPaymentsDue: 1,
      });
    });
    it('should set the data', () => {
      component.fetchBillingAccounts();
      expect(component['subscription'].add).toHaveBeenCalledWith(subscription);
      expect(myBenefitHubServiceSpy.fetchBillingAccounts).toHaveBeenCalled();
      expect(myBenefitHubServiceSpy.hasNonAutoPay).toHaveBeenCalledWith(
        mockBillingAccounts
      );
      expect(component.isNonAutoPay).toEqual(true);
      expect(myBenefitHubServiceSpy.setPaymentDueDetails).toHaveBeenCalledWith(
        mockBillingAccounts
      );
      expect(component.nPaymentsDue).toEqual(1);
      expect(component.totalPaymentDue).toEqual(166.7);
      expect(component.fetchMbhDashboardContent).toHaveBeenCalled();
    });
  });

  describe('fetchMbhDashboardContent', () => {
    let subscription;
    let observable;
    beforeEach(() => {
      subscription = new Subscription();
      observable = of(mockContent);
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockContent);
        return subscription;
      });
      contentServiceSpy.getMbhDashboardContent.and.returnValue(observable);
    });
    describe('for nonAutoPay', () => {
      beforeEach(() => {
        component.isNonAutoPay = true;
      });
      it('when nPaymentsDue will be 1', () => {
        component.nPaymentsDue = 1;
        component.totalPaymentDue = 100;
        component.fetchMbhDashboardContent();
        expect(contentServiceSpy.getMbhDashboardContent).toHaveBeenCalled();
        expect(component['subscription'].add).toHaveBeenCalledWith(
          subscription
        );
        expect(component.dataLoading).toEqual(true);
        expect(component.content).toEqual({
          header: 'Billing and Payments',
          info: {
            message: 'Action Required: You have a total payment due of $100.',
            isShowAlertIcon: true,
            linkName: 'Make a payment',
          },
        });
      });
      it('when nPaymentsDue will be 0', () => {
        component.nPaymentsDue = 0;
        component.totalPaymentDue = 0;
        component.fetchMbhDashboardContent();
        expect(component.content).toEqual({
          header: 'Billing and Payments',
          info: {message: 'You have no payment due at this time.'},
        });
      });
    });
    describe('for autoPay', () => {
      beforeEach(() => {
        component.isNonAutoPay = false;
      });
      it('when nPaymentsDue will be 1', () => {
        component.nPaymentsDue = 1;
        component.totalPaymentDue = 100;
        component.fetchMbhDashboardContent();
        expect(component.content).toEqual({
          header: 'Billing and Payments',
          info: {
            message: 'You have a total scheduled payment due of $100.',
            linkName: 'View your account',
          },
        });
      });
      it('when nPaymentsDue will be 0', () => {
        component.nPaymentsDue = 0;
        component.totalPaymentDue = 0;
        component.fetchMbhDashboardContent();
        expect(component.content).toEqual({
          header: 'Billing and Payments',
          info: {message: 'You have no scheduled payment due at this time.'},
        });
      });
    });
  });

  describe('onClick', () => {
    beforeEach(() => {
      utilityServiceSpy.getEnvironment.and.returnValue({
        myVoyaDomain: 'myVoyaDomain/',
      });
    });
    it('should call window.open', () => {
      spyOn(window, 'open');
      component.onClick('billing');
      expect(utilityServiceSpy.getEnvironment).toHaveBeenCalled();
      expect(window.open).toHaveBeenCalledWith('myVoyaDomain/billing', '_self');
    });
  });
});
