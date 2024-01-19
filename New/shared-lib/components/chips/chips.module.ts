import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {ChipsComponent} from './chips.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [ChipsComponent],
  exports: [ChipsComponent],
})
export class ChipsModule {}
