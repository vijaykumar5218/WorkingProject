import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {AccountsComponent} from './accounts.component';
import {AccountService} from '@shared-lib/services/account/account.service';
import {BalanceHistoryGraph} from '@shared-lib/services/account/models/balance-history-graph.model';
import {of, Subscription} from 'rxjs';
import {AccessService} from '@shared-lib/services/access/access.service';

describe('AccountsComponent', () => {
  let component: AccountsComponent;
  let fixture: ComponentFixture<AccountsComponent>;
  let accountServiceSpy;
  let accessServiceSpy;
  const balanceHistoryGraph: BalanceHistoryGraph = {
    years: ['2018', '2019', '2020', '2021', 'Current'],
  };

  beforeEach(
    waitForAsync(() => {
      accountServiceSpy = jasmine.createSpyObj('AccountService', [
        'fetchBalanceHistoryGraph',
      ]);
      accessServiceSpy = jasmine.createSpyObj('AccessService', [
        'checkMyvoyageAccess',
      ]);

      TestBed.configureTestingModule({
        declarations: [AccountsComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: AccountService, useValue: accountServiceSpy},
          {provide: AccessService, useValue: accessServiceSpy},
        ],
      }).compileComponents();

      accountServiceSpy.fetchBalanceHistoryGraph.and.returnValue({
        subscribe: () => undefined,
      });
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({isHealthOnly: true, enableMX: true})
      );

      fixture = TestBed.createComponent(AccountsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  describe('ngOnInit', () => {
    let subscription;
    let observable;
    beforeEach(() => {
      spyOn(component.subscription, 'add');
      observable = of(balanceHistoryGraph);
      subscription = new Subscription();
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(balanceHistoryGraph);
        return subscription;
      });
      component.balanceHistoryGraphData = undefined;
    });
    it('should call checkMyvoyageAccess and set Properties', () => {
      expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      expect(component.isHealthOnly).toBeTrue();
      expect(component.enableMX).toBeTrue();
    });
    it('when balanceHistoryGraphData will be defined', () => {
      accountServiceSpy.fetchBalanceHistoryGraph.and.returnValue(observable);
      component.ngOnInit();
      expect(accountServiceSpy.fetchBalanceHistoryGraph).toHaveBeenCalled();
      expect(component.balanceHistoryGraphData).toEqual(balanceHistoryGraph);
      expect(component.subscription.add).toHaveBeenCalledWith(subscription);
    });
    it('when balanceHistoryGraphData will not be defined', () => {
      accountServiceSpy.fetchBalanceHistoryGraph.and.returnValue(of(null));
      component.ngOnInit();
      expect(component.balanceHistoryGraphData).toEqual(undefined);
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      spyOn(component.subscription, 'unsubscribe');
      component.ngOnDestroy();
      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });
});
