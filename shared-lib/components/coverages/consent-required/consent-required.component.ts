import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {NoBenefitContent} from '@shared-lib/services/benefits/models/noBenefit.model';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {MedicalConsentPage} from './medical-consent/medical-consent.page';
import * as pageText from './constants/text-data.json';
import {Router} from '@angular/router';
import {PlatformService} from '@shared-lib/services/platform/platform.service';
import {AccessService} from '../../../services/access/access.service';
import {TPAStreamService} from '@shared-lib/services/tpa-stream/tpastream.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-consent-required',
  templateUrl: './consent-required.component.html',
  styleUrls: ['./consent-required.component.scss'],
})
export class ConsentRequiredComponent implements OnInit, OnDestroy {
  @Input() back: boolean;
  pageText: Record<string, string> = pageText;
  benefitsContent: NoBenefitContent;
  isTPAStream = false;
  isTPAWaiting = false;
  isWeb: boolean;
  contentJSON: {
    consent_description: string;
    consent_title: string;
    image_url: string;
  };
  isDesktop: boolean;
  subscription: Subscription = new Subscription();

  constructor(
    private modalController: ModalController,
    private benefitServices: BenefitsService,
    private sharedUtilityService: SharedUtilityService,
    private router: Router,
    private platformService: PlatformService,
    private accessService: AccessService,
    private tpaService: TPAStreamService
  ) {
    this.platformService.isDesktop().subscribe(data => {
      this.isDesktop = data;
    });
  }

  async ngOnInit() {
    const {enableTPA} = await this.accessService.checkMyvoyageAccess();
    this.isTPAStream = enableTPA === 'Y';
    this.isWeb = this.sharedUtilityService.getIsWeb();
    this.benefitsContent = await this.benefitServices.getNoBenefitContents();

    const content = this.benefitsContent
      .Insights_OverlayMessage_ReviewAuthorization;
    this.contentJSON = JSON.parse(content);
    if (this.isTPAStream) {
      this.initTPAStream();
    }
  }

  initTPAStream() {
    this.subscription.add(
      this.tpaService.getTPAData().subscribe(tpaData => {
        if (tpaData.carriers.length > 0) {
          this.isTPAWaiting = true;
          const claimsAccessContent = this.benefitsContent
            .Insights_TPA_PendingClaimsAccess;
          this.contentJSON = JSON.parse(claimsAccessContent);
        } else {
          this.isTPAWaiting = false;
          const content = this.benefitsContent
            .Insights_OverlayMessage_ReviewAuthorization;
          this.contentJSON = JSON.parse(content);
        }
      })
    );
  }

  manageTPA() {
    if (this.isWeb) {
      this.router.navigateByUrl('coverages/all-coverages/tpaclaims/providers');
    } else {
      this.router.navigateByUrl('coverages/coverage-tabs/tpaproviders');
    }
  }

  skip() {
    this.router.navigateByUrl('/coverages/plans');
    this.benefitServices.publishSelectedTab('plans');
  }

  async allowAuthorization() {
    if (this.isTPAStream) {
      this.tpaService.openTPAConnect();
    } else {
      if (this.isWeb && this.isDesktop) {
        this.router.navigateByUrl('coverages/review');
      } else {
        const modal = await this.modalController.create({
          component: MedicalConsentPage,
          cssClass: 'modal-fullscreen',
          componentProps: {
            contentData: JSON.parse(
              this.benefitsContent.Insights_ClaimsAuthorization_ReadDisclosure
            ),
            back: this.back,
          },
        });
        modal.present();
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
