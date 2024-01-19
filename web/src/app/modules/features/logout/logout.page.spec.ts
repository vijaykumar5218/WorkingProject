import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {LogoutPage} from './logout.page';
import {RouterTestingModule} from '@angular/router/testing';
import {WebLogoutService} from '@web/app/modules/shared/services/logout/logout.service';

describe('LogoutPage', () => {
  let component: LogoutPage;
  let fixture: ComponentFixture<LogoutPage>;
  let logoutServiceSpy;

  beforeEach(
    waitForAsync(() => {
      logoutServiceSpy = jasmine.createSpyObj('logoutServiceSpy ', ['action']);
      TestBed.configureTestingModule({
        declarations: [LogoutPage],
        imports: [RouterTestingModule],
        providers: [{provide: WebLogoutService, useValue: logoutServiceSpy}],
      }).compileComponents();
      fixture = TestBed.createComponent(LogoutPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call logoutService.action', () => {
      component.ngOnInit();
      expect(logoutServiceSpy.action).toHaveBeenCalled();
    });
  });
});
