import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {SnapshotComponent} from './snapshot.component';
import {IonicModule} from '@ionic/angular';
import {Router, RouterModule} from '@angular/router';
import {of, Subscription} from 'rxjs';
import {ContentService} from '@web/app/modules/shared/services/content/content.service';

describe('SnapshotComponent', () => {
  let component: SnapshotComponent;
  let fixture: ComponentFixture<SnapshotComponent>;
  let subscriptionSpy;
  let fetchLeftSideContentSpy;
  let contentServiceSpy;
  let routerSpy;

  const mockLeftSlideData = {
    workplaceAccountSnapshotHeader: 'WorkplaceAccountSnapshotHeader',
  };
  const mockReturnedAccount = {
    accountTitle: '401K PLAN',
    accountBalance: '22929.89',
    accountBalanceAsOf: '12/16/2022',
    suppressTab: false,
    voyaSavings: '22929.89',
    includedInOrangeMoney: false,
    accountAllowedForMyVoya: false,
    clientId: 'INGWIN',
    planType: 'DC',
    accountNumber: '555223@INGWIN@858000226',
    needOMAutomaticUpdate: false,
    planName: '401K PLAN',
    mpStatus: '0',
    clientAllowed4myVoyaOrSSO: true,
    useMyvoyaHomepage: true,
    advisorNonMoneyTxnAllowed: true,
    advisorMoneyTxnAllowed: false,
    nqPenCalPlan: false,
    enrollmentAllowed: false,
    autoEnrollmentAllowed: false,
    vruPhoneNumber: '1-800-584-6001',
    rmdRecurringPaymentInd: 'N',
    navigateToRSPortfolio: true,
    planLink: 'http://www.voya.com',
    openDetailInNewWindow: false,
    nqPlan: false,
    eligibleForOrangeMoney: false,
    new: false,
    iraplan: false,
    xsellRestricted: false,
    isVoyaAccessPlan: false,
    isVendorPlan: false,
    isRestrictedRetirementPlan: false,
    isVDAApplication: false,
    planId: '555223',
  };

  beforeEach(
    waitForAsync(() => {
      subscriptionSpy = jasmine.createSpyObj('subscriptionSpy', [
        'unsubscribe',
        'add',
      ]);
      contentServiceSpy = jasmine.createSpyObj('contentServiceSpy', [
        'getLeftSideContent',
      ]);
      routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);
      contentServiceSpy.getLeftSideContent.and.returnValue({
        subscribe: () => undefined,
      });

      TestBed.configureTestingModule({
        declarations: [SnapshotComponent],
        providers: [
          {
            provide: ContentService,
            useValue: contentServiceSpy,
          },
          {provide: Router, useValue: routerSpy},
        ],
        imports: [IonicModule.forRoot(), RouterModule.forRoot([])],
      }).compileComponents();
      fixture = TestBed.createComponent(SnapshotComponent);
      component = fixture.componentInstance;
      fetchLeftSideContentSpy = spyOn(component, 'fetchLeftSideContent');
      component['subscription'] = subscriptionSpy;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call fetchLeftSideContent', async () => {
      component.ngOnInit();
      expect(fetchLeftSideContentSpy).toHaveBeenCalled();
    });
  });

  describe('goToPlanLink', () => {
    it('Should call info page if account is not null', () => {
      component.goToPlanLink({
        ...mockReturnedAccount,
      });
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        `accounts/account-details/555223/info`
      );
    });
    it('Should call summary page if account is null', () => {
      component.goToPlanLink();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        `/accounts/all-account/summary`
      );
    });
  });

  describe('fetchLeftSideContent', () => {
    let observable;
    let subscription;
    beforeEach(() => {
      fetchLeftSideContentSpy.and.callThrough();
      observable = of(mockLeftSlideData);
      subscription = new Subscription();
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockLeftSlideData);
        return subscription;
      });
    });
    it('Should call getLeftSideContent', () => {
      contentServiceSpy.getLeftSideContent.and.returnValue(observable);
      component.fetchLeftSideContent();
      expect(component['subscription'].add).toHaveBeenCalledWith(subscription);
      expect(component.snapshotHeader).toEqual(
        mockLeftSlideData.workplaceAccountSnapshotHeader
      );
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      component.ngOnDestroy();
      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });
});
