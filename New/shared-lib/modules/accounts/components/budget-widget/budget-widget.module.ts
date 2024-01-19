import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {BudgetWidgetComponent} from './budget-widget.component';
import {MXWidgetModule} from '@shared-lib/components/mx-widget/mx-widget.module';
@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, MXWidgetModule],
  declarations: [BudgetWidgetComponent],
  exports: [BudgetWidgetComponent],
})
export class BudgetWidgetModule {}
