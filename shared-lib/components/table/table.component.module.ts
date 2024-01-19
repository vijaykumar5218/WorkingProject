import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {IonicModule} from '@ionic/angular';
import {StepTableComponent} from './table.component';
import {HelpComponentModule} from '@shared-lib/modules/journeys/journey/steps/step/help/help.component.module';

@NgModule({
  declarations: [StepTableComponent],
  imports: [IonicModule, CommonModule, HelpComponentModule],
  exports: [StepTableComponent],
})
export class StepTableComponentModule {}
