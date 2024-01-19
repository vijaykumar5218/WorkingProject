import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {WorkplaceHomePage} from './home.page';
import {WorkplaceHomePageRoutingModule} from './home-routing.module';
import {GreetingComponent} from './components/greeting/greeting.component';
import {FooterModuleDesktop} from '../../../shared/components/footer/footer.module';
import {LandingAddAccountModule} from './components/hero-card-section/components/landing-add-account/landing-add-account.module';
import {AccountsAndCoveragesComponentsModule} from './components/accounts-coverages/accounts-coverages.module';
import {RecommendedJourneyModule} from '../../../shared/components/recommended-journey/recommended-journey.module';
import {MoreResourcesComponent} from './components/more-resources/more-resources.component';
import {WellBeingScoreModule} from './components/hero-card-section/components/well-being-score/well-being-score.module';
import {CatchUpTileModule} from './components/catch-up-tile/catch-up-tile.module';
import {BenefitsBannerModule} from './components/benfits-banner/benefits-banner.module';
import {HeroCardSectionModule} from './components/hero-card-section/hero-card-section.module';
import {OrangeMoneyModule} from './components/orange-money/orange-money.module';
import {FinStrongScoreWidgetModule} from './components/finStrongScoreWidget/finStrongScoreWidget.module';
import {AdvisorsComponent} from './components/advisors/advisors.component';
import {SnapshotComponent} from './components/snapshot/snapshot.component';
import {MoneyOutComponent} from './components/money-out/money-out.component';
import {TranslationCardSectionComponent} from './components/translation-card-section/translation-card-section.component';
import {BillingPaymentsComponent} from './components/myBenefitsUser/components/billing-payments/billing-payments.component';
import {ClaimsComponent} from './components/myBenefitsUser/components/claims/claims.component';
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    WorkplaceHomePageRoutingModule,
    FooterModuleDesktop,
    AccountsAndCoveragesComponentsModule,
    LandingAddAccountModule,
    RecommendedJourneyModule,
    WellBeingScoreModule,
    CatchUpTileModule,
    BenefitsBannerModule,
    HeroCardSectionModule,
    OrangeMoneyModule,
    FinStrongScoreWidgetModule,
  ],
  declarations: [
    WorkplaceHomePage,
    GreetingComponent,
    MoreResourcesComponent,
    AdvisorsComponent,
    MoneyOutComponent,
    SnapshotComponent,
    TranslationCardSectionComponent,
    BillingPaymentsComponent,
    ClaimsComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WorkplaceHomePageModule {}
