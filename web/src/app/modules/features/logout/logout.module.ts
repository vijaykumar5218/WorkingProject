import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {LogoutPage} from './logout.page';
import {LogoutPageRoutingModule} from './logout-routing.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, LogoutPageRoutingModule],
  declarations: [LogoutPage],
})
export class LogoutPageModule {}
