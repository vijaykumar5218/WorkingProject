import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {SubHeaderComponentModule} from '@web/app/modules/shared/components/sub-header/sub-header.module';
import {AllCovergesPage} from './all-coverages.page';
import {AllCoveragesPageRoutingModule} from './all-coverages-routing.module';
import {GotConsentComponentModule} from '@shared-lib/components/got-consent/got-consent.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubHeaderComponentModule,
    AllCoveragesPageRoutingModule,
    GotConsentComponentModule,
  ],
  declarations: [AllCovergesPage],
  exports: [AllCovergesPage],
  providers: [],
})
export class AllCovergesPageModule {}
