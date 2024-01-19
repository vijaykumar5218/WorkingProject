import {Component} from '@angular/core';
import {SubHeaderTab} from '@shared-lib/models/tab-sub-header.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'journeys-journey-web',
  templateUrl: './journey.component.html',
  styleUrls: [],
})
export class JourneyComponent {
  tabs: SubHeaderTab[];
  selectedTab: string;
  subscription = new Subscription();

  constructor(
    private journeyService: JourneyService,
    private utilityService: SharedUtilityService
  ) {}

  ngOnInit() {
    const queryParam = `?${this.utilityService.getQueryParam()}`;
    this.tabs = this.journeyService.fetchTabs(
      ['overview', 'steps', 'resources'],
      queryParam
    );
    const selectedTabSubscription = this.journeyService
      .getSelectedTab$()
      .subscribe((selectedTab: string) => {
        this.selectedTab = selectedTab + queryParam;
      });
    this.subscription.add(selectedTabSubscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
