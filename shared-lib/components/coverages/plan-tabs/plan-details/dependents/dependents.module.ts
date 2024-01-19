//as-of.module
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {LoadingTextComponentModule} from '@shared-lib/components/loading-text/loading-text.module';
import {DependentsComponent} from './dependents.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, LoadingTextComponentModule],
  declarations: [DependentsComponent],
  exports: [DependentsComponent],
})
export class DependentsComponentModule {}
