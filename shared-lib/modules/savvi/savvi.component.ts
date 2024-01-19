import {Component} from '@angular/core';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';

@Component({
  selector: 'app-savvi',
  templateUrl: './savvi.component.html',
  styleUrls: [],
})
export class SavviComponent {
  constructor(private utilityService: SharedUtilityService) {}

  ionViewWillEnter() {
    this.utilityService.setSuppressHeaderFooter(true);
  }

  ionViewWillLeave() {
    this.utilityService.setSuppressHeaderFooter(false);
  }
}
