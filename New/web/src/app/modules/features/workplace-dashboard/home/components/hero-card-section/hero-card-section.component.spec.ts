import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {HeroCardSectionComponent} from './hero-card-section.component';
import {RouterTestingModule} from '@angular/router/testing';
import {AccountService} from '@shared-lib/services/account/account.service';
import {of, Subscription} from 'rxjs';
import {MXService} from '@shared-lib/services/mx-service/mx.service';

describe('HeroCardSectionComponent', () => {
  let component: HeroCardSectionComponent;
  let fixture: ComponentFixture<HeroCardSectionComponent>;
  let accountServiceSpy;
  let mxServiceSpy;
  let subscriptionSpy;
  let fetchAggregatedAccountsSpy;
  let fetchMXUSerSpy;

  beforeEach(
    waitForAsync(() => {
      subscriptionSpy = jasmine.createSpyObj('subscriptionSpy', [
        'unsubscribe',
        'add',
      ]);
      accountServiceSpy = jasmine.createSpyObj('accountServiceSpy', [
        'getAggregatedAccounts',
      ]);
      accountServiceSpy.getAggregatedAccounts.and.returnValue({
        subscribe: () => undefined,
      });
      mxServiceSpy = jasmine.createSpyObj('mxServiceSpy', [
        'getIsMxUserByMyvoyageAccess',
      ]);
      mxServiceSpy.getIsMxUserByMyvoyageAccess.and.returnValue({
        subscribe: () => undefined,
      });
      TestBed.configureTestingModule({
        declarations: [HeroCardSectionComponent],
        imports: [RouterTestingModule],
        providers: [
          {provide: AccountService, useValue: accountServiceSpy},
          {provide: MXService, useValue: mxServiceSpy},
        ],
      }).compileComponents();
      fixture = TestBed.createComponent(HeroCardSectionComponent);
      component = fixture.componentInstance;
      fetchAggregatedAccountsSpy = spyOn(component, 'fetchAggregatedAccounts');
      fetchMXUSerSpy = spyOn(component, 'fetchMXUSer');
      component['subscription'] = subscriptionSpy;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call fetchAggregatedAccounts', () => {
      component.ngOnInit();
      expect(component.fetchAggregatedAccounts).toHaveBeenCalled();
      expect(component.fetchMXUSer).toHaveBeenCalled();
    });
  });

  describe('fetchAggregatedAccounts', () => {
    let observable;
    let subscription;
    const mockAccount: any = {
      hasMXAccount: true,
    };
    beforeEach(() => {
      fetchAggregatedAccountsSpy.and.callThrough();
      observable = of(mockAccount);
      subscription = new Subscription();
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockAccount);
        return subscription;
      });

      component.showAddAccount = true;
    });

    it('should call getAggregatedAccounts and subscribe', () => {
      accountServiceSpy.getAggregatedAccounts.and.returnValue(observable);
      component.fetchAggregatedAccounts();
      expect(component['subscription'].add).toHaveBeenCalledWith(subscription);
      expect(accountServiceSpy.getAggregatedAccounts).toHaveBeenCalled();
      expect(component.showAddAccount).toEqual(false);
    });
  });

  describe('fetchMXUSer', () => {
    let observable;
    let subscription;
    const mockAccount: any = true;
    beforeEach(() => {
      fetchMXUSerSpy.and.callThrough();
      observable = of(mockAccount);
      subscription = new Subscription();
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockAccount);
        return subscription;
      });

      component.isMXUser = false;
    });

    it('should call getIsMxUserByMyvoyageAccess and subscribe', () => {
      mxServiceSpy.getIsMxUserByMyvoyageAccess.and.returnValue(observable);
      component.fetchMXUSer();
      expect(component['subscription'].add).toHaveBeenCalledWith(subscription);
      expect(mxServiceSpy.getIsMxUserByMyvoyageAccess).toHaveBeenCalled();
      expect(component.isMXUser).toEqual(true);
    });
  });

  describe('displayCarousel', () => {
    it('should call displayCarousel and set isCarouselRequired', () => {
      component.isCarouselRequired = false;
      component.displayCarousel(true);
      expect(component.isCarouselRequired).toBeTrue();
    });
  });

  it('ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
  });
});
