import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {LineComponent} from './line.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [LineComponent],
  exports: [LineComponent],
})
export class LineModule {}
