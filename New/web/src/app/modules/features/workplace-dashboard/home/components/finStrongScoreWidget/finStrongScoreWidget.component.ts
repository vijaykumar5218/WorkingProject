import {Component, Input} from '@angular/core';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import * as PageText from './constants/content.json';

@Component({
  selector: 'app-finStrongScoreWidget',
  templateUrl: './finStrongScoreWidget.component.html',
  styleUrls: ['./finStrongScoreWidget.component.scss'],
})
export class FinStrongScoreWidgetComponenet {
  @Input() miniFinstrong: string;
  @Input() isAltAccessUser : boolean;
  readonly widgetType: WidgetType = WidgetType.FINSTRONG_MINI;
  pageText = (PageText as any).default;
}
