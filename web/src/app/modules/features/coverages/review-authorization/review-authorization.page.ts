import {Component} from '@angular/core';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {ConsentService} from '@shared-lib/services/consent/consent.service';
import {ConsentType} from '@shared-lib/services/consent/constants/consentType.enum';
import {NoBenefitContent} from '@shared-lib/services/benefits/models/noBenefit.model';
import * as pageText from './constants/text-data.json';
import {HeaderTypeService} from '@web/app/modules/shared/services/header-type/header-type.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'web-review-auth',
  templateUrl: './review-authorization.page.html',
  styleUrls: ['./review-authorization.page.scss'],
})
export class ReviewAuthorizationPage {
  pageText: Record<string, string> = pageText;
  contentData: {
    auth_Text: string;
    disclosure_parts: [
      {
        disclosure_description_1: string;
        disclosure_description_2: string;
        disclosure_title: string;
      }
    ];
  };
  radioSelection = 'YES';
  redirectTo: string;
  subscription = new Subscription();

  constructor(
    private consentService: ConsentService,
    private benefitsService: BenefitsService,
    private headerTypeService: HeaderTypeService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe(data => {
      this.redirectTo = data.redirectTo;
    });
    const benefitsContent: NoBenefitContent = await this.benefitsService.getNoBenefitContents();
    this.contentData = JSON.parse(
      benefitsContent.Insights_ClaimsAuthorization_ReadDisclosure
    );
  }

  async saveConsent() {
    if (this.radioSelection === 'YES') {
      await this.consentService.setConsent(ConsentType.MEDICAL, true);
      this.consentService.getMedicalConsent(true);
      if (this.redirectTo) {
        this.router.navigateByUrl(this.redirectTo);
      } else {
        this.headerTypeService.backToPrevious();
      }
    } else {
      this.router.navigateByUrl('/coverages/all-coverages/elections');
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
