import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';

@Component({
  selector: 'app-add-account-nudge',
  templateUrl: './add-account-nudge.component.html',
  styleUrls: ['./add-account-nudge.component.scss'],
})
export class AddAccountNudgeComponent {
  @Input() cardMargin = '';
  isWeb = false;
  show = true;

  constructor(
    private router: Router,
    private utilityService: SharedUtilityService
  ) {
    this.isWeb = this.utilityService.getIsWeb();
  }

  addAccountClicked() {
    if (this.isWeb) {
      this.router.navigateByUrl('accounts/add-accounts');
    } else {
      this.router.navigateByUrl('account/add-accounts');
    }
  }
}
