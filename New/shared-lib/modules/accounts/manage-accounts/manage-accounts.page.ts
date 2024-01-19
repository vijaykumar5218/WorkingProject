import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ViewDidEnter} from '@ionic/angular';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import * as PageText from './constants/manage-accounts-content.json';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {HeaderFooterTypeService} from '../../../services/header-footer-type/headerFooterType.service';
import {HeaderType} from '../../../constants/headerType.enum';
import {AccountService} from '@shared-lib/services/account/account.service';

@Component({
  selector: 'app-manage-accounts',
  styleUrls: ['./manage-accounts.page.scss'],
  templateUrl: './manage-accounts.page.html',
})
export class ManageAccountsPage implements OnInit, ViewDidEnter {
  readonly widgetType = WidgetType;
  pageText = (PageText as any).default;
  height: string;
  @ViewChild('container', {read: ElementRef, static: true})
  contentView: ElementRef;
  isWeb: boolean;

  constructor(
    private headerFooterService: HeaderFooterTypeService,
    private mxService: MXService,
    private sharedUtilityService: SharedUtilityService,
    private accountService: AccountService
  ) {
    this.isWeb = this.sharedUtilityService.getIsWeb();
  }

  ngOnInit(): void {
    this.height = this.contentView.nativeElement.offsetHeight + 100 + '%';
  }

  ionViewWillEnter() {
    if (!this.isWeb) {
      this.headerFooterService.publishType(
        {
          type: HeaderType.navbar,
          actionOption: {
            headername: this.pageText.header,
            btnleft: true,
            buttonLeft: {
              name: this.pageText.back,
              link: 'back',
            },
          },
        },
        {type: FooterType.none}
      );
    }
  }

  ionViewDidEnter(): void {
    this.mxService.addMXWindowEventListener();
  }

  ionViewWillLeave(): void {
    this.mxService.getMxMemberConnect(true);
    this.mxService.getMxAccountConnect(true);
    this.accountService.getAggregatedAccounts(this.mxService.getUserAccountUpdate());
    this.mxService.removeMXWindowEventListener();
  }
}
