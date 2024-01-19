import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {AccountsPage} from './accounts.page';
import {AccountsPageRoutingModule} from './accounts-routing.module';
import {AccountSummaryModule} from '@shared-lib/modules/accounts/components/account-summary/account-summary.module';
import {FooterModuleDesktop} from '@web/app/modules/shared/components/footer/footer.module';
import {MXAccountListModule} from '@shared-lib/modules/accounts/components/mx-account-list/mx-account-list.module';
import {SpendingWidgetModule} from '@shared-lib/modules/accounts/components/spending-widget/spending-widget.module';
import {BudgetWidgetModule} from '@shared-lib/modules/accounts/components/budget-widget/budget-widget.module';
import {MXErrorComponentModule} from '@shared-lib/components/mx-error/mxerror.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountsPageRoutingModule,
    AccountSummaryModule,
    FooterModuleDesktop,
    MXAccountListModule,
    BudgetWidgetModule,
    SpendingWidgetModule,
    MXErrorComponentModule,
  ],
  declarations: [AccountsPage],
})
export class AccountsPageModule {}
