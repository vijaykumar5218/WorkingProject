import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FilterPopoverComponent} from './filter-popover.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule],
  declarations: [FilterPopoverComponent],
  exports: [FilterPopoverComponent],
})
export class FilterPopoverModule {}
