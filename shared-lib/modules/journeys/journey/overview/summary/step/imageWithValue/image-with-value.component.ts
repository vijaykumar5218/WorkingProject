import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  StepContentElement,
  StepContentResponse,
} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';

@Component({
  selector: 'journeys-overview-summary-step-image-with-value',
  templateUrl: './image-with-value.component.html',
  styleUrls: [],
})
export class ImageWithValueSummaryComponent implements OnInit {
  @Input() content: StepContentResponse;
  @Input() element: StepContentElement;
  imageUrl: string;
  @Output() valueEmpty = new EventEmitter<boolean>();
  value: string;

  constructor(private journeyService: JourneyService) {}

  ngOnInit() {
    this.setImageUrl();
    this.handleEmptyValue();
  }

  setImageUrl() {
    const imageWithValueEl = this.journeyService.findElementByProp(
      this.content,
      'id',
      'imageWithValue'
    );
    this.imageUrl = imageWithValueEl?.imageUrl
      ? imageWithValueEl.imageUrl
      : this.element.imageUrl;
  }

  handleEmptyValue() {
    const isValueEmpty = this.journeyService.isValueEmpty(this.element.answer);
    this.valueEmpty.emit(isValueEmpty || this.element.answer === '$0');
    this.value = isValueEmpty ? '-' : this.element.answer;
  }
}
