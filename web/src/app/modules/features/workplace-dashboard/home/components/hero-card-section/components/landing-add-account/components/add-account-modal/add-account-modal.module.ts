import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {AddAccountModalComponent} from '@web/app/modules/features/workplace-dashboard/home/components/landing-add-account/components/add-account-modal/add-account-modal.component';
import {AddAccountsPageModule} from '@shared-lib/modules/accounts/add-accounts/add-accounts.module';

@NgModule({
  imports: [CommonModule, IonicModule, AddAccountsPageModule],
  declarations: [AddAccountModalComponent],
  exports: [AddAccountModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddAccountModalModule {}
