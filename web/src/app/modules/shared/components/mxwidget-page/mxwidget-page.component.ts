import {Component, Input} from '@angular/core';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';

@Component({
  selector: 'app-mxwidget-page',
  templateUrl: './mxwidget-page.component.html',
  styleUrls: ['./mxwidget-page.component.scss'],
})
export class MXWidgetPageComponent {
  @Input() widgetType: WidgetType;
  @Input() headerName: string;
  @Input() height: string;
  @Input() tagName: string;
  @Input() widgetId: string;
}
