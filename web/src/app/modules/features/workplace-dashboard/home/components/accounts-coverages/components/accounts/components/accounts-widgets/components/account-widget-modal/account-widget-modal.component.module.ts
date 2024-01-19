import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {AccountWidgetModal} from './account-widget-modal.component';
import {MXWidgetModule} from '@shared-lib/components/mx-widget/mx-widget.module';

@NgModule({
  imports: [CommonModule, IonicModule, MXWidgetModule],
  declarations: [AccountWidgetModal],
  exports: [AccountWidgetModal],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AccountWidgetModalModule {}
