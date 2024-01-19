import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {StatusComponent} from './status.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [StatusComponent],
  exports: [StatusComponent],
})
export class StatusModule {}
