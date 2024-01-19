import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {AuthenticationService} from '../../shared/service/authentication/authentication.service';
import * as landingText from './constants/landing-content.json';
import {LaunchContentPage} from './models/landing.model';
import {LandingService} from './service/landing.service';
import Swiper from 'swiper';
import {Status} from '@shared-lib/constants/status.enum';
import {LoadingController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderFooterTypeService} from '@shared-lib/services/header-footer-type/headerFooterType.service';
import {HomeService} from '@shared-lib/services/home/home.service';
import {AccessService} from '../../../../../../shared-lib/services/access/access.service';
import {AuthenticationChange} from '../../shared/service/authentication/models/authenticationChange.model';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit, OnDestroy {
  pageText: Record<string, string> = landingText;
  firstTimeLoad = true;
  hasFaceIDSession = false;
  landingSteps: LaunchContentPage[];
  slideOpts: Record<string, number | boolean> = {
    slidesPerView: 1,
    centeredSlides: true,
  };
  slides: Swiper;
  pageWidth: string;
  currentStep = 0;
  biometricsIcon;
  biometricsText;
  reloading = false;
  subscription = new Subscription();
  signInDisabled = false;

  constructor(
    private authService: AuthenticationService,
    private headerFooterTypeService: HeaderFooterTypeService,
    private landingService: LandingService,
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private loadingController: LoadingController,
    private homeService: HomeService,
    private accessService: AccessService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.authService.authenticationChange$.subscribe(
        this.authenticationChanged.bind(this)
      )
    );
    this.subscription.add(
      this.authService.biometricsAuthenticationChange$.subscribe(
        this.biometricsAuthenticationChanged.bind(this)
      )
    );
  }

  async ionViewWillEnter() {
    this.reloading = this.authService.reloading;
    this.headerFooterTypeService.publishType(
      {
        type: HeaderType.none,
      },
      {
        type: FooterType.none,
      }
    );

    this.landingSteps = (
      await this.landingService.getLandingContent()
    ).MobileLaunchContent;
    this.landingSteps[0].status = Status.completed;

    this.pageWidth = window.innerWidth * 0.8 + 'px';

    this.biometricsIcon = await this.authService.getBiometricsIconName();
    this.biometricsText = await this.authService.getBiometricsLabel();

    this.checkFaceIdSession();

    this.route.queryParams.subscribe(async params => {
      if (this.firstTimeLoad && !params?.noAutoLogin) {
        await this.authService.attemptFaceIDLogin();
        this.firstTimeLoad = false;

        //If has prev non-faceid session. Revoke old tokens.
        this.checkOldSessionAndRevoke();
      }
    });

    this.landingService.openVersionAlert();
  }

  async checkFaceIdSession() {
    try {
      this.hasFaceIDSession = await this.authService.hasFaceIDSession();
    } catch (ex) {
      this.hasFaceIDSession = false;
    }
  }

  biometricsAuthenticationChanged(isAuth: boolean) {
    if (isAuth) {
      this.homeService.initializeAppForUser();
    }
  }

  async authenticationChanged(isAuth: AuthenticationChange) {
    if (isAuth.auth && !isAuth.attested) {
      const loading = await this.loadingController.create({
        translucent: true,
      });
      loading.present();

      const valid = await this.landingService.validateApplication();
      if (!valid) {
        alert(this.pageText.failedAttest);
        await this.authService.logoutAndRevoke();
        loading.dismiss();
        return;
      }
      this.authService.onAuthChange({auth: true, attested: true});
      const result = await this.landingService.checkMyvoyageAccess();
      this.accessService.checkLastPreferenceUpdated();

      if (result.enableMyVoyage === 'Y') {
        this.homeService.initializeAppForUser();

        const show = await this.authService.shouldShowBiometricsScreen();
        if (show) {
          this.landingService.navigateByUrl('biometrics');
        } else {
          this.authService.navigateToLoggedInLanding();
        }
      } else {
        this.landingService.navigateByUrl('no-access');
      }

      loading.dismiss();
    }
  }

  async checkOldSessionAndRevoke() {
    const hasSession = await this.authService.hasNonFaceIDSession();
    if (hasSession) {
      await this.authService.logoutAndRevoke();
    }
  }

  loginFaceID() {
    this.authService.attemptFaceIDLogin();
  }

  async signInClicked() {
    this.signInDisabled = true;
    const loading = await this.loadingController.create({
      translucent: true,
    });
    loading.present();

    await this.authService.openLogin();

    this.checkFaceIdSession();

    loading.dismiss();
    this.signInDisabled = false;
  }

  async registerClicked() {
    this.signInDisabled = true;
    const loading = await this.loadingController.create({
      translucent: true,
    });
    loading.present();

    await this.authService.openRegister();

    this.checkFaceIdSession();

    loading.dismiss();
    this.signInDisabled = false;
  }

  setSwiperInstance(swiper: Swiper) {
    this.slides = swiper;
  }

  openLink(url: string) {
    this.landingService.openInBrowser(url);
  }

  handleSlideChange() {
    this.ngZone.run(() => {
      this.currentStep = this.slides.activeIndex;
      this.landingSteps[this.currentStep].status = Status.completed;
      if (this.currentStep + 1 < this.landingSteps.length) {
        this.landingSteps[this.currentStep + 1].status = Status.notStarted;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
