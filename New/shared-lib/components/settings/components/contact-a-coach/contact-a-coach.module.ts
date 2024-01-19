import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {ContactACoachPageRoutingModule} from './contact-a-coach-routing.module';
import {ContactACoachPage} from './contact-a-coach.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactACoachPageRoutingModule,
  ],
  exports: [ContactACoachPage],
  declarations: [ContactACoachPage],
})
export class ContactACoachPageModule {}
