import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {
  BenefitsSummaryContent,
  DeductibleObj,
  Dependents,
} from '@shared-lib/services/benefits/models/benefits.model';
import {CoverageExplanationsOOPDeductible} from '@shared-lib/services/benefits/models/message.model';
import * as planText from '@shared-lib/components/coverages/plan-tabs/plan-details/constants/planText.json';
import {Plan} from './model/plan.model';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {EventManagerService} from '@shared-lib/modules/event-manager/event-manager/event-manager.service';
import {Subscription} from 'rxjs';
import {eventKeys} from '@shared-lib/constants/event-keys';
import {delay} from 'rxjs/operators';
import {Benefit} from '../../../../services/benefits/models/benefits.model';
@Component({
  selector: 'app-plan-details',
  templateUrl: './plan-details.component.html',
  styleUrls: ['./plan-details.component.scss'],
})
export class PlanDetailsComponent implements OnInit {
  content: Plan = (planText as any).default;
  benefitContent: BenefitsSummaryContent;
  selectedBenefit: Benefit;
  subscription = new Subscription();
  isWeb: boolean;
  @ViewChild('topmostElement', {read: ElementRef}) topmostElement: ElementRef;
  deductible: DeductibleObj;

  constructor(
    private benefitsService: BenefitsService,
    private utilityService: SharedUtilityService,
    private eventManagerService: EventManagerService
  ) {}

  dependentsData: Dependents[];
  covExplanation: CoverageExplanationsOOPDeductible;

  ngOnInit(): void {
    this.isWeb = this.utilityService.getIsWeb();
    if (!this.utilityService.getIsWeb()) {
      this.fetchData();
    }
  }

  fetchData() {
    this.subscription.add(
      this.benefitsService.getSelectedBenefitObservable().subscribe(benefit => {
        this.selectedBenefit = benefit;
        this.dependentsData = this.selectedBenefit.planDetails.dependents;
        this.getBenefitContent();
        this.fetchCovExp();
      })
    );
  }

  async getBenefitContent(): Promise<void> {
    return this.benefitsService
      .getBenefitContent()
      .then((res: BenefitsSummaryContent) => {
        this.benefitContent = res;
      });
  }

  async fetchCovExp() {
    this.benefitsService
      .getCovExp()
      .then((data: CoverageExplanationsOOPDeductible) => {
        this.covExplanation = data;
      });
  }

  ionViewDidEnter() {
    if (this.utilityService.getIsWeb()) {
      this.eventManagerService
        .createSubscriber(eventKeys.refreshCoveragePlansDetails)
        .pipe(delay(100))
        .subscribe(() => {
          this.fetchData();
          this.utilityService.scrollToTop(this.topmostElement);
        });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
