import {Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import * as PageText from '../../../../../../constants/workplace-dashboard-content.json';
import {MVlandingContent} from '../../../../../../models/mvlandingcontent.model';
import {Account} from '@shared-lib/services/account/models/accountres.model';
import {CategorizedAccounts} from '@shared-lib/services/account/models/all-accounts.model';
import {AddAccountModalComponent} from '@web/app/modules/features/workplace-dashboard/home/components/hero-card-section/components/landing-add-account/components/add-account-modal/add-account-modal.component';
import {AccountService} from '@shared-lib/services/account/account.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {Subscription} from 'rxjs';
import * as ModalText from '../accounts-widgets/constants/account-widget-content.json';
import {Content} from '../accounts-widgets/models/widget-types.model';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {AccountWidgetModal} from '../accounts-widgets/components/account-widget-modal/account-widget-modal.component';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import { AccessService } from '@shared-lib/services/access/access.service';

@Component({
  selector: 'app-expandable-account-list',
  templateUrl: './expandable-account-list.component.html',
  styleUrls: ['./expandable-account-list.component.scss'],
})
export class ExpandableAccountListComponent implements OnInit {
  @Input() acctType: string;
  @Input() headerText: string;
  @Input() lastAcct?: boolean;
  @Input() indexId?: number;
  @Input() isMXUser: boolean;
  @Input() enableMX: boolean;
  pageText: MVlandingContent = (PageText as any).default;
  modalText: Content = (ModalText as any).default;
  showManageAccounts = false;
  isEnrollmentAcct = false;
  expanded = false;
  showAccount = false;
  categorizedAccount: CategorizedAccounts;
  acctTypeName = '';
  acctTypeIconName = '';
  expandIconDown = 'assets/icon/chevron_down.svg';
  expandIconUp = 'assets/icon/journeys/chevron_up.svg';
  expandIconImage = 'assets/icon/chevron_down.svg';
  expandIconName = 'chevron_down';
  private subscription = new Subscription();
  isAltAccessUser = false;

  constructor(
    private accountService: AccountService,
    private utilityService: SharedUtilityService,
    private modalController: ModalController,
    private router: Router,
    private mxService: MXService,
    private accessService: AccessService
  ) {}

  ngOnInit() {
    this.fetchAggregatedAccounts();
    this.accessService.checkMyvoyageAccess().then(access => {
      this.isAltAccessUser = access.isAltAccessUser;
    });
  }

  toggleAccounts(): void {
    this.expanded = !this.expanded;
    this.expandIconImage =
      this.expandIconImage.indexOf('up') >= 0
        ? this.expandIconDown
        : this.expandIconUp;
    this.expandIconName =
      this.expandIconImage.indexOf('up') >= 0 ? 'chevron_down' : 'chevron_up';
  }

  goToPlanLink(acct: Account) {
    if (acct.planLink.indexOf('http') >= 0) {
      window.open(acct.planLink, '_blank');
    } else if (acct.planLink.indexOf('mxdetails') >= 0) {
      const guid = acct.planLink.substring(
        acct.planLink.indexOf('ACT'),
        acct.planLink.length + 1
      );
      this.navigateToMXAcct(guid);
    } else if (acct.sourceSystem === 'VENDOR' && !acct.isVoyaAccessPlan) {
      this.navigateToAcct(acct.planId, 'vendorAccounts');
    } else if (acct.sourceSystem === 'STOCK' && !acct.isVoyaAccessPlan) {
      this.navigateToAcct(acct.planId, 'stockAccounts');
    } else if (acct.isVoyaAccessPlan) {
      this.navigateToIsVoyaAccessPlan(acct.planId, acct.agreementId);
    } else {
      this.navigateToAcct(acct.planId);
    }
  }

  navigateToIsVoyaAccessPlan(planId: string, agreementId: string) {
    this.router.navigateByUrl(
      `accounts/account-details/${planId +
        '-isVoyaAccessPlan-' +
        agreementId}/info`
    );
    this.subscription.add(
      this.accountService
        .getIsVoyaAccessPlanAccountData(planId, agreementId)
        .subscribe(data => {
          this.accountService.setAccountLocalStorage(data);
        })
    );
  }

  navigateToAcct(planId: string, type?: string) {
    this.router.navigateByUrl(`accounts/account-details/${planId}/info`);
    if (type) {
      this.subscription.add(
        this.accountService
          .getAccountDataBasedOnType(planId, type)
          .subscribe(accountDataBasedOnType => {
            this.accountService.setAccountLocalStorage(accountDataBasedOnType);
          })
      );
    } else {
      this.subscription.add(
        this.accountService
          .getAccountDataWithoutType(planId)
          .subscribe(accountDataWithoutType => {
            this.accountService.setAccountLocalStorage(accountDataWithoutType);
          })
      );
    }
  }

  navigateToMXAcct(guid: string) {
    this.router.navigateByUrl(`accounts/mxdetails-account/${guid}`);
    this.subscription.add(
      this.mxService.getMXAccountData(guid).subscribe(data => {
        this.mxService.setMxDataLocalStorage(data);
      })
    );
  }

  fetchAggregatedAccounts() {
    this.subscription.add(
      this.accountService.getAggregatedAccounts().subscribe(data => {
        this.showManageAccounts = data.hasMXAccount;
        if (this.acctType) {
          this.acctTypeName = this.acctType;
          if (this.acctTypeName === 'Investment') {
            this.expanded = true;
            this.expandIconImage = 'assets/icon/journeys/chevron_up.svg';
            this.expandIconName = 'chevron_up';
          }
          this.categorizedAccount = data.categorizedAccounts
            ? data.categorizedAccounts.filter(p =>
                p.accType.includes(this.acctTypeName)
              )[0]
            : {};
          this.showAccount =
            this.categorizedAccount &&
            Object.keys(this.categorizedAccount).length > 0;
          this.acctTypeIconName = this.acctType.replace(/ /g, '').toLowerCase();
          if (this.acctTypeIconName === 'readyforenrollment') {
            this.isEnrollmentAcct = true;
          }
        }
      })
    );
  }

  async openAddAccountModal() {
    if (this.isMXUser) {
      this.router.navigateByUrl('/accounts/add-accounts');
    } else {
      this.utilityService.setSuppressHeaderFooter(true);
      const modal = await this.modalController.create({
        component: AddAccountModalComponent,
        cssClass: 'modal-fullscreen',
      });
      return modal.present();
    }
  }

  async openManageAccountWidgetModal() {
    this.utilityService.setSuppressHeaderFooter(true);
    const modal = await this.modalController.create({
      component: AccountWidgetModal,
      cssClass: 'modal-fullscreen',
      componentProps: {
        modalHeader: this.modalText.manageAccounts,
        buttonText: this.modalText.cancelLink,
        widgetType: WidgetType.MANAGE_ACCOUNT,
      },
    });
    return modal.present();
  }

  openEnrollNowLink(link: string) {
    this.accountService.openPwebAccountLink(decodeURIComponent(link), '_self');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
