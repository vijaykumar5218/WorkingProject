import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {StepContentElement} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '../../../../services/journey/journey.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';

@Component({
  selector: 'journeys-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
})
export class LinkComponent implements OnInit {
  @Input() element: StepContentElement;
  isWeb = false;

  constructor(
    private router: Router,
    private journeyService: JourneyService,
    private utilityService: SharedUtilityService
  ) {}

  ngOnInit(): void {
    this.isWeb = this.utilityService.getIsWeb();
  }

  linkClicked(link: string) {
    const currentJourney = this.journeyService.getCurrentJourney();
    if (link === '/accounts/add-accounts') {
      this.journeyService.openMxAccModal();
    } else if (link === '/account/add-accounts') {
      this.journeyService.setAddAccount('true');
      this.router.navigate([link], {
        queryParams: {
          backRoute:
            'journeys/journey/' + currentJourney.journeyID + '/overview',
        },
      });
    } else if (link === 'closeModal') {
      this.journeyService.closeModal();
    } else {
      this.router.navigateByUrl(link);
      if (link === 'settings/notification-settings') {
        this.journeyService.setJourneyBackButton(
          '/journeys/journey/' + currentJourney.journeyID + '/overview'
        );
      }
    }
  }
}
