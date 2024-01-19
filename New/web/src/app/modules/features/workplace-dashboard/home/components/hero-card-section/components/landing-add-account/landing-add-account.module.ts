import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {AddAccountModalComponent} from './components/add-account-modal/add-account-modal.component';
import {CatchUpTileModule} from '../../../catch-up-tile/catch-up-tile.module';
import {LandingAddAccountComponent} from './landing-add-account.component';

@NgModule({
  imports: [CommonModule, IonicModule, CatchUpTileModule],
  declarations: [LandingAddAccountComponent, AddAccountModalComponent],
  exports: [LandingAddAccountComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LandingAddAccountModule {}
