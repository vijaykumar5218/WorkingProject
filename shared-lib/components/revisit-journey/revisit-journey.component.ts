import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import * as modalContent from '../revisit-journey/constants/revisit-journey-modal.json';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-revisit-journey',
  templateUrl: './revisit-journey.component.html',
  styleUrls: ['./revisit-journey.component.scss'],
})
export class RevisitJourneyComponent {
  modalContent = (modalContent as any).default;

  constructor(
    private modalController: ModalController,
    private router: Router,
    private journeyService: JourneyService,
    private activatedRoute: ActivatedRoute
  ) {}

  async goToSteps() {
    const currentJourney = this.journeyService.getCurrentJourney();
    this.modalController.dismiss();

    const params = await firstValueFrom(this.activatedRoute.queryParams);

    let journeyType = params['journeyType'];
    if (journeyType == null) {
      journeyType = this.journeyService.isRecommendedJourney(currentJourney)
        ? 'recommended'
        : 'all';
    }

    this.router.navigateByUrl(
      '/journeys/journey/' +
        currentJourney.journeyID +
        '/steps?journeyType=' +
        journeyType
    );
  }

  closeInfoDialog(): void {
    this.modalController.dismiss();
  }
}
