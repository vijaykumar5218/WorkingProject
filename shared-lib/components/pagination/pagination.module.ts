import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {PaginationComponent} from './pagination.component';
import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [PaginationComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [PaginationComponent, NgxPaginationModule],
})
export class PaginationModule {}
