import {Component} from '@angular/core';
import {HeaderTypeService} from '../../shared/services/header-type/header-type.service';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationWebPage {
  constructor(private headerTypeService: HeaderTypeService) {}

  ngOnInit() {
    this.headerTypeService.publishSelectedTab(null);
  }
}
