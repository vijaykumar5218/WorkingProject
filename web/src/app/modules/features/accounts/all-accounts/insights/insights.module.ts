import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {InsightPage} from './insights.page';
import {InsightPageRoutingModule} from './insights-routing.module';
@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, InsightPageRoutingModule],
  declarations: [InsightPage],
  exports: [InsightPage],
})
export class InsightPageModule {}
