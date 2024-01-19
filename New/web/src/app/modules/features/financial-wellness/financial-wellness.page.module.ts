import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {FinancialWellnessPage} from './financial-wellness.page';
import {FinancialWellnessPageRoutingModule} from './financial-wellness-routing.module';
import {MXWidgetPageModule} from '../../shared/components/mxwidget-page/mxwidget-page.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinancialWellnessPageRoutingModule,
    MXWidgetPageModule,
  ],
  declarations: [FinancialWellnessPage],
})
export class FinancialWellnessPageModule {}
