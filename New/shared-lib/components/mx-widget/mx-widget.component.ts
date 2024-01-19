import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {PlatformService} from '@mobile/app/modules/shared/service/platform/platform.service';
import * as mxContent from './constants/content.json';

export const WIDGET_TIMOUT_DURATION = 14 * 60 * 1000;

@Component({
  selector: 'app-mx-widget',
  templateUrl: './mx-widget.component.html',
  styleUrls: ['./mx-widget.component.scss'],
})
export class MXWidgetComponent implements OnInit, OnDestroy {
  @Input() tagName: string;
  @Input() widgetType: WidgetType;
  @Input() height: string;
  @Input() subAccount = false;
  isWeb: boolean;
  hasError = false;
  content = mxContent;

  private widgetTimeout = 0;
  private platformSubscription = new Subscription();

  constructor(
    private mxService: MXService,
    private sharedUtilityService: SharedUtilityService,
    private platformService: PlatformService
  ) {}

  ngOnInit(): void {
    this.refreshWidget();
    this.isWeb = this.sharedUtilityService.getIsWeb();
    this.platformSubscription.add(
      this.platformService.onResume$.subscribe(this.onResume.bind(this))
    );
    this.platformSubscription.add(
      this.platformService.onPause$.subscribe(this.onPause.bind(this))
    );
  }

  onResume() {
    if (new Date().getTime() > this.widgetTimeout) {
      this.refreshWidget();
    }
  }

  onPause() {
    this.widgetTimeout = new Date().getTime() + WIDGET_TIMOUT_DURATION;
  }

  refreshWidget() {
    this.hasError = false;
    this.mxService
      .displayWidget(
        this.widgetType,
        {
          id: this.tagName,
          height: this.height,
          autoload: false,
        },
        this.subAccount
      )
      .then((res: boolean) => {
        this.hasError = !res;
      });
  }

  ngOnDestroy(): void {
    this.platformSubscription.unsubscribe();
  }
}
