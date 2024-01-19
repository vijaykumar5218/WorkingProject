import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {SavviRoutingModule} from './savvi-routing.module';
import {SavviComponent} from './savvi.component';
import {EnrollmentGuidanceComponent} from './components/enrollment-guidance/enrollment-guidance.component';

@NgModule({
  imports: [CommonModule, IonicModule, SavviRoutingModule],
  declarations: [SavviComponent, EnrollmentGuidanceComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SavviModule {}
