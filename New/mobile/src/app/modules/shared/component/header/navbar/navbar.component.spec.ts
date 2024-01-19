import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {NavbarComponent} from './navbar.component';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {of, Subscription} from 'rxjs';
import {NotificationService} from '@shared-lib/services/notification/notification.service';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let baseServiceSpy;
  let notificationServiceSpy;

  beforeEach(
    waitForAsync(() => {
      baseServiceSpy = jasmine.createSpyObj('BaseService', [
        'navigateByUrl',
        'navigateBack',
      ]);
      notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
        'getNotificationCount',
        'initializeNotificationCount',
        'clearCountInterval',
      ]);
      notificationServiceSpy.getNotificationCount.and.returnValue(
        of({newNotificationCount: 10})
      );
      TestBed.configureTestingModule({
        declarations: [NavbarComponent],
        providers: [
          {provide: BaseService, useValue: baseServiceSpy},
          {provide: NotificationService, useValue: notificationServiceSpy},
        ],
        imports: [RouterTestingModule],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    component.actionOption = {
      headername: 'headername',
      btnright: false,
      buttonRight: {
        name: '',
        link: 'notification',
      },
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should subscribe to getNotificationCount', () => {
      const notificationCount = {newNotificationCount: 6};
      const notificationCount$ = of(notificationCount);
      notificationServiceSpy.getNotificationCount.and.returnValue(
        notificationCount$
      );
      const subscription = new Subscription();
      spyOn(notificationCount$, 'subscribe').and.callFake(f => {
        f(notificationCount);
        return subscription;
      });
      spyOn(component['subscription'], 'add');
      component.notificationValue = undefined;
      component.ngOnInit();
      expect(notificationServiceSpy.getNotificationCount).toHaveBeenCalled();
      expect(component['subscription'].add).toHaveBeenCalledWith(subscription);
      expect(component.notificationValue).toEqual(notificationCount);
    });

    it('should call initializeNotificationCount', () => {
      component.ngOnInit();
      expect(
        notificationServiceSpy.initializeNotificationCount
      ).toHaveBeenCalled();
    });
  });

  describe('routeToPage', () => {
    beforeEach(() => {
      component['badge'] = jasmine.createSpyObj('Badge', ['clear']);
    });

    it('should clear badge count if clear is true', () => {
      component.routeToPage('navbar', true);
      expect(component['badge'].clear).toHaveBeenCalled();
    });

    it('should reset notification count if clear is true', () => {
      component.notificationValue = {newNotificationCount: 10};
      component.routeToPage('navbar', true);
      expect(component.notificationValue.newNotificationCount).toEqual(0);
    });

    it('should not clear badge count if clear is falsy', () => {
      component.routeToPage('navbar');
      expect(component['badge'].clear).not.toHaveBeenCalled();
    });

    it('should route to page', () => {
      component.routeToPage('navbar');
      expect(baseServiceSpy.navigateByUrl).toHaveBeenCalledWith('navbar');
    });
    it('should call navigate back', () => {
      component.routeToPage('back');
      expect(baseServiceSpy.navigateBack).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should call clearCountInterval', () => {
      component.ngOnDestroy();
      expect(notificationServiceSpy.clearCountInterval).toHaveBeenCalled();
    });

    it('should unsubscribe', () => {
      spyOn(component['subscription'], 'unsubscribe');
      component.ngOnDestroy();
      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });
});
