import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {StepContentElement} from '@shared-lib/services/journey/models/journey.model';
import {Subscription} from 'rxjs';
import {JourneyService} from '../../services/journey/journey.service';
import {Journey} from '../../services/journey/models/journey.model';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class StepTableComponent implements OnInit, OnDestroy {
  @Input() element: StepContentElement;
  private subscription = new Subscription();

  constructor(private journeyService: JourneyService) {}

  ngOnInit() {
    const currentJourney = this.journeyService.getCurrentJourney();
    if (this.journeyService.journeyServiceMap[currentJourney.journeyID]) {
      this.subscription.add(
        this.journeyService.journeyServiceMap[
          currentJourney.journeyID
        ].valueChange.subscribe(() => {
          this.setValues(currentJourney);
        })
      );
    }
  }

  private setValues(currentJourney: Journey) {
    const service = this.journeyService.journeyServiceMap[
      currentJourney.journeyID
    ];
    this.element.rows?.forEach(row => {
      if (row.flag) {
        row.suppress = !service[row.flag];
      }
      if (row.answerId) {
        row.answer = service[row.answerId];
        if (this.journeyService.isValueEmpty(row.answer)) {
          row.answer = '-';
        }
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
