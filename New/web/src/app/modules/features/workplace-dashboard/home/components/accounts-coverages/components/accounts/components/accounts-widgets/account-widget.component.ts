import {Component, ViewChild, Input, OnInit} from '@angular/core';
import {Content} from './models/widget-types.model';
import * as PageText from './constants/account-widget-content.json';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {MXWidgetComponent} from '@shared-lib/components/mx-widget/mx-widget.component';
import {Subscription} from 'rxjs';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {Router} from '@angular/router';
import {AccessService} from '@shared-lib/services/access/access.service';
import {Platform} from '@ionic/angular';

@Component({
  selector: 'app-account-widgets',
  templateUrl: './account-widget.component.html',
  styleUrls: ['./account-widget.component.scss'],
})
export class AccountWidgetsComponent implements OnInit {
  @Input() templateType: string;
  @Input() widgetHeight: string;
  @Input() widgetId: string;
  pageText: Content = (PageText as any).default;
  widgetType: WidgetType = WidgetType.NET_WORTH_MINI;
  @ViewChild(MXWidgetComponent) widget: MXWidgetComponent;
  isRefreshWidget: boolean;
  widgetButtonText: string;
  @Input() isMXUser: boolean;
  hasAccounts = false;
  isHealthOnly = false;
  isIos: boolean;
  isAltAccessUser = false;
  private subscription = new Subscription();

  constructor(
    private mxService: MXService,
    private router: Router,
    private accessService: AccessService,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.accessService.checkMyvoyageAccess().then(access => {
      this.isHealthOnly = access.isHealthOnly;
      this.isAltAccessUser = access.isAltAccessUser;
    });
    this.subscription.add(
      this.mxService.getIsMxUserByMyvoyageAccess().subscribe(isMxUser => {
        this.hasAccounts = isMxUser;
      })
    );
    this.isIos = this.platform.is('ios');
  }

  changeWidgetsType(event) {
    if (event.detail.value === 'mini_net_worth_widget') {
      this.widgetType = WidgetType.NET_WORTH_MINI;
    } else if (event.detail.value === 'mini_spending_widget') {
      this.widgetType = WidgetType.MINI_SPENDING_WIDGET;
      this.isRefreshWidget = true;
    } else if (event.detail.value === 'mini_budgets_widget') {
      this.widgetType = WidgetType.MINI_BUDGET_WIDGET;
      this.isRefreshWidget = true;
    }
    this.widgetButtonText = this.pageText.widgetItems.filter(widgetItems => {
      if (widgetItems.value === this.widgetType) {
        return widgetItems;
      }
    })[0].widgetButtonText;
    if (this.isRefreshWidget) {
      setTimeout(() => {
        this.widget.refreshWidget();
      });
    }
  }

  navigateToAccounts() {
    this.router.navigateByUrl('accounts');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
