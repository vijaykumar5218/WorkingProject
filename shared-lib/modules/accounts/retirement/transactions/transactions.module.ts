import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {TransactionsPageRoutingModule} from './transactions-routing.module';
import {TransactionsPage} from './transactions.page';
import {LoadingTextComponentModule} from '@shared-lib/components/loading-text/loading-text.module';
import {FilterSortComponent} from '../../components/filter-sort/filter-sort.component';
import {FilterPopoverModule} from '../../../../components/filter-popover/filter-popover.module';
import {SortPopoverModule} from '../../../../components/sort-popover/sort-popover.module';
import {HSAStoreNudgeComponentModule} from '@shared-lib/components/hsastore-nudge/hsastore-nudge.module';
import {ChipsModule} from '@shared-lib/components/chips/chips.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransactionsPageRoutingModule,
    LoadingTextComponentModule,
    FilterPopoverModule,
    SortPopoverModule,
    HSAStoreNudgeComponentModule,
    ChipsModule,
  ],
  declarations: [TransactionsPage, FilterSortComponent],
})
export class TransactionsPageModule {}
