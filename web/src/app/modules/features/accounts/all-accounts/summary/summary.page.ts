import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import pageContent from './constants/summaryContent.json';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {SummaryWidgets} from './models/summaryModel';
import {BudgetWidgetComponent} from '@shared-lib/modules/accounts/components/budget-widget/budget-widget.component';
import {SpendingWidgetComponent} from '@shared-lib/modules/accounts/components/spending-widget/spending-widget.component';
import {RootObjectMX} from '@shared-lib/services/mx-service/models/mx.model';
import {PlatformService} from '@shared-lib/services/platform/platform.service';
import {NetWorthComponent} from '@shared-lib/components/net-worth/net-worth.component';
@Component({
  selector: 'app-summary',
  templateUrl: 'summary.page.html',
  styleUrls: ['summary.page.scss'],
})
export class SummaryPage implements OnInit {
  subscription: Subscription = new Subscription();
  hasMXUser = false;
  pageContent: SummaryWidgets = pageContent;
  @ViewChild(SpendingWidgetComponent) spendingWidget: SpendingWidgetComponent;
  @ViewChild(BudgetWidgetComponent) budgethWidget: BudgetWidgetComponent;
  getHeaderMessage: RootObjectMX;
  isDesktop: boolean;
  @ViewChild(NetWorthComponent) netWorthWidget: NetWorthComponent;
  deviceWidth: number;
  isViewInit: boolean;
  isAltAccessUser = false;
  constructor(
    private mxService: MXService,
    private platform: PlatformService
  ) {}

  ngOnInit() {
    const hasAltAccessUser = this.mxService.checkIsAltAccessUser().subscribe(altAccess => {
      this.isAltAccessUser = altAccess;
    });
    this.subscription.add(hasAltAccessUser);
    this.platform.isDesktop().subscribe(data => {
      this.isDesktop = data;
      this.deviceWidth = this.platform._deviceWidth;
      if (this.isViewInit) {
        if (!data) {
          this.fetchScreenContent();
        }
      }
    });
  }

  ionViewWillEnter(): void {
    const hasMXUserSubscription = this.mxService
      .getIsMxUserByMyvoyageAccess()
      .subscribe(hasUser => {
        this.hasMXUser = hasUser;
        if (this.hasMXUser) {
          this.mxService.displayWidget(WidgetType.NET_WORTH, {
            id: 'mx-net-worth',
            height: '480px',
            autoload: false,
          });
        }
      });
    this.subscription.add(hasMXUserSubscription);
    if (this.deviceWidth <= 480) {
      this.netWorthWidget.widget.refreshWidget();
    }
    if (this.isDesktop) {
      this.fetchScreenContent();
      this.spendingWidget.widget.refreshWidget();
      this.budgethWidget.widget.refreshWidget();
    }
  }

  fetchScreenContent() {
    const headerDataSubscription = this.mxService
      .getHeaderData()
      .subscribe(data => {
        this.getHeaderMessage = data;
      });
    this.subscription.add(headerDataSubscription);
  }

  ngAfterViewInit() {
    this.isViewInit = true;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
