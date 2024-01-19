import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FinStrongScoreWidgetComponenet} from './finStrongScoreWidget.component';
import {MXWidgetModule} from '@shared-lib/components/mx-widget/mx-widget.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, IonicModule, MXWidgetModule,RouterModule],
  declarations: [FinStrongScoreWidgetComponenet],
  exports: [FinStrongScoreWidgetComponenet],
})
export class FinStrongScoreWidgetModule {}
