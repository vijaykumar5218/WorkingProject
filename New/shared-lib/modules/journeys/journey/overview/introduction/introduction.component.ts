import {Component, Input, OnInit} from '@angular/core';
import {Status} from '@shared-lib/constants/status.enum';
import {Journey} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {EventManagerService} from '@shared-lib/modules/event-manager/event-manager/event-manager.service';
import {eventKeys} from '@shared-lib/constants/event-keys';

@Component({
  selector: 'journeys-overview-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss'],
})
export class IntroductionComponent implements OnInit {
  @Input() journey: Journey;
  status: Status = Status.notStarted;
  isWeb: boolean;
  journeyType: string;
  subscription = new Subscription();

  constructor(
    private journeyService: JourneyService,
    private utilityService: SharedUtilityService,
    private activatedRoute: ActivatedRoute,
    private eventManager: EventManagerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isWeb = this.utilityService.getIsWeb();
    this.getJourneyType();
    this.status = this.journeyService.getJourneyStatus(this.journey.steps);
    if (
      this.journey?.parsedLandingAndOverviewContent?.overview?.action?.message
    ) {
      this.journey.parsedLandingAndOverviewContent.overview.action.message = this.journey.parsedLandingAndOverviewContent.overview.action.message.replace(
        '${stepCount}',
        this.journey.steps ? this.journey.steps.length.toString() : '0'
      );
    }
    if (this.isWeb) {
      this.refreshJourneyStatus();
    }
  }

  refreshJourneyStatus() {
    this.subscription.add(
      this.eventManager
        .createSubscriber(eventKeys.refreshJourneyStatus)
        .subscribe(() => {
          this.status = this.journeyService.getJourneyStatus(
            this.journeyService.getCurrentJourney().steps
          );
        })
    );
  }

  getJourneyType() {
    if (this.isWeb) {
      const activatedRouteSubscription = this.activatedRoute.queryParams.subscribe(
        data => {
          this.journeyType = data.journeyType;
        }
      );
      this.subscription.add(activatedRouteSubscription);
    }
  }

  buttonClick() {
    this.router.navigate(['../steps'], {
      relativeTo: this.activatedRoute,
      queryParams: {journeyType: 'all'},
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
