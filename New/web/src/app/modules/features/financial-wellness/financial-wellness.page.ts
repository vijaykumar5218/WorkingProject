import {Component} from '@angular/core';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import * as nwContent from './constants/financial-wellness-page-content.json';

@Component({
  selector: 'app-financial-wellness-page',
  templateUrl: './financial-wellness.page.html',
  styleUrls: ['./financial-wellness.page.scss'],
})
export class FinancialWellnessPage {
  readonly widgetType = WidgetType;
  content: Record<string, string> = nwContent;
}
