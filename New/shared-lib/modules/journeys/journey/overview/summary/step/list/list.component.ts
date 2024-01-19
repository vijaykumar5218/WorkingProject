import {Component, Input} from '@angular/core';
import {StepContentElement} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
@Component({
  selector: 'journeys-overview-summary-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {
  @Input() element: StepContentElement;
  constructor(private journeyService: JourneyService) {}

  openWebView(link: string) {
    this.journeyService.openWebView(link, '');
  }
}
