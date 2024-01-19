import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {HSAStorePage} from '@shared-lib/modules/accounts/hsastore/hsastore.page';
import {AccountService} from '@shared-lib/services/account/account.service';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {NoBenefitContent} from '@shared-lib/services/benefits/models/noBenefit.model';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {AlertComponent} from '../alert/alert.component';
import * as pageText from './constants/pageText.json';
import {AccessService} from '@shared-lib/services/access/access.service';

@Component({
  selector: 'app-hsastore-nudge',
  templateUrl: './hsastore-nudge.component.html',
  styleUrls: ['./hsastore-nudge.component.scss'],
})
export class HSAStoreNudgeComponent implements OnInit {
  pageText: Record<string, string> = pageText;
  isWeb = false;
  show = false;
  content: Record<string, string>;

  @Input() fromJourney = false;
  @Input() miniNudge = false;

  constructor(
    private modalController: ModalController,
    private utilityService: SharedUtilityService,
    private accountService: AccountService,
    private benefitsService: BenefitsService,
    private accessService: AccessService
  ) {
    this.isWeb = this.utilityService.getIsWeb();
  }

  ngOnInit() {
    this.fetchHsaStoreEnabled();
  }

  async fetchHsaStoreEnabled() {
    const {hsaStoreEnabled} = await this.accessService.checkMyvoyageAccess();
    if (hsaStoreEnabled) this.fetchData();
  }

  fetchData() {
    if (this.fromJourney) {
      this.show = true;
    } else {
      this.accountService.getHSAorFSA().then(horf => {
        if (horf.fsa || horf.hsa) {
          this.show = true;
        }
      });
    }
    this.benefitsService
      .getNoBenefitContents()
      .then((benContent: NoBenefitContent) => {
        this.content = JSON.parse(benContent.HSA_FSA_Store_Disclosure_Modal);
      });
  }

  async openStoreDisclaimer() {
    let theClass = 'modal-total-fullscreen';
    if (this.isWeb) {
      theClass = 'modal-not-fullscreen';
    }

    const modal = await this.modalController.create({
      component: AlertComponent,
      cssClass: theClass,
      componentProps: {
        titleMessage: this.content.discTitle,
        message: this.content.discMessage,
        yesButtonTxt: this.content.discOkay,
        noButtonTxt: this.content.discNo,
        saveFunction: async (): Promise<boolean> => {
          this.openStore();
          return true;
        },
      },
    });
    modal.present();
  }

  async openStore() {
    let modalClass = 'modal-fullscreen';
    if (this.isWeb) {
      modalClass = 'modal-not-fullscreen-large';
    }

    const modal = await this.modalController.create({
      component: HSAStorePage,
      cssClass: modalClass,
    });
    modal.present();
  }
}
