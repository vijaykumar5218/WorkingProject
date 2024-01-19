import {Component} from '@angular/core';
import {WebLogoutService} from '@web/app/modules/shared/services/logout/logout.service';

@Component({
  selector: 'app-logout',
  template: '<p>Logout is happening!</p>',
})
export class LogoutPage {
  constructor(private logoutService: WebLogoutService) {}

  ngOnInit() {
    this.logoutService.action();
  }
}
