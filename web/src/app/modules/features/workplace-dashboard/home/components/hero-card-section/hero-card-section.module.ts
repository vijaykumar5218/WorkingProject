import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {HeroCardSectionComponent} from './hero-card-section.component';
import {LandingAddAccountModule} from './components/landing-add-account/landing-add-account.module';
import {WellBeingScoreModule} from './components/well-being-score/well-being-score.module';
import {CarouselsModule} from './components/carousels/carousels.module';
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    LandingAddAccountModule,
    WellBeingScoreModule,
    CarouselsModule,
  ],
  declarations: [HeroCardSectionComponent],
  exports: [HeroCardSectionComponent],
})
export class HeroCardSectionModule {}
