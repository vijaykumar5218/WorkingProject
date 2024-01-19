import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {WorkplaceDashboardRoutingModule} from './workplace-dashboard-routing.module';
import {WorkplaceDashboardPage} from './workplace-dashboard.page';

@NgModule({
  imports: [CommonModule, IonicModule, WorkplaceDashboardRoutingModule],
  declarations: [WorkplaceDashboardPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WorkplaceDashboardModule {}
