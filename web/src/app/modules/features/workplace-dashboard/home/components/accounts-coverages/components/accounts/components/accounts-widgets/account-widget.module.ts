import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {AccountWidgetsComponent} from './account-widget.component';
import {MXWidgetModule} from '@shared-lib/components/mx-widget/mx-widget.module';
import {AccountWidgetModalModule} from '@web/app/modules/features/workplace-dashboard/home/components/accounts-coverages/components/accounts/components/accounts-widgets/components/account-widget-modal/account-widget-modal.component.module';
import {AddAccountNudgeComponentModule} from '@shared-lib/components/home/add-account-nudge/add-account-nudge.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    MXWidgetModule,
    AccountWidgetModalModule,
    AddAccountNudgeComponentModule,
  ],
  declarations: [AccountWidgetsComponent],
  exports: [AccountWidgetsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AccountWidgetModule {}
