//as-of.module
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {AsOfComponent} from './as-of.component';
import {LoadingTextComponentModule} from '@shared-lib/components/loading-text/loading-text.module';
import {LoadingComponentModule} from '@shared-lib/components/loading/loading.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadingTextComponentModule,
    LoadingComponentModule,
  ],
  declarations: [AsOfComponent],
  exports: [AsOfComponent],
})
export class AsOfComponentModule {}
