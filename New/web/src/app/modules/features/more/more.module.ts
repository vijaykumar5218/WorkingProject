import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {MorePage} from './more.page';
import {MorePageRoutingModule} from './more-routing.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, MorePageRoutingModule],
  declarations: [MorePage],
})
export class MorePageModule {}
