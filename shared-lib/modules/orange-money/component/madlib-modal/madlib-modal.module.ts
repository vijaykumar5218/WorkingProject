import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {HelpPopoverComponent} from './help-popover/help-popover.component';
import {MadlibModalComponent} from './madlib-modal.component';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule],
  declarations: [MadlibModalComponent, HelpPopoverComponent],
  exports: [MadlibModalComponent],
})
export class MadlibModalComponentModule {}
