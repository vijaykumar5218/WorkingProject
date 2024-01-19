import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {NotificationItemComponent} from './notification-item.component';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {Router} from '@angular/router';
import {EventTrackingService} from '@shared-lib/services/event-tracker/event-tracking.service';
import {HighPriority} from '@shared-lib/services/notification/models/notification.model';
import {EventTrackingEvent} from '@shared-lib/services/event-tracker/models/event-tracking.model';

describe('NotificationItemComponent', () => {
  let component: NotificationItemComponent;
  let fixture: ComponentFixture<NotificationItemComponent>;
  let sharedUtilityServiceSpy;
  let routerSpy;
  let eventTrackingServiceSpy;

  beforeEach(
    waitForAsync(() => {
      routerSpy = jasmine.createSpyObj('Router', {
        navigateByUrl: jasmine.createSpy('navigate'),
      });
      sharedUtilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'getIsWeb',
      ]);
      eventTrackingServiceSpy = jasmine.createSpyObj('EventTrackingService', [
        'eventTracking',
      ]);
      TestBed.configureTestingModule({
        declarations: [NotificationItemComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: SharedUtilityService, useValue: sharedUtilityServiceSpy},
          {provide: Router, useValue: routerSpy},
          {provide: EventTrackingService, useValue: eventTrackingServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(NotificationItemComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('handleNotificationUrlClick', () => {
    let mockNotification: HighPriority;
    let eventTrackingEvent: EventTrackingEvent;
    beforeEach(() => {
      mockNotification = {
        Category_name: '',
        Description: '',
        Link_name: '',
        Link_url: '/accounts/insights',
        Title: '',
        eventName: 'MXInsight',
        eventStartDt: '',
        eventAge: '',
        new: false,
      };
      eventTrackingEvent = {
        eventName: 'CTAClick',
        passThruAttributes: [],
      };
    });
    it('should track the event', () => {
      eventTrackingEvent.passThruAttributes = [
        {
          attributeName: 'subType',
          attributeValue: mockNotification.eventName,
        },
        {
          attributeName: 'redirect_route',
          attributeValue: mockNotification.Link_url,
        },
      ];
      component.handleNotificationUrlClick(mockNotification);
      expect(eventTrackingServiceSpy.eventTracking).toHaveBeenCalledWith(
        eventTrackingEvent
      );
    });
    it('should navigate to url', () => {
      component.handleNotificationUrlClick(mockNotification);
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        mockNotification.Link_url
      );
    });
  });
});
