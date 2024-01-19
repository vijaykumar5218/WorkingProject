import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {IonicModule} from '@ionic/angular';
import {ExpandCollapseComponent} from './expand-collapse.component';

@NgModule({
  declarations: [ExpandCollapseComponent],
  imports: [IonicModule, CommonModule],
  exports: [ExpandCollapseComponent],
})
export class ExpandCollapseComponentModule {}
