import {AuthGuard} from './auth-guard.service';
import {TestBed, waitForAsync} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {WebLogoutService} from '../../services/logout/logout.service';
import {of} from 'rxjs';

describe('AuthGuard', () => {
  let service: AuthGuard;
  let logoutServiceSpy;

  beforeEach(
    waitForAsync(() => {
      logoutServiceSpy = jasmine.createSpyObj('logoutServiceSpy', [
        'getTerminatedUser',
      ]);

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          AuthGuard,
          {provide: WebLogoutService, useValue: logoutServiceSpy},
        ],
      });
      service = TestBed.inject(AuthGuard);
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('canActivate', () => {
    it('when it return true', done => {
      logoutServiceSpy.getTerminatedUser.and.returnValue(of(false));
      service.canActivate().subscribe(data => {
        expect(data).toEqual(true);
        done();
      });
    });
    it('when it return false', done => {
      logoutServiceSpy.getTerminatedUser.and.returnValue(of(true));
      service.canActivate().subscribe(data => {
        expect(data).toEqual(false);
        done();
      });
    });
  });
});
