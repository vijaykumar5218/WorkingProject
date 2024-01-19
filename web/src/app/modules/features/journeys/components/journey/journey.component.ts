import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Status} from '@shared-lib/constants/status.enum';
import {
  Journey,
  JourneyContentResponse,
} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {Router} from '@angular/router';
import {UrlProps} from '../../model/journey.model';
import {EventManagerService} from '@shared-lib/modules/event-manager/event-manager/event-manager.service';
import {eventKeys} from '@shared-lib/constants/event-keys';
import * as journeyContent from '@shared-lib/services/journey/constants/journey-content.json';
import {JourneyContent} from '@shared-lib/services/journey/models/journeyContent.model';

@Component({
  selector: 'journeys-journey',
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.scss'],
})
export class JourneyComponent implements OnInit {
  @Input() journey: Journey;
  status: Status = Status.notStarted;
  @Input() journeyType: string;
  @Input() urlProps: UrlProps;
  @Output() localStorageChange: EventEmitter<Journey> = new EventEmitter();
  isComingSoon: boolean;
  content: JourneyContentResponse;
  journeyContent: JourneyContent = journeyContent;
  @Output() journeyClick: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private journeyService: JourneyService,
    private router: Router,
    private eventManager: EventManagerService
  ) {}

  ngOnInit() {
    this.isComingSoon = this.journeyService.isComingSoon(this.journey);
    if (!this.isComingSoon) {
      this.status = this.journeyService.getJourneyStatus(this.journey.steps);
      this.content = this.journey.parsedLandingAndOverviewContent;
    } else {
      this.content = this.journey.parsedComingSoonContent;
    }

    this.eventManager
      .createSubscriber(eventKeys.refreshJourneyStatus)
      .subscribe(() => {
        if (!this.isComingSoon) {
          this.status = this.journeyService.getJourneyStatus(
            this.journey.steps
          );
        }
      });
  }

  handleJourneyClick() {
    if (!this.isComingSoon) {
      const journeyID = this.journey.journeyID;
      if (this.urlProps.journeyId !== journeyID) {
        this.journeyService.publishLeaveJourney();
      }
      if (this.status === Status.inProgress) {
        this.router.navigate(['/journeys/journey/' + journeyID + '/steps'], {
          queryParams: {journeyType: this.journeyType},
        });
      } else {
        this.router.navigate(['/journeys/journey/' + journeyID + '/overview'], {
          queryParams: {journeyType: this.journeyType, fromJourneys: true},
        });
      }
      this.journeyClick.emit();
    }
  }

  manageWidthOfCard(): Record<string, string> {
    if (
      this.urlProps['journeyId'] == this.journey.journeyID &&
      this.urlProps['journeyType'] === this.journeyType
    ) {
      this.setLocalStorage();
      return {width: '411px'};
    } else {
      return {width: '380px'};
    }
  }

  async setLocalStorage() {
    if (this.urlProps['resolvePromiseTimes'] === 1) {
      this.urlProps['resolvePromiseTimes'] = 2;
      await this.journeyService.setStepContent(this.journey);
      this.journeyService.setCurrentJourney(this.journey);
      this.localStorageChange.emit(this.journey);
    }
  }
}
