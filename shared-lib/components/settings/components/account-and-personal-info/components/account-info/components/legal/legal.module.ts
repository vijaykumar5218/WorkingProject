import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {LegalComponent} from './legal.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [LegalComponent],
  exports: [LegalComponent],
})
export class LegalComponentModule {}
