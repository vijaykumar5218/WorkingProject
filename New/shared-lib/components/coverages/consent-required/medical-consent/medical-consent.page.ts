import {Location} from '@angular/common';
import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {LoadingController, ModalController} from '@ionic/angular';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {ConsentService} from '@shared-lib/services/consent/consent.service';
import {ConsentType} from '@shared-lib/services/consent/constants/consentType.enum';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import * as pageText from './constants/text-data.json';

@Component({
  selector: 'app-medical-consent',
  templateUrl: './medical-consent.page.html',
  styleUrls: ['./medical-consent.page.scss'],
})
export class MedicalConsentPage {
  @Input() back: boolean;
  @Input() completion: () => void;
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
  hasScrolledToBottom = false;
  isWeb: boolean;

  constructor(
    private modalController: ModalController,
    private consentService: ConsentService,
    private loadingController: LoadingController,
    private router: Router,
    private benefitsService: BenefitsService,
    private sharedUtilityService: SharedUtilityService,
    private location: Location
  ) {}

  ngOnInit() {
    this.isWeb = this.sharedUtilityService.getIsWeb();
  }

  async saveConsent() {
    const loading = await this.loadingController.create({
      translucent: true,
    });
    loading.present();

    if (this.radioSelection === 'YES') {
      await this.consentService.setConsent(ConsentType.MEDICAL, true);
      this.consentService.getMedicalConsent(true);
      if (this.completion) {
        this.completion();
      }
    } else {
      if (!this.back) {
        if (this.isWeb) {
          this.router.navigateByUrl('/coverages/all-coverages/plans');
        } else {
          this.router.navigateByUrl('/coverages/coverage-tabs/plans');
          this.benefitsService.publishSelectedTab('plans');
        }
      } else {
        this.location.back();
      }
    }
    loading.dismiss();
    this.modalController.dismiss();
  }

  async onScroll(event: any) {
    if (this.hasScrolledToBottom) {
      return;
    }

    const scrollElement = await event.target.getScrollElement();
    const scrollHeight =
      scrollElement.scrollHeight - scrollElement.clientHeight;
    const currentScrollDepth = scrollElement.scrollTop;
    const triggerDepth = (scrollHeight / 100) * 95;
    if (currentScrollDepth > triggerDepth) {
      this.hasScrolledToBottom = true;
    }
  }
}
