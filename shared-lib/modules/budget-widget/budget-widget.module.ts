import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {BudgetWidgetPageRoutingModule} from './budget-widget-routing.module';
import {BudgetWidgetPage} from './budget-widget.page';
import {MXWidgetModule} from '@shared-lib/components/mx-widget/mx-widget.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BudgetWidgetPageRoutingModule,
    MXWidgetModule,
  ],
  declarations: [BudgetWidgetPage],
})
export class BudgetWidgetPageModule {}
