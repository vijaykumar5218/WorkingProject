import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {ContentLinkComponent} from './contentLink.component';
import {AddChildButtonComponent} from '../add-child-button/add-child-button.component';
import {IconTextButtonComponent} from '@shared-lib/modules/journeys/components/icon-text-button/icon-text-button.component';

@NgModule({
  imports: [IonicModule, CommonModule],
  declarations: [
    ContentLinkComponent,
    AddChildButtonComponent,
    IconTextButtonComponent,
  ],
  exports: [ContentLinkComponent, IconTextButtonComponent],
})
export class ContentLinkModalComponentModule {}
