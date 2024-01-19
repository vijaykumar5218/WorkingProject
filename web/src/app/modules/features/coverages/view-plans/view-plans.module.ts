import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {SubHeaderComponentModule} from '@web/app/modules/shared/components/sub-header/sub-header.module';
import {ViewPlansPage} from './view-plans.page';
import {ViewPlansPageRoutingModule} from './view-plans-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubHeaderComponentModule,
    ViewPlansPageRoutingModule,
  ],
  declarations: [ViewPlansPage],
  exports: [ViewPlansPage],
})
export class ViewPlansPageModule {}
