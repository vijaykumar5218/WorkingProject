import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Status} from '@shared-lib/constants/status.enum';
import {
  Journey,
  JourneyContentResponse,
} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import * as journeyContent from '@shared-lib/services/journey/constants/journey-content.json';
import {JourneyContent} from '@shared-lib/services/journey/models/journeyContent.model';
import {LoadingController} from '@ionic/angular';

@Component({
  selector: 'journeys-journey',
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.scss'],
})
export class JourneyComponent implements OnInit {
  @Input() journey: Journey;
  @Input() idPrefix: string;
  status: Status = Status.notStarted;
  isWeb: boolean;
  content: JourneyContentResponse;
  isComingSoon = false;
  journeyContent: JourneyContent = (journeyContent as any).default;

  constructor(
    private journeyService: JourneyService,
    private router: Router,
    private sharedUtilityService: SharedUtilityService,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.isComingSoon = this.journeyService.isComingSoon(this.journey);
    if (!this.isComingSoon) {
      this.status = this.journeyService.getJourneyStatus(this.journey.steps);
      this.content = this.journey.parsedLandingAndOverviewContent;
    } else {
      this.content = this.journey.parsedComingSoonContent;
    }
    this.isWeb = this.sharedUtilityService.getIsWeb();
  }

  async handleJourneyClick() {
    if (!this.isComingSoon) {
      if (!this.isWeb) {
        const loader = await this.loadingController.create({
          translucent: true,
        });
        loader.present();
        await this.journeyService.setStepContent(this.journey);
        this.journeyService.setCurrentJourney(this.journey);
        loader.dismiss();
      }
      if (this.status === Status.inProgress) {
        if (this.isWeb) {
          this.router.navigate(
            ['/journeys/journey/' + this.journey.journeyID + '/steps'],
            {
              queryParams: {journeyType: this.idPrefix},
            }
          );
        } else {
          this.router.navigateByUrl(
            '/journeys/journey/' + this.journey.journeyID + '/steps'
          );
        }
      } else {
        if (this.isWeb) {
          this.router.navigate(
            ['/journeys/journey/' + this.journey.journeyID + '/overview'],
            {
              queryParams: {journeyType: this.idPrefix, fromJourneys: true},
            }
          );
        } else {
          this.router.navigate([
            '/journeys/journey/' + this.journey.journeyID + '/overview',
            {fromJourneys: true},
          ]);
        }
      }
    }
  }
}
