import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {AllAccountsPage} from './all-accounts.page';
import {RouterTestingModule} from '@angular/router/testing';
import {of, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {AccessService} from '@shared-lib/services/access/access.service';
import {MXService} from '@shared-lib/services/mx-service/mx.service';

describe('AllAccountsPage', () => {
  let component: AllAccountsPage;
  let fixture: ComponentFixture<AllAccountsPage>;
  let routerSpy;
  let accessServiceSpy;
  const mockMyvoyageAccessData: any = {
    isMxUser: true,
    enableCoverages: true,
    isHealthOnly: true,
  };
  let mxServiceSpy;

  beforeEach(
    waitForAsync(() => {
      mxServiceSpy = jasmine.createSpyObj('mxServiceSpy', [
        'getIsMxUserByMyvoyageAccess',
      ]);
      mxServiceSpy.getIsMxUserByMyvoyageAccess.and.returnValue(of(true));
      routerSpy = {
        events: {
          pipe: jasmine.createSpy().and.returnValue(
            of({
              id: 1,
              url: '/accounts/all-account/summary',
            })
          ),
        },
        navigateByUrl: jasmine.createSpy(),
      };
      accessServiceSpy = jasmine.createSpyObj('accessServiceSpy', [
        'checkMyvoyageAccess',
      ]);
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve(mockMyvoyageAccessData)
      );
      TestBed.configureTestingModule({
        declarations: [AllAccountsPage],
        providers: [
          {provide: Router, useValue: routerSpy},
          {provide: AccessService, useValue: accessServiceSpy},
          {provide: MXService, useValue: mxServiceSpy},
        ],
        imports: [RouterTestingModule],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AllAccountsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'routerNavigation');
      component.isMxUser = false;
      spyOn(component.subscription, 'add');
    });

    it('Should call routerNavigation', () => {
      component.ngOnInit();
      expect(component.routerNavigation).toHaveBeenCalled();
    });

    it('should call checkMyvoyageAccess & set the value of enableCoverages true and isHealthOnly', async () => {
      await component.ngOnInit();
      expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      expect(component.enableCoverages).toEqual(true);
      expect(component.healthOnly).toEqual(true);
    });

    it('should call getIsMxUserByMyvoyageAccess & set the value of isMxUser', () => {
      const observable = of(true);
      const subscription = new Subscription();
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(true);
        return subscription;
      });
      mxServiceSpy.getIsMxUserByMyvoyageAccess.and.returnValue(observable);
      component.ngOnInit();
      expect(mxServiceSpy.getIsMxUserByMyvoyageAccess).toHaveBeenCalled();
      expect(component.isMxUser).toEqual(true);
      expect(component.subscription.add).toHaveBeenCalledWith(subscription);
      expect(component.tabs).toEqual([
        {
          label: 'Summary',
          link: 'summary',
        },
        {
          label: 'Insights',
          link: 'insights',
        },
        {
          label: 'Transactions',
          link: 'transactions',
        },
      ]);
    });

    it('should remove some tabs if isMxUser is false', () => {
      mxServiceSpy.getIsMxUserByMyvoyageAccess.and.returnValue(of(false));

      component.ngOnInit();

      expect(component.tabs).toEqual([
        {
          label: 'Summary',
          link: 'summary',
        },
      ]);
    });
  });

  describe('routerNavigation', () => {
    let subscriptionMock;
    beforeEach(() => {
      spyOn(component.subscription, 'add');
      subscriptionMock = new Subscription();
      component.selectedTab = undefined;
    });
    it('When selectedTab would be summary', () => {
      const mockData = {
        id: 1,
        url: '/accounts/all-account/',
      };
      const observable = of(mockData);
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockData);
        return subscriptionMock;
      });
      routerSpy.events.pipe.and.returnValue(observable);
      component.routerNavigation();
      expect(component.selectedTab).toEqual('summary');
      expect(component.subscription.add).toHaveBeenCalledWith(subscriptionMock);
    });
    it('When selectedTab would be insights', () => {
      const mockData = {
        id: 1,
        url: '/accounts/all-account/insights',
      };
      const observable = of(mockData);
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockData);
        return subscriptionMock;
      });
      routerSpy.events.pipe.and.returnValue(observable);
      component.routerNavigation();
      expect(component.selectedTab).toEqual('insights');
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
