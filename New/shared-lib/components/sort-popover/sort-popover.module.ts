import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {SortPopoverComponent} from './sort-popover.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule],
  declarations: [SortPopoverComponent],
  exports: [SortPopoverComponent],
})
export class SortPopoverModule {}
