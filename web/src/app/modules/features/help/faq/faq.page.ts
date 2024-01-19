import {Component} from '@angular/core';
import {AccessService} from '@shared-lib/services/access/access.service';
import {AccountInfoService} from '@shared-lib/services/account-info/account-info.service';
import {MoreDescription} from '@shared-lib/services/account-info/models/account-and-personal-info.model';
import {HelpService} from '@shared-lib/services/help/help.service';
import {
  Category,
  HelpContent,
} from '@shared-lib/services/help/models/help.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-help-faq',
  templateUrl: 'faq.page.html',
  styleUrls: ['faq.page.scss'],
})
export class FaqPage {
  DesktopHelpPageFAQs: HelpContent;
  subscription = new Subscription();
  myWorkplaceDashboardEnabled: boolean;
  enableCoverages = false;
  enableMyVoyage: boolean;

  constructor(
    private accountInfoService: AccountInfoService,
    private helpService: HelpService,
    private accessService: AccessService
  ) {}

  async ngOnInit() {
    const myvoyageAccessData = await this.accessService.checkMyvoyageAccess();
    this.myWorkplaceDashboardEnabled =
      myvoyageAccessData.myWorkplaceDashboardEnabled;
    this.enableCoverages = myvoyageAccessData.enableCoverages;
    this.enableMyVoyage = myvoyageAccessData.enableMyVoyage === 'Y';
    this.subscription.add(
      this.accountInfoService
        .getScreenMessage()
        .subscribe((data: MoreDescription) => {
          this.DesktopHelpPageFAQs = JSON.parse(data.DesktopHelpPageFAQs);
          this.DesktopHelpPageFAQs.categoryList.forEach(item => {
            item.category.enableMyVoyage =
              item.category.enableMyVoyage === undefined
                ? true
                : this.enableMyVoyage;
          });
          if (!this.enableCoverages) {
            this.DesktopHelpPageFAQs.categoryList = this.DesktopHelpPageFAQs.categoryList.filter(
              item =>
                item.category.title.toLocaleLowerCase().indexOf('coverages') ===
                -1
            );
          }
        })
    );
  }

  navigateTo(data: Category) {
    this.helpService.setCategoryData(data);
    this.helpService.navigateToHelpContent('help/faq/help-content');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
