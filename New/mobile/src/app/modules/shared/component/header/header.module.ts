import {CommonModule} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {HeaderComponent} from './header.component';
import {NavbarComponent} from './navbar/navbar.component';
import {HTTP} from '@ionic-native/http/ngx';
import {SimplePage} from './simple/simple.page';

@NgModule({
  imports: [CommonModule],
  declarations: [HeaderComponent, NavbarComponent, SimplePage],
  exports: [HeaderComponent],
  providers: [HTTP],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HeaderModule {}
