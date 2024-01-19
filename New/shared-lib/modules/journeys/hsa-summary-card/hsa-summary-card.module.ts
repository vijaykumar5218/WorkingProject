import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalComponentModule} from '@shared-lib/modules/journeys/components/modal/modal.module';
import {IonicModule} from '@ionic/angular';
import {HSASummaryCardComponent} from './hsa-summary-card.component';
import {StepTableComponentModule} from '@shared-lib/components/table/table.component.module';
import {ProgressBarModule} from '@shared-lib/components/progress-bar/progress-bar.module';

@NgModule({
  declarations: [HSASummaryCardComponent],
  imports: [
    IonicModule,
    CommonModule,
    StepTableComponentModule,
    ProgressBarModule,
    ModalComponentModule,
  ],
  exports: [HSASummaryCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HSASummaryCardComponentModule {}
