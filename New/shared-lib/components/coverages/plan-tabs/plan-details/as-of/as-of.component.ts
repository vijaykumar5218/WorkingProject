import {Component, Input, OnInit} from '@angular/core';
import * as planText from '@shared-lib/components/coverages/plan-tabs/plan-details/constants/planText.json';
import * as moment from 'moment';
import {Plan} from '../model/plan.model';
import {DeductibleObj} from '@shared-lib/services/benefits/models/benefits.model';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {Benefit} from '../../../../../services/benefits/models/benefits.model';
@Component({
  selector: 'app-as-of',
  templateUrl: './as-of.component.html',
  styleUrls: ['./as-of.component.scss'],
})
export class AsOfComponent implements OnInit {
  content: Plan = (planText as any).default;

  currentDate = moment(Date.now()).format('MMMM DD, YYYY');

  @Input() benefit: Benefit;
  @Input() coverageDeduct: DeductibleObj;
  isWeb: boolean;

  constructor(private utilityService: SharedUtilityService) {}

  ngOnInit() {
    this.isWeb = this.utilityService.getIsWeb();
  }
}
