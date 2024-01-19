import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {AccountListComponent} from './account-list.component';
@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [AccountListComponent],
  exports: [AccountListComponent],
})
export class AccountListModule {}
