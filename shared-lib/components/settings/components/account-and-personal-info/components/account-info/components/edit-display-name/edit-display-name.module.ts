import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {EditDisplayNamePageRoutingModule} from './edit-display-name-routing.module';

import {EditDisplayNamePage} from './edit-display-name.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditDisplayNamePageRoutingModule,
  ],
  declarations: [EditDisplayNamePage],
})
export class EditDisplayNamePageModule {}
