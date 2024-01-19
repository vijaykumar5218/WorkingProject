import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InsightsRoutingModule} from './insights-routing.module';
import {MXWidgetModule} from '@shared-lib/components/mx-widget/mx-widget.module';
import {InsightsComponent} from './insights.component';

@NgModule({
  declarations: [InsightsComponent],
  imports: [CommonModule, InsightsRoutingModule, MXWidgetModule],
})
export class InsightsModule {}
