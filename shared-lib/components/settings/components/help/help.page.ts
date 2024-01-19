import {Subscription} from 'rxjs';
import {AccountInfoService} from '@shared-lib/services/account-info/account-info.service';
import {MenuConfig} from '@shared-lib/components/settings/components/menu/model/menuConfig.model';
import {HelpContent} from '@shared-lib/services/help/models/help.model';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {Component, OnInit} from '@angular/core';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {AccessService} from '@shared-lib/services/access/access.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {
  menuConfig: MenuConfig = {items: []};
  options: HelpContent;
  isWeb: boolean;
  enableMyVoyage: boolean;
  moreContentSubscription: Subscription;
  actionOption: ActionOptions = {
    headername: 'Help',
    btnleft: true,
    btnright: true,
    buttonLeft: {
      name: '',
      link: 'settings',
    },
    buttonRight: {
      name: '',
      link: 'notification',
    },
  };
  constructor(
    private headerType: HeaderTypeService,
    private accountInfoService: AccountInfoService,
    private utilityService: SharedUtilityService,
    private accessService: AccessService
  ) {}

  async ngOnInit() {
    this.isWeb = this.utilityService.getIsWeb();
    this.enableMyVoyage =
      (await this.accessService.checkMyvoyageAccess()).enableMyVoyage === 'Y';
    this.getMenuItems();
  }

  ionViewWillEnter(): void {
    this.headerType.publish({
      type: HeaderType.navbar,
      actionOption: this.actionOption,
    });
  }

  getMenuItems(): void {
    this.moreContentSubscription = this.accountInfoService
      .getScreenMessage()
      .subscribe(data => {
        if (this.isWeb) {
          this.options = JSON.parse(data.DesktopHelpPageFAQs);
        } else {
          this.options = JSON.parse(data.HelpPageJSON);
        }
        this.setMenuItems();
      });
  }

  setMenuItems(): void {
    if (this.menuConfig.items.length === 0) {
      for (const option of this.options.categoryList) {
        if (this.utilityService.getIsWeb()) {
          this.menuConfig.items.push({
            text: option.category.title,
            route: '/more/help/help-content',
            category: option.category,
            enableMyVoyage:
              option.category?.enableMyVoyage === undefined
                ? true
                : this.enableMyVoyage,
          });
        } else {
          this.menuConfig.items.push({
            text: option.category.title,
            route: '/settings/help/help-content',
            category: option.category,
          });
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.moreContentSubscription.unsubscribe();
  }
}
