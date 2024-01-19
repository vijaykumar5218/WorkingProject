import {Component, OnDestroy, OnInit} from '@angular/core';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.page.html',
  styleUrls: ['./insights.page.scss'],
})
export class InsightPage implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  hasMXUser = false;
  isAltAccessUser = false;

  constructor(private mxService: MXService) {}

  ngOnInit(): void {
    const hasAltAccessUser = this.mxService.checkIsAltAccessUser().subscribe( altAccess => {
      this.isAltAccessUser = altAccess;
    });
    this.subscription.add(hasAltAccessUser);
    const hasMXUserSubscription = this.mxService
      .hasUser()
      .subscribe(hasUser => {
        this.hasMXUser = hasUser;
        this.mxService.displayWidget(WidgetType.PULSE, {
          id: 'pulse_widget',
          height: '100%',
          autoload: false,
        });
      });
    this.subscription.add(hasMXUserSubscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
