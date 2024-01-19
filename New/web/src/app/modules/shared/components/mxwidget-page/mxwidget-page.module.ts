import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {MXWidgetPageComponent} from './mxwidget-page.component';
import {MXWidgetModule} from '@shared-lib/components/mx-widget/mx-widget.module';
import {SubHeaderNavComponentModule} from '../sub-header-full/sub-header-nav.module';
import {FooterModuleDesktop} from '../footer/footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MXWidgetModule,
    SubHeaderNavComponentModule,
    FooterModuleDesktop,
  ],
  declarations: [MXWidgetPageComponent],
  exports: [MXWidgetPageComponent],
})
export class MXWidgetPageModule {}
