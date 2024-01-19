import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {AlertComponent} from '@shared-lib/components/alert/alert.component';
import {TPAStreamService} from '@shared-lib/services/tpa-stream/tpastream.service';
import {
  TPAClaimsData,
  TPACarrier,
} from '@shared-lib/services/tpa-stream/models/tpa.model';
import * as pageText from './constants/text-data.json';
import {Subscription} from 'rxjs';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';

@Component({
  selector: 'app-tpaproviders',
  templateUrl: './tpaproviders.component.html',
  styleUrls: ['./tpaproviders.component.scss'],
})
export class TPAProvidersComponent implements OnInit, OnDestroy {
  isWeb = false;
  pageText: Record<string, string> = pageText;
  editing = false;
  carriers: TPACarrier[];
  memberId: number;
  private subscription: Subscription;

  constructor(
    private modalController: ModalController,
    private router: Router,
    private tpaStreamService: TPAStreamService,
    private utilityService: SharedUtilityService
  ) {
    this.isWeb = this.utilityService.getIsWeb();
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.subscription = this.tpaStreamService
      .getTPAData()
      .subscribe((tpaData: TPAClaimsData) => {
        this.memberId = tpaData.memberId;
        this.carriers = tpaData.carriers;
      });
  }

  goBack() {
    if (this.isWeb) {
      this.router.navigateByUrl('coverages/all-coverages/tpaclaims');
    } else {
      this.router.navigateByUrl('coverages/coverage-tabs/tpaclaims');
    }
  }

  addCarrier() {
    this.tpaStreamService.openTPAConnect();
  }

  async revoke(policyHolderId: number, carrierName: string) {
    const modal = await this.modalController.create({
      component: AlertComponent,
      cssClass: 'modal-not-fullscreen',
      componentProps: {
        titleMessage:
          this.pageText.areYouSure + carrierName + this.pageText.qmark,
        yesButtonTxt: this.pageText.revoke,
        noButtonTxt: this.pageText.cancel,
        saveFunction: async (): Promise<boolean> => {
          return new Promise(res => {
            this.tpaStreamService
              .revokeCarrier(policyHolderId, this.memberId)
              .then(result => {
                if (result) {
                  this.carriers = null;
                  this.tpaStreamService.getTPAData(true);
                }
                res(result);
              })
              .catch(() => {
                res(false);
              });
          });
        },
      },
    });
    return modal.present();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
