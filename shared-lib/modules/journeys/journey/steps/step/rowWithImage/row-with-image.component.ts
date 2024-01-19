import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {StepContentElement} from '@shared-lib/services/journey/models/journey.model';
import {Subscription} from 'rxjs';
import {JourneyService} from '../../../../../../services/journey/journey.service';

@Component({
  selector: 'journeys-steps-step-row-with-image',
  templateUrl: './row-with-image.component.html',
  styleUrls: ['./row-with-image.component.scss'],
})
export class RowWithImageComponent implements OnInit, OnDestroy {
  @Input() element: StepContentElement;
  service: any;
  answer: string | number;
  private subscription = new Subscription();

  constructor(private journeyService: JourneyService) {
    this.service = this.journeyService.journeyServiceMap[
      this.journeyService.getCurrentJourney().journeyID
    ];
  }

  ngOnInit() {
    this.answer = this.element.answer;
    if (this.service && !this.answer) {
      this.subscription.add(
        this.service.valueChange.subscribe(() => {
          this.answer = this.element.answerId
            ? this.service[this.element.answerId]
            : this.element.answer;
          if (this.journeyService.isValueEmpty(this.answer)) {
            this.answer = '-';
          }
        })
      );
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
