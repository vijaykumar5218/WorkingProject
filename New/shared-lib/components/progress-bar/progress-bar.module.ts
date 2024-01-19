import {CommonModule} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {ProgressBarComponent} from './progress-bar.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ProgressBarComponent],
  exports: [ProgressBarComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProgressBarModule {}
