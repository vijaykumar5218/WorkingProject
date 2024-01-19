import {Component, ElementRef, ViewChild} from '@angular/core';
import {
  Benefits,
  BenefitsSummaryContent,
} from '@shared-lib/services/benefits/models/benefits.model';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';

@Component({
  selector: 'app-benefit-elections',
  templateUrl: './benefit-elections.page.html',
  styleUrls: ['./benefit-elections.page.scss'],
})
export class BenefitElectionsPage {
  benefitsContent: BenefitsSummaryContent;
  benefits: Benefits;
  @ViewChild('topmostElement', {read: ElementRef}) topmostElement: ElementRef;

  constructor(
    private benefitService: BenefitsService,
    private sharedUtilityService: SharedUtilityService
  ) {}

  async ionViewWillEnter() {
    this.benefits = await this.benefitService.getNextYearBenefits();
    this.benefitsContent = await this.benefitService.getBenefitContent();
    this.sharedUtilityService.scrollToTop(this.topmostElement);
  }
}
