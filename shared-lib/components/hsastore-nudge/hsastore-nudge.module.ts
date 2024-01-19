import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {HSAStoreNudgeComponent} from './hsastore-nudge.component';
import {HSAStorePageModule} from '../../modules/accounts/hsastore/hsastore.module';

@NgModule({
  imports: [CommonModule, IonicModule, HSAStorePageModule],
  declarations: [HSAStoreNudgeComponent],
  exports: [HSAStoreNudgeComponent],
})
export class HSAStoreNudgeComponentModule {}
