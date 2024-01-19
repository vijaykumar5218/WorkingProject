import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {UnExpectedExpensesSummaryCardComponent} from './unexpected-summary-card.component';
import {StepTableComponentModule} from '@shared-lib/components/table/table.component.module';
import {ProgressBarModule} from '@shared-lib/components/progress-bar/progress-bar.module';

@NgModule({
  declarations: [UnExpectedExpensesSummaryCardComponent],
  imports: [
    IonicModule,
    CommonModule,
    StepTableComponentModule,
    ProgressBarModule,
  ],
  exports: [UnExpectedExpensesSummaryCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UnExpectedExpensesSummaryCardComponentModule {}
