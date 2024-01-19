import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {AddAccountsPageRoutingModule} from './add-accounts-routing.module';
import {AddAccountsPage} from './add-accounts.page';
import {MXWidgetModule} from '@shared-lib/components/mx-widget/mx-widget.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddAccountsPageRoutingModule,
    MXWidgetModule,
  ],
  declarations: [AddAccountsPage],
  exports: [AddAccountsPage],
})
export class AddAccountsPageModule {}
