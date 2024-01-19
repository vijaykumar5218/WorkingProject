import {Component} from '@angular/core';
import {HeaderTypeService} from '../../shared/services/header-type/header-type.service';

@Component({
  selector: 'workplace-dashboard',
  templateUrl: 'workplace-dashboard.page.html',
})
export class WorkplaceDashboardPage {
  constructor(private headerTypeService: HeaderTypeService) {}
  ionViewWillEnter() {
    this.headerTypeService.publishSelectedTab('HOME');
  }
}
