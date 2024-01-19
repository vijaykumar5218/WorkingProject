import {Component} from '@angular/core';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import * as nwContent from './constants/net-worth-page-content.json';

@Component({
  selector: 'app-net-worth-widget',
  styleUrls: ['./net-worth.page.scss'],
  templateUrl: './net-worth.page.html',
})
export class NetWorthPage {
  readonly widgetType = WidgetType;
  content: Record<string, string> = nwContent;
}
