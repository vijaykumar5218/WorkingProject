import {Component, Input} from '@angular/core';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {StepContentElement} from '@shared-lib/services/journey/models/journey.model';

@Component({
  selector: 'journeys-steps-step-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent {
  @Input() element: StepContentElement;

  constructor(public journeyService: JourneyService) {}

  openModal() {
    this.journeyService.openModal({element: this.element});
  }
}
