import {Injectable, OnDestroy} from '@angular/core';
import {BaseService} from '../base/base-factory-provider';
import {endPoints} from './constants/endpoints';
import {SharedUtilityService} from '../utility/utility.service';
import {
  BehaviorSubject,
  from,
  Observable,
  ReplaySubject,
  Subscription,
} from 'rxjs';
import {TPAClaimsData} from './models/tpa.model';
import {ModalController} from '@ionic/angular';
import {TPAStreamConnectPage} from '@shared-lib/components/coverages/tpastream-connect/tpastream-connect.page';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TPAStreamService implements OnDestroy {
  endpoints;
  isWeb = false;
  private tpaData: Observable<TPAClaimsData> = null;
  private tpaDataSubject: ReplaySubject<TPAClaimsData> = new ReplaySubject(1);
  private subscription: Subscription = new Subscription();

  tpaDataReload$: BehaviorSubject<void> = new BehaviorSubject(null);

  constructor(
    private utilityService: SharedUtilityService,
    private baseService: BaseService,
    private modalController: ModalController,
    private router: Router
  ) {
    this.endpoints = this.utilityService.appendBaseUrlToEndpoints(endPoints);
    this.isWeb = this.utilityService.getIsWeb();
  }

  processTPAData(tpaData: TPAClaimsData) {
    const carrierNames = {};
    tpaData.carriers.forEach(carrier => {
      carrierNames[carrier.carrierId] = carrier.carrierName;
    });

    Object.keys(tpaData.groupingCategoryDetails).forEach(key => {
      for (const element of tpaData.groupingCategoryDetails[key]) {
        if (element.serviceName === 'rx') {
          if (element.claimLines && element.claimLines.length > 0) {
            element.drugName = element.claimLines[0].procedure_name;
          }
        }
        element.carrierName = carrierNames[element.carrierId];
      }
    });
  }

  getTPAData(refresh = false): Observable<TPAClaimsData> {
    if (this.tpaData == null || refresh) {
      this.tpaDataReload$.next();
      this.tpaData = from(
        this.baseService.post(this.endpoints.healthUtilization, {})
      );

      const subscription = this.tpaData.subscribe(result => {
        this.processTPAData(result);
        this.tpaDataSubject.next(result);
      });
      this.subscription.add(subscription);
    }
    return this.tpaDataSubject;
  }

  async openTPAConnect(redirect = false) {
    if (this.isWeb) {
      this.router.navigateByUrl('coverages/all-coverages/tpaclaims/connect');
    } else {
      const modal = await this.modalController.create({
        component: TPAStreamConnectPage,
        cssClass: 'modal-fullscreen',
      });
      if (redirect) {
        modal.onWillDismiss().then(() => {
          this.router.navigateByUrl('coverages/coverage-tabs/insights');
        });
      }
      modal.present();
    }
  }

  async revokeCarrier(
    policyHolderId: number,
    memberId: number
  ): Promise<boolean> {
    const payload = {
      memberId: memberId,
      policyHolderId: policyHolderId,
      enable: false,
    };
    const result = await this.baseService.post(
      this.endpoints.disablePolicyHolder,
      payload
    );
    return result === true;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
