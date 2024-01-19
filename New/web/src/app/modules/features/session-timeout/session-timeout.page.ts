import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {WebLogoutService} from '@web/app/modules/shared/services/logout/logout.service';
import * as landingText from './constants/content.json';
@Component({
  selector: 'app-session-timeout',
  templateUrl: 'session-timeout.page.html',
  styleUrls: ['session-timeout.page.scss'],
})
export class SessionTimeoutPage {
  pageText: Record<string, string> = landingText;
  timerAmount = 7000;

  constructor(
    private logoutService: WebLogoutService,
    private router: Router
  ) {}

  ngOnInit() {
    this.logoutService.setTerminatedUser(true);
    setTimeout(() => {
      this.router.navigateByUrl('/logout');
    }, this.timerAmount);
  }

  signOutClicked() {
    this.logoutService.action();
  }
}
