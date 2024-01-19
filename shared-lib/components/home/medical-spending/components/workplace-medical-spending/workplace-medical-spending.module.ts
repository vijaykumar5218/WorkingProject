import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {WorkplaceMedicalSpendingComponent} from './workplace-medical-spending.component';
import {TPAStreamConnectPageModule} from '@shared-lib/components/coverages/tpastream-connect/tpastream-connect.module';

@NgModule({
  imports: [CommonModule, IonicModule, TPAStreamConnectPageModule],
  declarations: [WorkplaceMedicalSpendingComponent],
  exports: [WorkplaceMedicalSpendingComponent],
})
export class WorkplaceMedicalSpendingModule {}
