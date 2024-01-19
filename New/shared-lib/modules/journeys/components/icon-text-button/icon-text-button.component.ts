import {Component, EventEmitter, Input, Output} from '@angular/core';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {
  StepContentElement,
  Option,
} from '@shared-lib/services/journey/models/journey.model';

@Component({
  selector: 'journeys-icon-text-button',
  templateUrl: './icon-text-button.component.html',
  styleUrls: ['./icon-text-button.component.scss'],
})
export class IconTextButtonComponent {
  @Input() element: StepContentElement | Option;
  @Input() displayEdit = false;
  @Input() checked = false;
  @Input() index: number;
  @Output() clickEvent = new EventEmitter<void>();
  @Output() editClick = new EventEmitter<void>();
  @Output() updateStepValueAndStep = new EventEmitter<void>();
  contentLinkElement: StepContentElement;
  contentLinkValue: Record<string, string | string[]>;

  constructor(private journeyService: JourneyService) {}

  ngOnInit() {
    if (this.displayEdit) {
      this.contentLinkElement = this.element.elements && {
        ...this.element.elements[0],
        id: 'editModalButton',
      };
      if (this.contentLinkElement) {
        this.contentLinkValue = this.journeyService.journeyServiceMap[
          this.journeyService.getCurrentJourney().journeyID
        ].getModalValue(this.element.id, this.contentLinkElement.answerId);
      }
    }
  }

  handleClick() {
    this.clickEvent.emit();
  }

  emitEditClick() {
    this.editClick.emit();
  }

  handleValueChange(event: string) {
    this.updateStepValueAndStep.emit();
    const service = this.journeyService.journeyServiceMap[
      this.journeyService.getCurrentJourney().journeyID
    ];
    service.handleEditModalValueChange(event, this.index);
    this.contentLinkValue = service.getModalValue(
      this.element.id,
      this.contentLinkElement.answerId
    );
  }
}
