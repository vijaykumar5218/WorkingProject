import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  StepContentElement,
  SummaryStep,
} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';

@Component({
  selector: 'journeys-overview-summary-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss'],
})
export class SummaryStepComponent implements OnInit {
  @Input() step: SummaryStep;
  @Input() journeyId?: number;
  answerElementContent: StepContentElement;
  header: string;
  subheader: string;
  journeyServiceMap: Record<number, any>;
  value: Record<string, string> = {};
  @Output() valueChange = new EventEmitter<string>();
  @Input() answer: string;

  constructor(private journeyService: JourneyService) {
    this.journeyServiceMap = this.journeyService.journeyServiceMap;
  }

  ngOnInit() {
    this.setElementAnswers();
    if (!this.step.emptyValueHeader) {
      this.header = this.step.header;
    }
    if (!this.step.emptySubheader) {
      this.subheader = this.step.subheader;
    }
    if (this.answer) {
      this.value =
        (this.journeyService.safeParse(this.answer) as Record<
          string,
          string
        >) || {};
    }
  }

  setElementAnswers() {
    this.step.elements.forEach((el, i) => {
      el.idSuffix = this.step.idSuffix + i;
      if (this.step.answer) {
        el.answer = this.step.answer[el.answerId];
      }
    });
  }

  setHeaders(event: boolean, index: number) {
    this.step.elements[index].isEmpty = event;
    const nonEmpty = this.step.elements.some(el => el.isEmpty === false);
    const allEmpty = this.step.elements.every(el => el.isEmpty);

    if (nonEmpty) {
      if (!this.header) {
        this.header = this.step.header;
      }
      if (!this.subheader) {
        this.subheader = this.step.subheader;
      }
    } else if (allEmpty) {
      if (!this.header) {
        this.header = this.step.emptyValueHeader;
      }
      if (!this.subheader) {
        this.subheader = this.step.emptySubheader;
      }
    }
  }

  updateValue(value: string, id: string) {
    this.value[id] = value;
    this.valueChange.emit(JSON.stringify(this.value));
  }
}
