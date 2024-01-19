import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AccountService} from '@shared-lib/services/account/account.service';
import {ViewWillEnter} from '@ionic/angular';
import {MXWidgetComponent} from '@shared-lib/components/mx-widget/mx-widget.component';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss'],
})
export class InsightsComponent implements OnInit, ViewWillEnter {
  readonly widgetType = WidgetType;
  @ViewChild('container', {read: ElementRef, static: true})
  contentView: ElementRef;
  @ViewChild(MXWidgetComponent) widget: MXWidgetComponent;

  height: string;
  firstLoad = true;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.height = this.contentView.nativeElement.offsetHeight + 30 + 'px';
  }

  ionViewWillEnter() {
    this.accountService.publishSelectedTab('insights');

    if (!this.firstLoad) {
      this.widget.refreshWidget();
    }
    this.firstLoad = false;
  }
}
