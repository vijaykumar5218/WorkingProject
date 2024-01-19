import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {JourneyComponent} from './journey.component';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {RouterTestingModule} from '@angular/router/testing';
import {of, Subscription} from 'rxjs';

describe('WebJourneyComponent', () => {
  let component: JourneyComponent;
  let fixture: ComponentFixture<JourneyComponent>;
  let journeyServiceSpy;

  beforeEach(
    waitForAsync(() => {
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'fetchTabs',
        'getSelectedTab$',
      ]);
      journeyServiceSpy.getSelectedTab$.and.returnValue({
        subscribe: () => undefined,
      });
      TestBed.configureTestingModule({
        declarations: [JourneyComponent],
        providers: [{provide: JourneyService, useValue: journeyServiceSpy}],
        imports: [RouterTestingModule],
      }).compileComponents();
      fixture = TestBed.createComponent(JourneyComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit', () => {
    spyOn(component.subscription, 'add');
    component.selectedTab = undefined;
    const subscription = new Subscription();
    const observable = of('overview');
    spyOn(observable, 'subscribe').and.callFake(f => {
      f('overview');
      return subscription;
    });
    journeyServiceSpy.getSelectedTab$.and.returnValue(observable);
    component.tabs = undefined;
    const mockTabsData = [
      {label: 'Overview', link: 'overview?journeyType=all'},
      {label: 'Steps', link: 'steps?journeyType=all'},
      {label: 'Resources', link: 'resources?journeyType=all'},
    ];
    spyOn(SharedUtilityService.prototype, 'getQueryParam').and.returnValue(
      'journeyType=all'
    );
    journeyServiceSpy.fetchTabs.and.returnValue(mockTabsData);
    component.ngOnInit();
    expect(component.tabs).toEqual(mockTabsData);
    expect(journeyServiceSpy.fetchTabs).toHaveBeenCalledWith(
      ['overview', 'steps', 'resources'],
      '?journeyType=all'
    );
    expect(SharedUtilityService.prototype.getQueryParam).toHaveBeenCalled();
    expect(journeyServiceSpy.getSelectedTab$).toHaveBeenCalled();
    expect(component.selectedTab).toEqual('overview?journeyType=all');
    expect(component.subscription.add).toHaveBeenCalledWith(subscription);
  });

  it('ngOnDestroy', () => {
    spyOn(component.subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscription.unsubscribe).toHaveBeenCalled();
  });
});
