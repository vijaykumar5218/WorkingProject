import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  StepContentResponse,
  Option,
  StepContentElement,
} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';

@Component({
  selector: 'journeys-overview-summary-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss'],
})
export class WordSummaryComponent implements OnInit {
  parsedAnswer: Option[];
  @Input() content: StepContentResponse;
  @Input() element: StepContentElement;
  @Input() isOther: boolean;
  @Output() valueEmpty = new EventEmitter<boolean>();

  constructor(private journeyService: JourneyService) {}

  ngOnInit(): void {
    this.processParsedAnswer();
  }

  processParsedAnswer() {
    const contentElement = this.journeyService.findElementByProp(
      this.content,
      'answerId',
      this.element.answerId
    );
    let isEmpty = true;
    if (!this.isOther) {
      this.parsedAnswer = this.journeyService.safeParse(
        this.element.answer
      ) as Option[];
      if (this.parsedAnswer && this.parsedAnswer.length > 0) {
        isEmpty = false;
        this.parsedAnswer.forEach(answer => {
          answer.imageUrl = contentElement.options.find(
            option => option.id === answer.id
          ).imageUrl;
          answer.altText = contentElement.options.find(
            option => option.id === answer.id
          ).altText;
        });
      }
    } else {
      const text = this.element.answer;
      if (text) {
        isEmpty = false;
        this.parsedAnswer = [
          {
            imageUrl: contentElement.imageUrl,
            text: text,
            id: undefined,
            label: contentElement.label,
            altText: contentElement.altText,
          },
        ];
      }
    }
    this.valueEmpty.emit(isEmpty);
  }
}
