import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {PlanTransactionsComponent} from './plan-transactions.component';
import {ConsentRequiredComponentModule} from '@shared-lib/components/coverages/consent-required/consent-required.module';
import {MedDisclaimerModule} from '../../med-disclaimer/med-disclaimer.module';
import {LoadingComponentModule} from '@shared-lib/components/loading/loading.module';
import {DateRangeFilterComponent} from './date-range-filter/date-range-filter.component';
import {FilterPopoverModule} from '../../../filter-popover/filter-popover.module';
import {SortPopoverModule} from '../../../sort-popover/sort-popover.module';
import {ChipsModule} from '@shared-lib/components/chips/chips.module';
import {ModalHeaderComponentModule} from '../../../modal-header/modal-header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsentRequiredComponentModule,
    MedDisclaimerModule,
    LoadingComponentModule,
    FilterPopoverModule,
    SortPopoverModule,
    ChipsModule,
    ModalHeaderComponentModule,
  ],
  declarations: [PlanTransactionsComponent, DateRangeFilterComponent],
  exports: [PlanTransactionsComponent],
})
export class PlanTransactionsComponentModule {}
