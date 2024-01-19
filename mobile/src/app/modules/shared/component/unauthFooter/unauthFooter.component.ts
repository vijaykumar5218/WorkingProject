import {Component, Input, OnInit} from '@angular/core';
import * as build from '../../../../../../src/build';
import {UtilityService} from '../../service/utility/utility.service';

@Component({
  selector: 'app-unauth-footer',
  templateUrl: './unauthFooter.component.html',
  styleUrls: ['./unauthFooter.component.scss'],
})
export class UnauthFooterComponent implements OnInit {
  @Input() largeFont = false;
  buildVersion: string;
  buildTimestamp: string;
  workEnv: string;
  constructor(private utility: UtilityService) {}

  ngOnInit() {
    const dateString = this.utility.formatStringDate(build.default.timestamp);
    const wrkEnv = this.utility.getWorkEnvironment();
    this.buildVersion = build.default.version;

    //** For Prod version: No need of Workenv Text and Timestamp **
    if (wrkEnv == 'Prod') {
      this.buildTimestamp = '';
      this.workEnv = '';
    } else {
      this.buildTimestamp = dateString;
      this.workEnv = wrkEnv;
    }
  }
}
