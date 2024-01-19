import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {StepContentElement} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';

@Component({
  selector: 'journeys-modal-step-nav-component',
  templateUrl: './modal-nav.component.html',
  styleUrls: ['./modal-nav.component.scss'],
})
export class ModalNavComponent {
  @ViewChild('genericComponent', {read: ElementRef, static: true})
  genericNavComponent: ElementRef;
  @Input() element: StepContentElement;
  @Input() values: Record<string, string | string[]>;
  @Input() answer: string;
  @Input() prefill: boolean;
  selectedElement: StepContentElement;
  offsetTop: number;
  @Output() saveValue = new EventEmitter<string>();
  genericValue: Record<string, string>;
  genericAnswer: string;
  private value: Record<string, string> = {};

  constructor(private journeyService: JourneyService) {}

  ngOnInit() {
    this.selectedElement = this.element.elements[0];
    if (this.prefill) {
      this.genericValue = this.journeyService.safeParse(
        this.values && (this.values[this.selectedElement.answerId] as string)
      ) as Record<string, string>;
      if (this.answer) {
        const parsedAnswer = this.journeyService.safeParse(this.answer);
        this.genericAnswer =
          parsedAnswer && parsedAnswer[this.selectedElement.answerId];
      }
    }
  }

  setSelectedTab(ele: StepContentElement) {
    this.selectedElement = ele;
  }

  handleSave(event: string) {
    this.value[this.selectedElement.answerId] = event;
    this.saveValue.emit(JSON.stringify(this.value));
  }
}
