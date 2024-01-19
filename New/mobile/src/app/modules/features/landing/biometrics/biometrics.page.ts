import {Component, OnInit} from '@angular/core';
import {AlertController, Platform, ViewWillEnter} from '@ionic/angular';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {AuthenticationService} from '@mobile/app/modules/shared/service/authentication/authentication.service';
import {VaultService} from '../../../shared/service/authentication/vault.service';
import {HeaderFooterTypeService} from '@shared-lib/services/header-footer-type/headerFooterType.service';
import * as bioText from './constants/biometrics-content.json';
import {HeaderType} from '@shared-lib/constants/headerType.enum';

@Component({
  selector: 'app-biometrics',
  templateUrl: './biometrics.page.html',
  styleUrls: ['./biometrics.page.scss'],
})
export class BiometricsPage implements ViewWillEnter, OnInit {
  pageText: Record<string, string> = bioText;
  bioIcon: string;
  bioText: string;
  faceIDEnabled = false;

  constructor(
    private vaultService: VaultService,
    private headerFooterService: HeaderFooterTypeService,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private platform: Platform
  ) {}

  async ngOnInit(): Promise<void> {
    this.bioIcon = await this.authService.getBiometricsIconName();
    this.bioText = await this.authService.getBiometricsLabel();
  }

  ionViewWillEnter(): void {
    this.headerFooterService.publishType(
      {
        type: HeaderType.navbar,
        actionOption: {
          displayLogo: true,
          headername: '',
        },
      },
      {type: FooterType.none}
    );
  }

  async showError() {
    const alert = await this.alertController.create({
      header: this.pageText.biometricsError,
      buttons: ['OK'],
    });
    alert.present();
  }

  async continueClicked() {
    const result = await this.biometricsChanged();
    if (!result) {
      this.showError();
      return;
    }

    if (this.faceIDEnabled) {
      if (this.platform.is('ios')) {
        await this.vaultService.lockVault();
        await this.vaultService.unlockVault();
      }

      const isLocked = await this.vaultService.isLocked();
      if (!isLocked) {
        this.authService.navigateToLoggedInLanding();
      }
    } else {
      this.authService.navigateToLoggedInLanding();
    }
  }

  async biometricsChanged(): Promise<boolean> {
    if (this.faceIDEnabled) {
      const result = await this.vaultService.enableFaceID();
      if (result) {
        this.vaultService.setDefaultFaceIDDisabled(false);
      } else {
        this.faceIDEnabled = false;
      }
      return result;
    } else {
      this.vaultService.disableFaceID();
      this.vaultService.setDefaultFaceIDDisabled(true);
      return true;
    }
  }
}
