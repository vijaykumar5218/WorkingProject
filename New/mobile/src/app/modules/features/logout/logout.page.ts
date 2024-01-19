import {Component, OnInit} from '@angular/core';
import {LoadingController, ViewDidEnter, ViewWillEnter} from '@ionic/angular';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {AuthenticationService} from '../../shared/service/authentication/authentication.service';
import * as landingText from './constants/logout-content.json';
import {LogoutContent} from './models/logout.model';
import {LogoutService} from './service/logout.service';
import {LandingService} from '../landing/service/landing.service';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderFooterTypeService} from '@shared-lib/services/header-footer-type/headerFooterType.service';
import {AuthenticationChange} from '../../shared/service/authentication/models/authenticationChange.model';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements ViewDidEnter, OnInit, ViewWillEnter {
  pageText: Record<string, string> = landingText;
  logoutContent: LogoutContent;
  reloading = false;

  constructor(
    private authService: AuthenticationService,
    private headerFooterService: HeaderFooterTypeService,
    private logoutService: LogoutService,
    private baseService: BaseService,
    private loadingController: LoadingController,
    private landingService: LandingService
  ) {}

  async ngOnInit() {
    this.authService.authenticationChange$.subscribe(
      this.authenticationChanged.bind(this)
    );

    this.logoutContent = await this.logoutService.getLogoutContent();
  }

  async authenticationChanged(isAuth: AuthenticationChange) {
    if (isAuth.auth && !isAuth.attested) {
      const loading = await this.loadingController.create({
        translucent: true,
      });
      loading.present();

      const result = await this.landingService.checkMyvoyageAccess();

      if (result.enableMyVoyage === 'Y') {
        this.baseService.navigateByUrl('home');
      } else {
        this.baseService.navigateByUrl('no-access');
      }

      loading.dismiss();
    }
  }

  ionViewWillEnter(): void {
    this.reloading = this.authService.reloading;
  }

  async ionViewDidEnter() {
    this.headerFooterService.publishType(
      {type: HeaderType.none},
      {type: FooterType.none}
    );
  }

  async signInClicked() {
    this.authService.openLogin();
  }
}
