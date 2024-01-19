import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {MXAccountListComponent} from './mx-account-list.component';
@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [MXAccountListComponent],
  exports: [MXAccountListComponent],
})
export class MXAccountListModule {}
