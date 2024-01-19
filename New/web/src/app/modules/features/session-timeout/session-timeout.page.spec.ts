import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {SessionTimeoutPage} from './session-timeout.page';
import {RouterTestingModule} from '@angular/router/testing';
import {WebLogoutService} from '@web/app/modules/shared/services/logout/logout.service';
import {Router} from '@angular/router';

describe('SessionTimeoutPage', () => {
  let component: SessionTimeoutPage;
  let fixture: ComponentFixture<SessionTimeoutPage>;
  let logoutServiceSpy;
  let routerSpy;

  beforeEach(
    waitForAsync(() => {
      logoutServiceSpy = jasmine.createSpyObj('logoutServiceSpy ', [
        'setTerminatedUser',
        'action',
      ]);
      routerSpy = jasmine.createSpyObj('routerSpy', ['navigateByUrl']);

      TestBed.configureTestingModule({
        declarations: [SessionTimeoutPage],
        imports: [RouterTestingModule],
        providers: [
          {provide: WebLogoutService, useValue: logoutServiceSpy},
          {provide: Router, useValue: routerSpy},
        ],
      }).compileComponents();
      fixture = TestBed.createComponent(SessionTimeoutPage);
      component = fixture.componentInstance;
      component.timerAmount = 25;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call logoutService.setTerminatedUser', () => {
      component.ngOnInit();
      expect(logoutServiceSpy.setTerminatedUser).toHaveBeenCalledWith(true);
    });
    it('should router navigate to logout page', fakeAsync(() => {
      component.ngOnInit();
      tick(25);
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/logout');
    }));
  });

  describe('signOutClicked', () => {
    it('should call logoutServiceSpy.action', () => {
      component.signOutClicked();
      expect(logoutServiceSpy.action).toHaveBeenCalled();
    });
  });
});
