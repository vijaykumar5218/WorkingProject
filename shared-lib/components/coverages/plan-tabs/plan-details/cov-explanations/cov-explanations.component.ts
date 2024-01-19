import {Component, Input} from '@angular/core';
import {CoverageExplanationsOOPDeductible} from '@shared-lib/services/benefits/models/message.model';
import * as planText from '@shared-lib/components/coverages/plan-tabs/plan-details/constants/planText.json';
import {Plan} from '../model/plan.model';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
@Component({
  selector: 'app-cov-explanations',
  templateUrl: './cov-explanations.component.html',
  styleUrls: ['./cov-explanations.component.scss'],
})
export class CovExplanationsComponent {
  content: Plan = (planText as any).default;
  isWeb: boolean;

  @Input() covExp: CoverageExplanationsOOPDeductible;
  @Input() cType: string;

  constructor(private utilityService: SharedUtilityService) {}

  ngOnInit(): void {
    this.isWeb = this.utilityService.getIsWeb();
  }
}
