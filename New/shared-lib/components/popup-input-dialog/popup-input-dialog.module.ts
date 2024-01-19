import {CommonModule} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {IntegerInputDirective} from './directives/integer-input.directive';
import {PopupInputDialogComponent} from './popup-input-dialog.component';
import {LegalComponentModule} from '../settings/components/account-and-personal-info/components/account-info/components/legal/legal.module';

@NgModule({
  imports: [CommonModule, LegalComponentModule],
  declarations: [PopupInputDialogComponent, IntegerInputDirective],
  exports: [PopupInputDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PopupInputDialogModule {}
