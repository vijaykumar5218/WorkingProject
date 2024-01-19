import {Component, Input} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {Content} from '../../models/widget-types.model';
import * as PageText from '../../constants/account-widget-content.json';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {AccountService} from '@shared-lib/services/account/account.service';
@Component({
  selector: 'account-widget-modal',
  templateUrl: './account-widget-modal.component.html',
  styleUrls: ['./account-widget-modal.component.scss'],
})
export class AccountWidgetModal {
  pageText: Content = (PageText as any).default;
  height: string;
  @Input() widgetType: WidgetType;
  @Input() modalHeader: string;
  @Input() buttonText: string;

  constructor(
    private modalController: ModalController,
    private utilityService: SharedUtilityService,
    private mxService: MXService,
    private accountService: AccountService
  ) {}

  ionViewDidEnter(): void {
    this.mxService.addMXWindowEventListener();
  }

  ionViewWillLeave(): void {
    this.mxService.getMxMemberConnect(true);
    this.mxService.getMxAccountConnect(true);
    this.accountService.getAggregatedAccounts(this.mxService.getUserAccountUpdate());
    this.mxService.removeMXWindowEventListener();
  }

  closeModal() {
    this.utilityService.setSuppressHeaderFooter(false);
    this.modalController.dismiss();
  }
}
