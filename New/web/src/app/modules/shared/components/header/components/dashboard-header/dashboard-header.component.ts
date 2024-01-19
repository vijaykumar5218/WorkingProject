import {Component, Input, OnInit} from '@angular/core';
import {HeaderTypeService} from '@web/app/modules/shared/services/header-type/header-type.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';

@Component({
  selector: 'workplace-dashboard-header',
  templateUrl: 'dashboard-header.component.html',
  styleUrls: ['dashboard-header.component.scss'],
})
export class DashboardHeaderComponent implements OnInit {
  loginBaseUrl: string;
  @Input() selectedTab: string;

  constructor(
    private sharedUtilityService: SharedUtilityService,
    private headerTypeService: HeaderTypeService
  ) {}

  async ngOnInit() {
    this.headerTypeService.qualtricsInitialize();
    const loginUrl = this.sharedUtilityService.getEnvironment().loginBaseUrl;
    this.loginBaseUrl = loginUrl.slice(0, loginUrl.length - 1);
  }
}
