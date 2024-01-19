import {Component, EventEmitter, OnDestroy, Output} from '@angular/core';
import {ToastController} from '@ionic/angular';
import {AccountJsonModel} from '@shared-lib/services/account/models/accountres.model';
import {
  MXAccount,
  MXAccountRootObject,
} from '@shared-lib/services/mx-service/models/mx.model';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {Subscription} from 'rxjs';
import pageText from '../../../../services/account/models/retirement-account/info/info-tab.json';
import {EventTrackingService} from '@shared-lib/services/event-tracker/event-tracking.service';
import {EventTrackingConstants} from '@shared-lib/services/event-tracker/models/event-tracking.model';
import * as eventC from '@shared-lib/services/event-tracker/constants/event-tracking.json';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {Router} from '@angular/router';
import {AccountService} from '@shared-lib/services/account/account.service';

export const HAS_CREATED_ZERO_EVENT = 'HAS_CREATED_ZERO_EVENT';

@Component({
  selector: 'app-mx-account-list',
  templateUrl: './mx-account-list.component.html',
  styleUrls: ['./mx-account-list.component.scss'],
})
export class MXAccountListComponent implements OnDestroy {
  pageText: AccountJsonModel = pageText;
  eventContent: EventTrackingConstants = (eventC as any).default;
  hasMXUser = false;
  showManageAccounts = false;
  mxAccountData: MXAccount[];
  private subscription: Subscription = new Subscription();
  isWeb: boolean;
  guid: string;
  isAltAccessUser = false;

  @Output() mxAccountClicked: EventEmitter<MXAccount> = new EventEmitter<
    MXAccount
  >();

  constructor(
    private mxService: MXService,
    private toastCtrl: ToastController,
    private eventTracking: EventTrackingService,
    private utilityService: SharedUtilityService,
    private router: Router,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.isWeb = this.utilityService.getIsWeb();
    this.getMXAccountData();
    this.fetchGuid();
    this.checkAltAccessUser();
  }

  getMXAccountData() {
    const mxSubscription = this.mxService
      .getMxAccountConnect()
      .subscribe((data: MXAccountRootObject) => {
        this.mxAccountsChanged(data);
      });

    this.subscription.add(mxSubscription);
  }

  mxAccountsChanged(mxAccounts: MXAccountRootObject) {
    if (!mxAccounts || mxAccounts.accounts.length === 0) {
      this.createMXZeroEvent();
    } else {
      this.updateMXEvent();
    }

    if (this.mxAccountData) {
      if (this.mxAccountData.length < mxAccounts.accounts.length) {
        this.presentToast(this.pageText.accountsLinkedToast);
        this.accountService.getAggregatedAccounts(true);
      } else if (this.mxAccountData.length > mxAccounts.accounts.length) {
        this.presentToast(this.pageText.accountsUnLinkedToast);
        this.accountService.getAggregatedAccounts(true);
        if (mxAccounts.accounts.length === 0) {
          this.createMXZeroEvent(true);
        }
      }
    }

    this.mxAccountData = mxAccounts?.accounts;
  }

  updateMXEvent() {
    this.eventTracking.eventTracking({
      eventName: this.eventContent.eventTrackingMx.eventName,
      updateInd: this.eventContent.eventTrackingMx.updateInd,
    });
  }

  createMXZeroEvent(force = false) {
    const hasEvent = localStorage.getItem(HAS_CREATED_ZERO_EVENT) === 'true';
    if (!hasEvent || force) {
      this.eventTracking.eventTracking({
        eventName: this.eventContent.eventTrackingMx.eventName,
      });
      localStorage.setItem(HAS_CREATED_ZERO_EVENT, 'true');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: 'dark',
      cssClass: 'toast-below-nav',
      animated: false,
    });

    toast.present();
  }

  sendmxtitle(mxaccount: MXAccount) {
    if (this.isWeb) {
      this.router.navigateByUrl(`accounts/mxdetails-account/${mxaccount.guid}`);
    } else {
      this.mxService.setMxData(mxaccount);
      this.mxAccountClicked.emit(mxaccount);
    }
  }

  fetchGuid() {
    const routerSubscription = this.utilityService
      .fetchUrlThroughNavigation(3)
      .subscribe(data => {
        this.guid = data?.paramId;
      });
    this.subscription.add(routerSubscription);
  }

  manageWidthOfCard(mxaccount: MXAccount): Record<string, string> | null {
    if (this.isWeb) {
      if (this.guid === mxaccount.guid) {
        this.mxService.setMxDataLocalStorage(mxaccount);
        return {width: '480px'};
      } else {
        return {width: 'auto'};
      }
    }
    return null;
  }

  checkAltAccessUser() {
    this.mxService.checkIsAltAccessUser().subscribe(altAccess => {
      this.isAltAccessUser = altAccess;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
