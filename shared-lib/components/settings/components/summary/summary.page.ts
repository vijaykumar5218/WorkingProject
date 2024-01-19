import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {
  Benefits,
  BenefitsSummaryContent,
} from '@shared-lib/services/benefits/models/benefits.model';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {ActionOptions} from '../../../../models/ActionOptions.model';
import {HeaderType} from '@shared-lib/constants/headerType.enum';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage {
  benefitsContent: BenefitsSummaryContent;
  actionOption: ActionOptions = {
    headername: undefined,
    btnleft: true,
    btnright: true,
    buttonLeft: {
      name: '',
      link: 'settings',
    },
    buttonRight: {
      name: '',
      link: 'notification',
    },
  };
  benefits: Benefits;
  hasBenefits: boolean;
  isWeb: boolean;

  constructor(
    private headerType: HeaderTypeService,
    private router: Router,
    private benefitService: BenefitsService,
    private utilityService: SharedUtilityService
  ) {}

  ngOnInit(): void {
    this.isWeb = this.utilityService.getIsWeb();
    this.getBenefitData();
  }

  async getBenefitData(): Promise<void> {
    return this.benefitService
      .getNextYearBenefits()
      .then(async (res: Benefits) => {
        this.benefits = res;
        this.hasBenefits =
          this.benefits?.enrolled?.length > 0 ||
          this.benefits?.provided?.length > 0 ||
          this.benefits?.declined?.length > 0;
      });
  }

  async ionViewWillEnter() {
    this.benefitsContent = await this.benefitService.getBenefitContent();
    this.actionOption.headername = this.benefitsContent.header;
    this.actionOption.buttonLeft.link = this.benefitService.getBenefitSummaryBackButton();
    this.headerType.publish({
      type: HeaderType.navbar,
      actionOption: this.actionOption,
    });
    this.benefitService.setBenefitSummaryBackButton('settings');
  }

  goToAddBenefits() {
    this.router.navigateByUrl('/settings/summary/add-benefits');
  }
}
