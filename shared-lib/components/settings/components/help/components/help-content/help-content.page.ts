import {
  Category,
  HelpContentOption,
} from '@shared-lib/services/help/models/help.model';
import {HelpService} from '@shared-lib/services/help/help.service';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {Component} from '@angular/core';
import * as helpOption from './constants/helpContentOptions.json';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {PlatformService} from '@shared-lib/services/platform/platform.service';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import {AccessService} from '@shared-lib/services/access/access.service';

@Component({
  selector: 'app-help-content',
  templateUrl: './help-content.page.html',
  styleUrls: ['./help-content.page.scss'],
})
export class HelpContentPage {
  options: HelpContentOption = (helpOption as any).default;
  pageData: Array<Category>;
  category: Category;
  actionOption: ActionOptions = {
    headername: '',
    btnleft: true,
    btnright: true,
    buttonLeft: {
      name: '',
      link: this.options.actionOption.buttonLeft,
    },
    buttonRight: {
      name: '',
      link: this.options.actionOption.buttonRight,
    },
  };
  isWeb: boolean;
  isDesktop: boolean;
  myWorkplaceDashboardEnabled: boolean;
  enableMyVoyage: boolean;
  constructor(
    private headerType: HeaderTypeService,
    private helpService: HelpService,
    private sharedUtilityService: SharedUtilityService,
    private platformService: PlatformService,
    private accessService: AccessService
  ) {
    this.isWeb = this.sharedUtilityService.getIsWeb();
    this.platformService.isDesktop().subscribe(data => {
      this.isDesktop = data;
    });
  }

  async ionViewWillEnter() {
    const myvoyageAccess = await this.accessService.checkMyvoyageAccess();
    this.enableMyVoyage = myvoyageAccess.enableMyVoyage === 'Y';
    this.myWorkplaceDashboardEnabled =
      myvoyageAccess.myWorkplaceDashboardEnabled;
    this.category = this.helpService.getCategoryData();
    if (this.isWeb) {
      this.category.questionList.forEach(item => {
        if (!item.enableMyVoyage) {
          item.enableMyVoyage =
            item.enableMyVoyage === undefined ? true : this.enableMyVoyage;
        }
      });
    }
  
    this.actionOption.headername = this.category.title;
    this.headerType.publish({
      type: HeaderType.navbar,
      actionOption: this.actionOption,
    });
  }

  navigateTo() {    
    this.helpService.backToFaq()
  }
}