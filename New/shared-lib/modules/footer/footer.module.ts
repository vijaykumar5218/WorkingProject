import {CommonModule} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {FooterComponent} from './footer.component';
import {HTTP} from '@ionic-native/http/ngx';
import {TabsnavPage} from './tabsnav/tabsnav.component';

@NgModule({
  imports: [CommonModule],
  declarations: [FooterComponent, TabsnavPage],
  exports: [FooterComponent],
  providers: [HTTP],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FooterModule {}
