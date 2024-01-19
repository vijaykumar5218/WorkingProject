import {Component, Input} from '@angular/core';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import * as pageText from './constants/noBenefit.json';
import {
  NoBenefit,
  NoBenefitContent,
  WorkplaceCovergeNoBenefits,
} from '@shared-lib/services/benefits/models/noBenefit.model';

@Component({
  selector: 'app-no-benefits',
  templateUrl: './no-benefits.component.html',
  styleUrls: ['./no-benefits.component.scss'],
})
export class NoBenefitsComponent {
  nobenfitdata: NoBenefitContent;
  @Input() workplaceDashboard?: boolean;
  workplaceDashboardBenefitData: WorkplaceCovergeNoBenefits;
  content: NoBenefit = (pageText as any).default;

  constructor(private benefitsService: BenefitsService) {}

  ngOnInit() {
    this.fetchNoBenefit();
  }

  async fetchNoBenefit() {
    this.benefitsService
      .getNoBenefitContents()
      .then((data: NoBenefitContent) => {
        this.nobenfitdata = data;
        if (this.workplaceDashboard) {
          this.workplaceDashboardBenefitData = JSON.parse(
            data.workplaceCovergeNoBenefits
          );
        }
      });
  }
}
