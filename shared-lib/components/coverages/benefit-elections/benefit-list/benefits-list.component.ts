import {Component, Input} from '@angular/core';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {
  Benefit,
  BenefitsSummaryContent,
} from '@shared-lib/services/benefits/models/benefits.model';

@Component({
  selector: 'app-summary-benefits-list',
  templateUrl: './benefits-list.component.html',
  styleUrls: ['./benefits-list.component.scss'],
})
export class BenefitsListComponent {
  @Input() header: string;
  @Input() benefitsList: Benefit[];
  @Input() displayPremiumAndCoverage: boolean;
  content: BenefitsSummaryContent;

  constructor(private benefitService: BenefitsService) {}

  ngOnInit() {
    this.getBenefitContent();
  }

  async getBenefitContent(): Promise<void> {
    return this.benefitService
      .getBenefitContent()
      .then((res: BenefitsSummaryContent) => {
        this.content = res;
      });
  }
}
