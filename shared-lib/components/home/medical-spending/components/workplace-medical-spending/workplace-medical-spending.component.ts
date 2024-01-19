import {Component, Input, OnInit} from '@angular/core';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {Router} from '@angular/router';
import {
  MedicalPreAuthMessage,
  MedicalSpending,
  TPAWaitingMessage,
} from './models/medical-spending.model';
import {NoBenefitContent} from '@shared-lib/services/benefits/models/noBenefit.model';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {MedicalConsentPage} from '@shared-lib/components/coverages/consent-required/medical-consent/medical-consent.page';
import {ModalController} from '@ionic/angular';
import {TPAStreamService} from '@shared-lib/services/tpa-stream/tpastream.service';

@Component({
  selector: 'workplace-medical-spending',
  templateUrl: './workplace-medical-spending.component.html',
  styleUrls: ['./workplace-medical-spending.component.scss'],
})
export class WorkplaceMedicalSpendingComponent implements OnInit {
  @Input() totalSpend = 0;
  @Input() totalPremiumSavvi = 0;
  workplaceCovergePreAuthMessage: MedicalPreAuthMessage;
  workplaceMedicalSpending: MedicalSpending;
  @Input() hasConsent = false;
  @Input() isTPA: boolean;
  @Input() isTPAWaiting: boolean;
  @Input() forMobilePlansPage = false;
  workplaceCovergeTPAWaitingMessage: TPAWaitingMessage;
  benefitsContent: NoBenefitContent;

  constructor(
    private benefitsService: BenefitsService,
    private utilityService: SharedUtilityService,
    private router: Router,
    private modalController: ModalController,
    private tpaService: TPAStreamService
  ) {}

  async ngOnInit() {
    await this.fetchContent();
  }

  fetchContent(): Promise<void> {
    return this.benefitsService
      .getNoBenefitContents()
      .then((coverageContent: NoBenefitContent) => {
        this.benefitsContent = coverageContent;
        this.workplaceCovergePreAuthMessage = JSON.parse(
          coverageContent.workplaceCovergePreAuthMessage
        );
        this.workplaceMedicalSpending = JSON.parse(
          coverageContent.workplaceCovergeMedicalSpending
        );
        this.workplaceCovergeTPAWaitingMessage = JSON.parse(
          coverageContent.workplaceCovergeTPAWaitingMessage
        );
      });
  }

  onClickButton(link?: string) {
    if (link) {
      this.router.navigateByUrl(link);
      if (link === 'coverages/insights') {
        this.benefitsService.publishSelectedTab('insights');
      }
    } else {
      if (this.isTPA) {
        this.onClickRouteToTPA();
      } else {
        this.onClickConsentRequest();
      }
    }
  }

  onClickRouteToTPA() {
    if (this.isTPAWaiting) {
      if (this.utilityService.getIsWeb()) {
        this.router.navigateByUrl(
          'coverages/all-coverages/tpaclaims/providers'
        );
      } else {
        this.router.navigateByUrl('coverages/coverage-tabs/tpaclaims');
        this.benefitsService.publishSelectedTab('tpaclaims');
      }
    } else {
      this.tpaService.openTPAConnect(true);
    }
  }

  async onClickConsentRequest() {
    if (!this.utilityService.getIsWeb()) {
      const modal = await this.modalController.create({
        component: MedicalConsentPage,
        cssClass: 'modal-fullscreen',
        componentProps: {
          contentData: JSON.parse(
            this.benefitsContent.Insights_ClaimsAuthorization_ReadDisclosure
          ),
          completion: () => {
            this.router.navigateByUrl('coverages/insights');
            this.benefitsService.publishSelectedTab('insights');
          },
          back: false,
        },
      });
      modal.present();
    } else {
      this.router.navigate(['coverages/review'], {
        queryParams: {redirectTo: 'coverages/all-coverages/insights'},
      });
    }
  }
}
