import {Component} from '@angular/core';
import {JourneyContent} from '@shared-lib/services/journey/models/journeyContent.model';
import * as journeyContent from '@shared-lib/services/journey/constants/journey-content.json';
import {JourneyResponse} from '@shared-lib/services/journey/models/journey.model';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {from, Observable, Subscription} from 'rxjs';
import {ViewWillEnter, ViewWillLeave} from '@ionic/angular';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {FooterTypeService} from '../footer/services/footer-type/footer-type.service';
import {HeaderFooterTypeService} from '../../services/header-footer-type/headerFooterType.service';
import {AccessService} from '@shared-lib/services/access/access.service';
import {HeaderType} from '../../constants/headerType.enum';
import {ActionOptions} from '../../models/ActionOptions.model';

@Component({
  selector: 'app-journeys',
  templateUrl: './journeys.component.html',
  styleUrls: ['./journeys.component.scss'],
})
export class JourneysComponent implements ViewWillEnter, ViewWillLeave {
  content: JourneyContent = (journeyContent as any).default;
  subscription: Subscription = new Subscription();
  journeys$: Observable<JourneyResponse>;
  isWeb: boolean;
  myWorkplaceDashboardEnabled: boolean;
  private actionOption: ActionOptions = {
    headername: this.content.landingPage.navHeader,
    btnright: true,
    buttonRight: {
      name: '',
      link: 'notification',
    },
  };

  constructor(
    private headerFooterType: HeaderFooterTypeService,
    private journeyService: JourneyService,
    private sharedUtilityService: SharedUtilityService,
    private footerTypeService: FooterTypeService,
    private accessService: AccessService
  ) {
    this.isWeb = this.sharedUtilityService.getIsWeb();
    this.subscription.add(
      from(this.accessService.checkWorkplaceAccess()).subscribe(res => {
        this.myWorkplaceDashboardEnabled = res.myWorkplaceDashboardEnabled;
      })
    );
  }

  async ionViewWillEnter() {
    this.journeys$ = this.journeyService.fetchJourneys();
    if (!this.isWeb) {
      this.headerFooterType.publishType(
        {
          type: HeaderType.navbar,
          actionOption: this.actionOption,
        },
        {type: FooterType.tabsnav, selectedTab: 'journeys'}
      );
    } else {
      this.footerTypeService.publish({
        type: FooterType.tabsnav,
        selectedTab: 'journeys-list',
      });
    }
  }

  ionViewWillLeave() {
    this.journeys$ = undefined;
  }
}
