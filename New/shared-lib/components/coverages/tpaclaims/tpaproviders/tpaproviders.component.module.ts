import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {TPAProvidersComponent} from './tpaproviders.component';
import {LoadingComponentModule} from '@shared-lib/components/loading/loading.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, LoadingComponentModule],
  declarations: [TPAProvidersComponent],
  exports: [TPAProvidersComponent],
})
export class TPAProvidersComponentModule {}
