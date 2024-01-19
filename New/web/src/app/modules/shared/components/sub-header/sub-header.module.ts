import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {SubHeaderComponent} from './sub-header.component';
@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [SubHeaderComponent],
  exports: [SubHeaderComponent],
})
export class SubHeaderComponentModule {}
