import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {BalanceHistoryGraphComponent} from './balance-history-graph.component';
import { BalanceHistoryModalComponent } from './balance-history-modal/balance-history-modal.component';
@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [BalanceHistoryGraphComponent, BalanceHistoryModalComponent],
  exports: [BalanceHistoryGraphComponent, BalanceHistoryModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BalanceHistoryGraphModule {}