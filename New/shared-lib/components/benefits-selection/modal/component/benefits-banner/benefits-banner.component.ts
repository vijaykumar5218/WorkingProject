import {Component} from '@angular/core';
import {
  BenefitEnrollment,
  BenefitsHomeBannerContent,
  BenefitsHomeContent,
} from '@shared-lib/services/benefits/models/benefits.model';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-benefits-banner',
  templateUrl: './benefits-banner.component.html',
  styleUrls: ['./benefits-banner.component.scss'],
})
export class BenefitsBannerComponent {
  enrollmentBannerContent: BenefitsHomeContent;
  isWeb: boolean;
  benefitsEnrollment: BenefitEnrollment;
  private subscription: Subscription = new Subscription();
  displayBanner = true;
  contextObj: BenefitsHomeBannerContent;

  constructor(
    private benefitsService: BenefitsService,
    private sharedUtilityService: SharedUtilityService
  ) {}

  async ngOnInit() {
    this.isWeb = this.sharedUtilityService.getIsWeb();
    this.subscription.add(
      (await this.benefitsService.getBenefitsEnrollment()).subscribe(data => {
        this.benefitsEnrollment = data;
      })
    );
    this.enrollmentBannerContent = await this.benefitsService.getBenefitsSelectionHomeContent();
    this.contextObj = this.benefitsService.getBannerContentObj(
      this.benefitsEnrollment,
      this.enrollmentBannerContent
    );
  }

  openGuidelines() {
    this.benefitsService.openGuidelines(true, this.benefitsEnrollment.status);
  }

  closeBenefitsBanner() {
    this.displayBanner = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
