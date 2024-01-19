import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoveragesRoutingModule} from './coverages-routing.module';
import {IonicModule} from '@ionic/angular';
import {CoveragesPage} from './coverages.page';

@NgModule({
  imports: [CommonModule, IonicModule, CoveragesRoutingModule],
  declarations: [CoveragesPage],
})
export class CoveragesModule {}
