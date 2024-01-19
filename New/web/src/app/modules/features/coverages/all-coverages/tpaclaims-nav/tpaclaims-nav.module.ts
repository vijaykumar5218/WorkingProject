import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {TPAClaimsNavPageRoutingModule} from './tpaclaims-nav-routing.module';

import {TPAClaimsNavPage} from './tpaclaims-nav.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TPAClaimsNavPageRoutingModule,
  ],
  declarations: [TPAClaimsNavPage],
})
export class TPAClaimsNavPageModule {}
