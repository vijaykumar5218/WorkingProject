import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {AccountListComponent} from './account-list.component';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {Router} from '@angular/router';
import {of, Subscription} from 'rxjs';
import {AccountService} from '@shared-lib/services/account/account.service';

describe('AccountListComponent', () => {
  let component: AccountListComponent;
  let fixture: ComponentFixture<AccountListComponent>;
  let utilityServiceSpy;
  let routerSpy;
  let fetchParamIdSpy;
  let accountServiceSpy;

  const accountsdatas: any = {
    accountTitle: '',
    accountBalance: '',
    accountBalanceAsOf: '',
    suppressTab: false,
    voyaSavings: '',
    includedInOrangeMoney: false,
    accountAllowedForMyVoya: false,
    clientId: '',
    planId: '1234',
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
    isRestrictedRetirementPlan: false,
    isVDAApplication: false,
    isVendorPlan: false,
  };

  beforeEach(
    waitForAsync(() => {
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy', [
        'getIsWeb',
        'fetchUrlThroughNavigation',
      ]);
      routerSpy = {
        navigateByUrl: jasmine.createSpy(),
      };
      utilityServiceSpy.fetchUrlThroughNavigation.and.returnValue({
        subscribe: () => undefined,
      });
      accountServiceSpy = jasmine.createSpyObj('accountServiceSpy', [
        'setAccountLocalStorage',
      ]);
      TestBed.configureTestingModule({
        declarations: [AccountListComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: Router, useValue: routerSpy},
          {provide: AccountService, useValue: accountServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(AccountListComponent);

      component = fixture.componentInstance;
      fetchParamIdSpy = spyOn(component, 'fetchParamId');
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set isWeb and call fetchParamId', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      component.ngOnInit();
      expect(component.isWeb).toEqual(true);
      expect(component.fetchParamId).toHaveBeenCalled();
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
    });
  });

  describe('onAccountClicked', () => {
    beforeEach(() => {
      spyOn(component.accountClicked, 'emit');
    });
    it('should emit accountClicked', () => {
      component.onAccountClicked(accountsdatas);
      expect(component.accountClicked.emit).toHaveBeenCalled();
    });
    it('When isWeb would be true', () => {
      component.isWeb = true;
      component.onAccountClicked(accountsdatas);
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        `accounts/account-details/${accountsdatas.planId}/info`
      );
    });

    it('When isWeb would be false', () => {
      component.isWeb = false;
      component.onAccountClicked(accountsdatas);
      expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
    });
    it('When isWeb would be true and voyaAccessPlan is true', () => {
      component.isWeb = true;
      component.onAccountClicked({
        ...accountsdatas,
        ...{isVoyaAccessPlan: true},
      });
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        `accounts/account-details/${accountsdatas.planId +
          '-isVoyaAccessPlan-' +
          accountsdatas.agreementId}/info`
      );
    });
    it('When isWeb would be true and isVendorPlan is true', () => {
      component.isWeb = true;
      component.onAccountClicked({
        ...accountsdatas,
        ...{isVendorPlan: true},
      });
      expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
    });
  });

  describe('fetchParamId', () => {
    let subscriptionMock;
    let observable;
    let mockData;
    beforeEach(() => {
      mockData = {
        paramId: '123',
        url: '/accounts/account-details/123/info',
      };
      fetchParamIdSpy.and.callThrough();
      spyOn(component.subscription, 'add');
      observable = of(mockData);
      subscriptionMock = new Subscription();
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockData);
        return subscriptionMock;
      });
      component.paramId = undefined;
    });
    it("When planId would be '1234'", () => {
      utilityServiceSpy.fetchUrlThroughNavigation.and.returnValue(observable);
      component.fetchParamId();
      expect(component.paramId).toEqual(mockData['paramId']);
      expect(component.subscription.add).toHaveBeenCalledWith(subscriptionMock);
      expect(utilityServiceSpy.fetchUrlThroughNavigation).toHaveBeenCalledWith(
        3
      );
    });
    it('When planId would be undefined', () => {
      utilityServiceSpy.fetchUrlThroughNavigation.and.returnValue(of(null));
      component.fetchParamId();
      expect(component.paramId).toEqual(undefined);
    });
  });

  describe('manageWidthOfCard', () => {
    beforeEach(() => {
      component.isWeb = true;
    });
    describe('isWeb would be true', () => {
      it('When Width would be 480px', () => {
        component.paramId = '1234';
        const output = component.manageWidthOfCard(accountsdatas);
        expect(output).toEqual({width: '480px'});
        expect(accountServiceSpy.setAccountLocalStorage).toHaveBeenCalledWith(
          accountsdatas
        );
      });
      it('When Width would be auto', () => {
        component.paramId = 'PlanId124';
        const output = component.manageWidthOfCard(accountsdatas);
        expect(output).toEqual({width: 'auto'});
        expect(accountServiceSpy.setAccountLocalStorage).not.toHaveBeenCalled();
      });
      it('When Width would be 480px and voyaAccesPlan is true', () => {
        component.paramId = '1234-isVoyaAccessPlan-56';
        const output = component.manageWidthOfCard({
          ...accountsdatas,
          ...{isVoyaAccessPlan: true, agreementId: '56'},
        });
        expect(output).toEqual({width: '480px'});
        expect(accountServiceSpy.setAccountLocalStorage).toHaveBeenCalled();
      });
    });
    it('isWeb would be false', () => {
      component.isWeb = false;
      const output = component.manageWidthOfCard(accountsdatas);
      expect(output).toEqual(null);
    });
  });

  it('ngOnDestroy', () => {
    spyOn(component.subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscription.unsubscribe).toHaveBeenCalled();
  });
});
