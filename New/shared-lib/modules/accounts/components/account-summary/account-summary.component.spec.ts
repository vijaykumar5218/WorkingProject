import {AccountSummaryComponent} from './account-summary.component';
import {Component, Input} from '@angular/core';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {
  Account,
  AccountsData,
} from '@shared-lib/services/account/models/accountres.model';

@Component({selector: 'app-account-list', template: ''})
class MockAppAccountList {
  @Input() accounts: AccountsData;
}

describe('AccountSummaryComponent', () => {
  let component: AccountSummaryComponent;
  let fixture: ComponentFixture<AccountSummaryComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AccountSummaryComponent, MockAppAccountList],
        imports: [],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('sendAccountInfo', () => {
    it('should emit when the account is clicked', () => {
      spyOn(component.clickedAccountInfo, 'emit');
      const account: Account = {
        accountTitle: '',
        accountBalance: '',
        accountBalanceAsOf: '',
        sourceSystem: '',
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
      component.sendAccountInfo(account);
      expect(component.clickedAccountInfo.emit).toHaveBeenCalled();
    });
  });
});
