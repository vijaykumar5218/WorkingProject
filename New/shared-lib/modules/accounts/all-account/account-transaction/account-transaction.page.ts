import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ViewWillEnter} from '@ionic/angular';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {MXWidgetComponent} from '@shared-lib/components/mx-widget/mx-widget.component';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import { AccessService } from '@shared-lib/services/access/access.service';

@Component({
  selector: 'app-account-transaction',
  templateUrl: './account-transaction.page.html',
  styleUrls: ['./account-transaction.page.scss'],
})
export class AccountTransactionPage implements OnInit, ViewWillEnter {
  readonly widgetType = WidgetType;
  @ViewChild('container', {read: ElementRef, static: true})
  contentView: ElementRef;
  @ViewChild(MXWidgetComponent) widget: MXWidgetComponent;
  height: string;
  isWeb: boolean;
  firstLoad = false;
  isAltAccessUser = false;
  constructor(private utilityService: SharedUtilityService, private accessService: AccessService) {}

  ngOnInit(): void {
    this.isWeb = this.utilityService.getIsWeb();
    this.height = this.contentView.nativeElement.offsetHeight + 30 + 'px';
    this.checkAltAccessUser();
  }

  ionViewWillEnter(): void {
    if (!this.firstLoad) {
      this.widget.refreshWidget();
    }
    this.firstLoad = false;
  }

  async checkAltAccessUser() {
    const{isAltAccessUser} = await this.accessService.checkMyvoyageAccess();
        this.isAltAccessUser = isAltAccessUser;
      }
}
