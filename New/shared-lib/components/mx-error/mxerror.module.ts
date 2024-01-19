import {CommonModule} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MXErrorComponent} from './mxerror.component';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [MXErrorComponent],
  exports: [MXErrorComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MXErrorComponentModule {}
