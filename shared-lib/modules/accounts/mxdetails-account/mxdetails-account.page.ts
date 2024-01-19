import {Component} from '@angular/core';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {MXAccount} from '@shared-lib/services/mx-service/models/mx.model';
import {ViewWillEnter} from '@ionic/angular';
import * as pageText from './constants/mxdetails-info.json';
import {MxDetailContent} from './models/mxdetails.model';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {Subscription} from 'rxjs';
import {HeaderType} from '../../../constants/headerType.enum';
import {HeaderFooterTypeService} from '../../../services/header-footer-type/headerFooterType.service';
import {ActionOptions} from '../../../models/ActionOptions.model';
import {NavigationModel} from '@shared-lib/services/utility/models/utility.models';

@Component({
  selector: 'app-mxdetails-account',
  templateUrl: './mxdetails-account.page.html',
  styleUrls: ['./mxdetails-account.page.scss'],
})
export class MXAccountDetailPage implements ViewWillEnter {
  readonly widgetType = WidgetType;
  pageText: MxDetailContent = (pageText as any).default;
  accountMX: MXAccount;
  actionOption: ActionOptions = {
    headername: '',
    btnleft: true,
    buttonLeft: {
      name: '',
      link: 'account',
    },
  };
  isWeb: boolean;
  isVisible: boolean;
  subscription: Subscription = new Subscription();
  tagName = 'mx-account-transactions';

  constructor(
    private headerFooterService: HeaderFooterTypeService,
    private mxService: MXService,
    private utilityService: SharedUtilityService
  ) {
    this.isWeb = this.utilityService.getIsWeb();
  }

  ionViewWillEnter() {
    if (this.isWeb) {
      const fetchUrlThroughNavigation = this.utilityService
        .fetchUrlThroughNavigation(3)
        .subscribe(data => {
          this.isVisible = false;
          this.fetchAcct(data);
        });
      this.subscription.add(fetchUrlThroughNavigation);
    } else {
      this.accountMX = this.mxService.getMxData();
      this.actionOption.headername = this.accountMX.name;
      this.headerFooterService.publishType(
        {
          type: HeaderType.navbar,
          actionOption: this.actionOption,
        },
        {type: FooterType.none}
      );
    }
  }

  fetchAcct(data: NavigationModel) {
    const getAccountLocalStorageSubscription = this.mxService
      .getMxDataLocalStorage()
      .subscribe(acct => {
        this.accountMX = acct;
        if (data?.paramId === this.accountMX.guid) {
          this.isVisible = true;
          this.tagName = `${data.paramId}-mx-account-transactions`;
        }
      });
    this.subscription.add(getAccountLocalStorageSubscription);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
