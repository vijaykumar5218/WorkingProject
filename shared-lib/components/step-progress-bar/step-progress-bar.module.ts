import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {StepProgressBarComponent} from './step-progress-bar.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [StepProgressBarComponent],
  exports: [StepProgressBarComponent],
})
export class StepProgressBarComponentModule {}
