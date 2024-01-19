import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NetWorthContent} from '@shared-lib/models/net-worth.model';
import * as nwContent from '@shared-lib/constants/net-worth.json';
import {MXWidgetComponent} from '../mx-widget/mx-widget.component';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {Platform} from '@ionic/angular';
import {Router} from '@angular/router';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {Subscription} from 'rxjs';
import {AccessService} from '@shared-lib/services/access/access.service';

@Component({
  selector: 'app-net-worth',
  templateUrl: './net-worth.component.html',
  styleUrls: ['./net-worth.component.scss'],
})
export class NetWorthComponent implements OnInit, OnDestroy {
  readonly widgetType = WidgetType;
  netWorthContent: NetWorthContent = (nwContent as any).default;

  @Input() usePlaceholder = false;
  @Input() tagName: string;
  @Input() isMiniWidget: boolean;
  isTablet = false;
  isWeb: boolean;
  currentUrl: string;
  showNudge = false;
  subscription: Subscription;

  @ViewChild(MXWidgetComponent) widget: MXWidgetComponent;

  constructor(
    private platform: Platform,
    private router: Router,
    private utilityService: SharedUtilityService,
    private mxService: MXService,
    private accessService: AccessService
  ) {}

  ngOnInit(): void {
    if (this.usePlaceholder) {
      this.fetchData();
    }
    this.isTablet = this.isMiniWidget ? false : this.platform.is('tablet');
    this.isWeb = this.utilityService.getIsWeb();
    this.currentUrl = this.router.url;
  }

  async fetchData() {
    this.subscription = this.mxService
      .getIsMxUserByMyvoyageAccess()
      .subscribe(isMxUser => {
        this.accessService.checkMyvoyageAccess().then(res => {
          this.showNudge = res.isHealthOnly && !isMxUser;
        });
      });
  }

  netWorthClicked() {
    this.router.navigateByUrl('net-worth');
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
