import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {CarouselsComponent} from './carousels.component';
import {PaginationModule} from '@shared-lib/components/pagination/pagination.module';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [CommonModule, IonicModule, PaginationModule, RouterModule],
  declarations: [CarouselsComponent],
  exports: [CarouselsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CarouselsModule {}
