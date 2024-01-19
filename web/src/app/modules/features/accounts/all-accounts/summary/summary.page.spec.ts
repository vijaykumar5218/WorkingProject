import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {of, Subscription} from 'rxjs';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {SummaryPage} from './summary.page';
import {RouterTestingModule} from '@angular/router/testing';
import {SpendingWidgetComponent} from '@shared-lib/modules/accounts/components/spending-widget/spending-widget.component';
import {BudgetWidgetComponent} from '@shared-lib/modules/accounts/components/budget-widget/budget-widget.component';
import {PlatformService} from '@shared-lib/services/platform/platform.service';
import {NetWorthComponent} from '@shared-lib/components/net-worth/net-worth.component';

describe('SummaryPage', () => {
  let component: SummaryPage;
  let fixture: ComponentFixture<SummaryPage>;
  let mxServiceSpy;
  let platformServiceSpy;

  beforeEach(
    waitForAsync(() => {
      mxServiceSpy = jasmine.createSpyObj('mxServiceSpy', [
        'getIsMxUserByMyvoyageAccess',
        'displayWidget',
        'getHeaderData',
        'checkIsAltAccessUser',
      ]);
      mxServiceSpy.getIsMxUserByMyvoyageAccess.and.returnValue(of(true));
      platformServiceSpy = jasmine.createSpyObj('platformServiceSpy', [
        'isDesktop',
      ]);
      platformServiceSpy.isDesktop.and.returnValue({
        subscribe: () => undefined,
      });
      mxServiceSpy.checkIsAltAccessUser.and.returnValue({
        subscribe: () => undefined,
      });
      TestBed.configureTestingModule({
        declarations: [SummaryPage],
        providers: [
          {provide: MXService, useValue: mxServiceSpy},
          {provide: PlatformService, useValue: platformServiceSpy},
        ],
        imports: [RouterTestingModule],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'fetchScreenContent');
    });
    describe('isViewInit would be true', () => {
      beforeEach(() => {
        component.isViewInit = true;
      });
      it('should call fetchScreenContent', () => {
        platformServiceSpy.isDesktop.and.returnValue(of(false));
        component.ngOnInit();
        expect(component.fetchScreenContent).toHaveBeenCalled();
        expect(platformServiceSpy.isDesktop).toHaveBeenCalled();
        expect(component.isDesktop).toEqual(false);
      });
      it('should not call fetchScreenContent', () => {
        platformServiceSpy.isDesktop.and.returnValue(of(true));
        component.ngOnInit();
        expect(component.fetchScreenContent).not.toHaveBeenCalled();
        expect(component.isDesktop).toEqual(true);
      });
    });
    describe('isViewInit would be false', () => {
      beforeEach(() => {
        component.isViewInit = false;
        platformServiceSpy.isDesktop.and.returnValue(of(true));
      });
      it('should not call fetchScreenContent', () => {
        component.ngOnInit();
        expect(component.fetchScreenContent).not.toHaveBeenCalled();
      });
    });
      it('should call checkIsAltAccessUser and set AltAccessUser to true', () => {
        mxServiceSpy.checkIsAltAccessUser.and.returnValue(of(true));
        component.ngOnInit();
        expect(mxServiceSpy.checkIsAltAccessUser).toHaveBeenCalled();
        expect(component.isAltAccessUser).toBeTrue();
      });
      it('should call checkIsAltAccessUser and set AltAccessUser to false', () => {
        mxServiceSpy.checkIsAltAccessUser.and.returnValue(of(false));
        component.ngOnInit();
        expect(mxServiceSpy.checkIsAltAccessUser).toHaveBeenCalled();
        expect(component.isAltAccessUser).toBeFalse();
      });
  });

  describe('ionViewWillEnter', () => {
    let spendSpy;
    let budgetSpy;
    let netWorthSpy;
    beforeEach(() => {
      spyOn(component.subscription, 'add');
      spyOn(component, 'fetchScreenContent');
      spendSpy = jasmine.createSpyObj('SpendWidget', ['refreshWidget']);
      budgetSpy = jasmine.createSpyObj('BudgetWidget', ['refreshWidget']);
      netWorthSpy = jasmine.createSpyObj('NetWorthWidget', ['refreshWidget']);
      component.spendingWidget = {
        widget: spendSpy,
      } as SpendingWidgetComponent;
      component.budgethWidget = {
        widget: budgetSpy,
      } as BudgetWidgetComponent;
      component.netWorthWidget = {
        widget: netWorthSpy,
      } as NetWorthComponent;
      component.hasMXUser = false;
    });
    it('When isMxUser and isDesktop both would be true and deviceWidth would be 920', () => {
      const observable = of(true);
      const subscriptionMock = new Subscription();
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(true);
        return subscriptionMock;
      });
      mxServiceSpy.getIsMxUserByMyvoyageAccess.and.returnValue(observable);
      component.isDesktop = true;
      component.deviceWidth = 920;
      component.ionViewWillEnter();
      expect(mxServiceSpy.getIsMxUserByMyvoyageAccess).toHaveBeenCalled();
      expect(component.hasMXUser).toEqual(true);
      expect(mxServiceSpy.displayWidget).toHaveBeenCalledWith(
        WidgetType.NET_WORTH,
        {
          id: 'mx-net-worth',
          height: '480px',
          autoload: false,
        }
      );
      expect(spendSpy.refreshWidget).toHaveBeenCalled();
      expect(budgetSpy.refreshWidget).toHaveBeenCalled();
      expect(netWorthSpy.refreshWidget).not.toHaveBeenCalled();
      expect(component.subscription.add).toHaveBeenCalledWith(subscriptionMock);
      expect(component.fetchScreenContent).toHaveBeenCalled();
    });
    it('When isMxUser would be false', () => {
      mxServiceSpy.getIsMxUserByMyvoyageAccess.and.returnValue(of(false));
      component.ionViewWillEnter();
      expect(component.hasMXUser).toEqual(false);
      expect(mxServiceSpy.displayWidget).not.toHaveBeenCalled();
    });
    it('When isDesktop would be false', () => {
      mxServiceSpy.getIsMxUserByMyvoyageAccess.and.returnValue(of(true));
      component.isDesktop = false;
      component.ionViewWillEnter();
      expect(spendSpy.refreshWidget).not.toHaveBeenCalled();
      expect(budgetSpy.refreshWidget).not.toHaveBeenCalled();
      expect(component.fetchScreenContent).not.toHaveBeenCalled();
    });
    it('when device width would be 480', () => {
      component.deviceWidth = 420;
      component.ionViewWillEnter();
      expect(netWorthSpy.refreshWidget).toHaveBeenCalled();
    });
  });

  describe('fetchScreenContent', () => {
    let mockData;
    let observable;
    let subscription;
    beforeEach(() => {
      mockData = [
        {
          spending_budget_description: [
            {
              bottom_text:
                'Let’s look at your current spending and this months budget.',
              image_url:
                'https://cdn2.webdamdb.com/220th_sm_wY2B7ECU3h41.jpg?1607047662',
              top_text: '',
            },
          ],
          spending_budget_title: '',
        },
      ];
      observable = of(mockData);
      subscription = new Subscription();
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockData);
        return subscription;
      });
      mxServiceSpy.getHeaderData.and.returnValue(observable);
      spyOn(component.subscription, 'add');
      component.getHeaderMessage = undefined;
    });

    it('should call getScreenMessage from MXService and return message', () => {
      component.fetchScreenContent();
      expect(mxServiceSpy.getHeaderData).toHaveBeenCalled();
      expect(component.getHeaderMessage).toEqual(mockData);
      expect(component.subscription.add).toHaveBeenCalledWith(subscription);
    });
  });

  it('ngAfterViewInit', () => {
    component.isViewInit = false;
    component.ngAfterViewInit();
    expect(component.isViewInit).toEqual(true);
  });

  it('ngOnDestroy', () => {
    spyOn(component.subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscription.unsubscribe).toHaveBeenCalled();
  });
});
