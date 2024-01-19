import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {SubHeaderNavComponent} from './sub-header-nav.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [SubHeaderNavComponent],
  exports: [SubHeaderNavComponent],
})
export class SubHeaderNavComponentModule {}
