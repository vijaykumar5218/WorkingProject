import {Component, OnInit} from '@angular/core';
import settingsOption from '@shared-lib/components/settings/constants/settingsOption.json';
import {MenuConfig} from '@shared-lib/components/settings/components/menu/model/menuConfig.model';
import {SettingsService} from '@shared-lib/services/settings/settings.service';
import {SettingsDisplayFlags} from '@shared-lib/services/settings/models/settings.model';
import {WebLogoutService} from '@web/app/modules/shared/services/logout/logout.service';

@Component({
  selector: 'app-menu-page',
  templateUrl: 'menu.page.html',
  styleUrls: ['menu.page.scss'],
})
export class MenuPage implements OnInit {
  menuConfig: MenuConfig = {items: []};
  settingsOption = settingsOption;

  constructor(
    private settingsService: SettingsService,
    private logoutService: WebLogoutService
  ) {}

  async ngOnInit() {
    const settingsDisplayFlags = await this.settingsService.getSettingsDisplayFlags();
    this.setMenuItems(settingsDisplayFlags);
  }

  setMenuItems(settingsDisplayFlags: SettingsDisplayFlags) {
    const route = '/more/';
    for (const option of this.settingsOption.option) {
      if (
        (option.id !== 'contactAdvisor' ||
          settingsDisplayFlags.displayContactLink) &&
        option.id !== 'feedback' &&
        option.id !== 'manageAccounts'
      ) {
        this.menuConfig.items.push({
          route: route + option.url,
          text: option.text,
          icon: option.icon,
          id: option.id,
        });
      } else if (option.id === 'manageAccounts') {
        this.menuConfig.items.push({
          route: 'accounts/manage-accounts',
          text: option.text,
          icon: option.icon,
          id: option.id,
        });
      }
    }
  }

  onLogout() {
    this.logoutService.openModal();
  }
}
