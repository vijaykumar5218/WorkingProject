import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {MedicalSpendingComponent} from './medical-spending.component';
import {WorkplaceMedicalSpendingModule} from './components/workplace-medical-spending/workplace-medical-spending.module';

@NgModule({
  imports: [CommonModule, IonicModule, WorkplaceMedicalSpendingModule],
  declarations: [MedicalSpendingComponent],
  exports: [MedicalSpendingComponent],
})
export class MedicalSpendingModule {}
