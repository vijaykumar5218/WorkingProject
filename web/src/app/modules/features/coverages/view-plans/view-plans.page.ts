import {Component} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';
import pageText from './constants/view-plans.json';
import {AllCoveragePageText} from '@shared-lib/components/coverages/models/modal-info.model';
import {EventManagerService} from '@shared-lib/modules/event-manager/event-manager/event-manager.service';
import {Publisher} from '@shared-lib/modules/event-manager/publisher';
import {Benefit} from '@shared-lib/services/benefits/models/benefits.model';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {eventKeys} from '@shared-lib/constants/event-keys';
import {SubHeaderTab} from '@shared-lib/models/tab-sub-header.model';
@Component({
  selector: 'view-plans',
  templateUrl: 'view-plans.page.html',
})
export class ViewPlansPage {
  selectedTab: string;
  pageData: AllCoveragePageText = pageText;
  tabs: SubHeaderTab[] = [];
  subscription: Subscription = new Subscription();
  lifecyclePublisher: Publisher;
  selectedBenefit: Benefit;

  constructor(
    private router: Router,
    private eventManagerService: EventManagerService,
    private benefitService: BenefitsService
  ) {}

  async ngOnInit() {
    this.tabs = [...this.pageData.tabs];
    this.lifecyclePublisher = this.eventManagerService.createPublisher(
      eventKeys.refreshCoveragePlansDetails
    );
    this.routerNavigation();
  }

  routerNavigation() {
    const routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        const arrOfUrl = event['url'].split('/');
        this.selectedTab = arrOfUrl[4] ? arrOfUrl[4] : 'details';
      });
    this.subscription.add(routerSubscription);
  }

  ionViewWillEnter() {
    this.selectedBenefit = this.benefitService.getSelectedBenefit();
    this.lifecyclePublisher.publish(undefined);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
