import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';
import {AccountService} from '@shared-lib/services/account/account.service';
import {NudgePopupComponent} from '../nudge-popup/nudge-popup.component';

import {NudgeMessagingComponent} from './nudge-messaging.component';

describe('NudgeMessagingComponent', () => {
  let component: NudgeMessagingComponent;
  let fixture: ComponentFixture<NudgeMessagingComponent>;

  let fakeAccountData;

  const modalControllerSpy = jasmine.createSpyObj('ModalController', [
    'create',
  ]);
  let accountServiceSpy;

  beforeEach(
    waitForAsync(() => {
      accountServiceSpy = jasmine.createSpyObj('AccountService', [
        'getAccount',
        'getMultiClientBlockModal',
      ]);

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

      TestBed.configureTestingModule({
        declarations: [NudgeMessagingComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: AccountService, useValue: accountServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(NudgeMessagingComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getAccount from AccountService and set account property', () => {
      component.account = undefined;
      accountServiceSpy.getAccount.and.returnValue(fakeAccountData);
      component.ngOnInit();
      expect(component.account).toEqual(fakeAccountData);
    });
  });

  describe('openLearnMoreModal', () => {
    it('should open madlib Learn More modal', async () => {
      const modal = jasmine.createSpyObj('HTMLIonModalElement', ['present']);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modal));
      await component.openLearnMoreModal();
      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: NudgePopupComponent,
        cssClass: 'modal-not-fullscreen',
        componentProps: {
          url: component.employersMatch?.toolTipText,
          toolTipNote: component.employersMatch?.toolTipNotes,
          nudgeType: component.employersMatch?.nudgeType,
        },
      });
      expect(modal.present).toHaveBeenCalled();
    });
  });
});
