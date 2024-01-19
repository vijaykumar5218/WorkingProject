import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {HeaderComponent} from './header.component';
import {MyvoyageHeaderComponent} from './components/myvoyage-header/myvoyage-header.component';
import {DashboardHeaderComponent} from './components/dashboard-header/dashboard-header.component';
@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [
    MyvoyageHeaderComponent,
    HeaderComponent,
    DashboardHeaderComponent,
  ],
  exports: [HeaderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HeaderModule {}
