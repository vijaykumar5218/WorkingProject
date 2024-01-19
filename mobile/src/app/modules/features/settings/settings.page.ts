import {MenuConfig} from '@shared-lib/components/settings/components/menu/model/menuConfig.model';
import {Component, OnInit} from '@angular/core';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderFooterTypeService} from '@shared-lib/services/header-footer-type/headerFooterType.service';
import * as settingsOption from '@shared-lib/components/settings/constants/settingsOption.json';
import {AuthenticationService} from '../../shared/service/authentication/authentication.service';
import {VaultService} from '../../shared/service/authentication/vault.service';
import {ModalController, Platform} from '@ionic/angular';
import {AlertComponent} from '@shared-lib/components/alert/alert.component';
import {SettingsService} from '@shared-lib/services/settings/settings.service';
import {SettingsDisplayFlags} from '@shared-lib/services/settings/models/settings.model';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  menuConfig: MenuConfig = {items: []};
  options = JSON.parse(JSON.stringify(settingsOption)).default;
  actionOption: ActionOptions = {
    headername: 'More',
    btnright: true,
    buttonRight: {
      name: '',
      link: 'notification',
    },
  };
  faceIDEnabled = false;
  faceIDAllowed = false;
  biometricsText: string;
  biometricsIcon: string;
  marginTop = '28px';
  loading = true;
  constructor(
    private headerFooterType: HeaderFooterTypeService,
    private authService: AuthenticationService,
    private vaultService: VaultService,
    private platform: Platform,
    private modalController: ModalController,
    private settingsService: SettingsService
  ) {}

  async ngOnInit() {
    const settingsDisplayFlags = await this.settingsService.getSettingsDisplayFlags();
    this.setMenuItems(settingsDisplayFlags);
  }

  async ionViewWillEnter() {
    this.headerFooterType.publishType(
      {
        type: HeaderType.navbar,
        actionOption: this.actionOption,
      },
      {type: FooterType.tabsnav}
    );

    this.faceIDAllowed = await this.vaultService.isFaceIDAvailableOnDevice();
    this.faceIDEnabled = this.vaultService.isFaceIDEnabled();
    this.biometricsText = await this.authService.getBiometricsLabel();
    this.biometricsIcon = await this.authService.getBiometricsIconName();
    if (this.platform.is('ios')) {
      this.marginTop = '24px';
    }
  }

  setMenuItems(settingsDisplayFlags: SettingsDisplayFlags) {
    let route;
    for (const option of this.options.option) {
      if (
        option.id === 'feedback' ||
        option.text === 'Terms of Use' ||
        option.id == 'manageAccounts'
      ) {
        route = '';
      } else {
        route = '/settings/';
      }
      if (
        option.id !== 'contactAdvisor' ||
        settingsDisplayFlags.displayContactLink
      ) {
        this.menuConfig.items.push({
          id: option.id,
          route: route + option.url,
          text: option.text,
          icon: option.icon,
        });
      }
    }
    this.loading = false;
  }

  onFaceIDChanged() {
    const faceIDEnabled = this.vaultService.isFaceIDEnabled();
    if (this.faceIDEnabled && !faceIDEnabled) {
      this.vaultService.enableFaceID().then(result => {
        if (result) {
          this.vaultService.setDefaultFaceIDDisabled(false);
        } else {
          this.faceIDEnabled = false;
        }
      });
    } else if (!this.faceIDEnabled && faceIDEnabled) {
      this.vaultService.disableFaceID();
      this.vaultService.setDefaultFaceIDDisabled(true);
    }
  }

  async logout() {
    const modal = await this.modalController.create({
      component: AlertComponent,
      cssClass: 'modal-not-fullscreen',
      componentProps: {
        titleMessage: this.options.signOutQuestion,
        yesButtonTxt: this.options.button,
        noButtonTxt: this.options.close,
        saveFunction: async (): Promise<boolean> => {
          return new Promise(res => {
            res(true);
            this.authService.logout();
          });
        },
      },
    });
    return modal.present();
  }
}
