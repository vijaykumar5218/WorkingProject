import {Component, Input} from '@angular/core';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {
  BenefitEnrollment,
  BenefitsHomeBannerContent,
  BenefitsHomeContent,
} from '@shared-lib/services/benefits/models/benefits.model';
@Component({
  selector: 'app-benefits-banner',
  templateUrl: './benefits-banner.component.html',
  styleUrls: ['./benefits-banner.component.scss'],
})
export class BenefitsBannerComponent {
  enrollmentBannerContent: BenefitsHomeContent;
  @Input() benefitsEnrollment: BenefitEnrollment;
  contextObj: BenefitsHomeBannerContent;

  constructor(private benefitsService: BenefitsService) {}

  async ngOnInit() {
    this.enrollmentBannerContent = await this.benefitsService.getBenefitsSelectionHomeContent();
    this.contextObj = this.benefitsService.getBannerContentObj(
      this.benefitsEnrollment,
      this.enrollmentBannerContent
    );
  }

  openGuidelines() {
    this.benefitsService.openGuidelines(true, this.benefitsEnrollment.status);
  }
}
