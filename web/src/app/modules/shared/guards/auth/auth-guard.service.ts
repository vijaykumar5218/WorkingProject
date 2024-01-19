import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {WebLogoutService} from '../../services/logout/logout.service';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private logoutService: WebLogoutService) {}

  canActivate(): Observable<boolean> {
    return this.logoutService.getTerminatedUser().pipe(
      map(res => {
        return res ? false : true;
      })
    );
  }
}
