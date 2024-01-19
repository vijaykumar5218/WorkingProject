import {Component, Input, OnInit} from '@angular/core';
import {StepContentElement} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {Subscription} from 'rxjs';
import {JourneyUtilityService} from '@shared-lib/services/journey/journeyUtilityService/journey-utility.service';

@Component({
  selector: 'journeys-overview-summary-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
})
export class LabelComponent implements OnInit {
  @Input() journeyId: number;
  @Input() element: StepContentElement;
  labelValue: string;
  private subscription = new Subscription();

  constructor(
    private journeyService: JourneyService,
    private journeyUtilityService: JourneyUtilityService
  ) {}

  ngOnInit() {
    if (this.element.elements) {
      this.subscription.add(
        this.journeyService.journeyServiceMap[
          this.journeyId
        ].valueChange.subscribe(() => {
          this.processInnerHTMLData();
        })
      );
    } else {
      this.labelValue = this.element.label;
    }
  }

  private processInnerHTMLData() {
    this.labelValue = this.journeyUtilityService.processInnerHTMLData(
      this.element.label,
      this.element.elements,
      this.journeyId
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
