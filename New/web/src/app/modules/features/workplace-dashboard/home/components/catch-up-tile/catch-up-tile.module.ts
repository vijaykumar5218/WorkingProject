import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {CatchUpTileComponent} from './catch-up-tile.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [CatchUpTileComponent],
  exports: [CatchUpTileComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CatchUpTileModule {}
