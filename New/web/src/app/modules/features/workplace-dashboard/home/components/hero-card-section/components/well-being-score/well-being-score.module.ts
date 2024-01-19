import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {WellBeingScoreComponent} from './well-being-score.component';
import {CatchUpTileModule} from '../../../catch-up-tile/catch-up-tile.module';

@NgModule({
  imports: [CommonModule, IonicModule, CatchUpTileModule],
  declarations: [WellBeingScoreComponent],
  exports: [WellBeingScoreComponent],
})
export class WellBeingScoreModule {}
