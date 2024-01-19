import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {ManageAccountsPageRoutingModule} from './manage-accounts-routing.module';
import {ManageAccountsPage} from './manage-accounts.page';
import {MXWidgetModule} from '@shared-lib/components/mx-widget/mx-widget.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageAccountsPageRoutingModule,
    MXWidgetModule,
  ],
  declarations: [ManageAccountsPage],
  exports: [ManageAccountsPage],
})
export class ManageAccountsPageModule {}
