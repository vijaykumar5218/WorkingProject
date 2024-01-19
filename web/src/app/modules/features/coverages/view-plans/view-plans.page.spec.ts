import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {ViewPlansPage} from './view-plans.page';
import {RouterTestingModule} from '@angular/router/testing';
import {of, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {EventManagerService} from '@shared-lib/modules/event-manager/event-manager/event-manager.service';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {eventKeys} from '@shared-lib/constants/event-keys';

describe('ViewPlans', () => {
  let component: ViewPlansPage;
  let fixture: ComponentFixture<ViewPlansPage>;
  let routerSpy;
  let publisherSpy;
  let benefitsServiceSpy;
  let eventManagerServiceSpy;

  beforeEach(
    waitForAsync(() => {
      benefitsServiceSpy = jasmine.createSpyObj('BenefitsService', [
        'getBenefits',
        'getSelectedBenefit',
      ]);
      benefitsServiceSpy.getBenefits.and.returnValue(Promise.resolve());
      const benefit = {
        name: 'SelectedBenefit',
        coverage: 0,
        premium: 0,
        premiumFrequency: '',
        deductible: 0,
        type: '',
        id: '',
        deductibleObj: {
          coinsurance: 0,
          copay: 0,
          family: 0,
          individual: 0,
          single: 0,
        },
        coverage_levels: {
          subscriber: 0,
          spouse: 0,
          child: 0,
        },
        coverageType: '',
        first_name: '',
        benefit_type_title: '',
      };
      benefitsServiceSpy.getSelectedBenefit.and.returnValue(benefit);

      routerSpy = {
        events: {
          pipe: jasmine.createSpy().and.returnValue(
            of({
              id: 1,
              url: '/coverages/view-plans/1/details',
            })
          ),
        },
        navigateByUrl: jasmine.createSpy(),
      };
      eventManagerServiceSpy = jasmine.createSpyObj('EventManagerService', [
        'createPublisher',
      ]);

      publisherSpy = jasmine.createSpyObj('Publisher', ['publish']);
      eventManagerServiceSpy.createPublisher.and.returnValue(publisherSpy);

      TestBed.configureTestingModule({
        declarations: [ViewPlansPage],
        providers: [
          {provide: Router, useValue: routerSpy},
          {provide: EventManagerService, useValue: eventManagerServiceSpy},
          {provide: BenefitsService, useValue: benefitsServiceSpy},
        ],
        imports: [RouterTestingModule],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPlansPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'routerNavigation');
    });

    it('should set tabs', async () => {
      await component.ngOnInit();

      expect(component.tabs).toEqual([
        {
          label: 'Details',
          link: 'details',
        },
      ]);
    });

    it('Should call routerNavigation', async () => {
      await component.ngOnInit();
      expect(component.routerNavigation).toHaveBeenCalled();
    });
    it('Should call createPublisher', async () => {
      await component.ngOnInit();
      expect(eventManagerServiceSpy.createPublisher).toHaveBeenCalledWith(
        eventKeys.refreshCoveragePlansDetails
      );
    });
  });

  describe('routerNavigation', () => {
    let subscriptionMock;
    beforeEach(() => {
      spyOn(component.subscription, 'add');
      subscriptionMock = new Subscription();
      component.selectedTab = undefined;
    });
    it('When selectedTab would be details', () => {
      const mockData = {
        id: 1,
        url: '/coverages/view-plans/1',
      };
      const observable = of(mockData);
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockData);
        return subscriptionMock;
      });
      routerSpy.events.pipe.and.returnValue(observable);
      component.routerNavigation();
      expect(component.selectedTab).toEqual('details');
      expect(component.subscription.add).toHaveBeenCalledWith(subscriptionMock);
    });
    it('When selectedTab would be claim', () => {
      const mockData = {
        id: 1,
        url: '/coverages/view-plans/1/claim',
      };
      const observable = of(mockData);
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockData);
        return subscriptionMock;
      });
      routerSpy.events.pipe.and.returnValue(observable);
      component.routerNavigation();
      expect(component.selectedTab).toEqual('claim');
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      spyOn(component.subscription, 'unsubscribe');
      component.ngOnDestroy();
      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('ionViewWillEnter', () => {
    it(' should publish header', () => {
      component.lifecyclePublisher = jasmine.createSpyObj('LifeCylePublisher', [
        'publish',
      ]);
      benefitsServiceSpy.getSelectedBenefit.and.returnValue({
        name: 'SelectedBenefit',
      });
      component.ionViewWillEnter();
      expect(component.selectedBenefit.name).toEqual('SelectedBenefit');
      expect(component.lifecyclePublisher.publish).toHaveBeenCalledWith(
        undefined
      );
    });
  });
});
