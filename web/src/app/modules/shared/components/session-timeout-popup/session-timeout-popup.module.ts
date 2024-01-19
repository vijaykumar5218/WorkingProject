import {CommonModule} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {SessionTimeoutPopupComponent} from './session-timeout-popup.component';

@NgModule({
  imports: [CommonModule],
  declarations: [SessionTimeoutPopupComponent],
  exports: [SessionTimeoutPopupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SessionTimeoutPopupModule {}
