import {Component, Input} from '@angular/core';
import * as planText from '@shared-lib/components/coverages/plan-tabs/plan-details/constants/planText.json';
import {Plan} from '../model/plan.model';
import {Dependents} from '@shared-lib/services/benefits/models/benefits.model';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';

@Component({
  selector: 'app-dependents',
  templateUrl: './dependents.component.html',
  styleUrls: ['./dependents.component.scss'],
})
export class DependentsComponent {
  content: Plan = (planText as any).default;

  @Input() dependent: Dependents[];
  isWeb: boolean;

  constructor(private utilityService: SharedUtilityService) {}

  ngOnInit(): void {
    this.isWeb = this.utilityService.getIsWeb();
  }
}
