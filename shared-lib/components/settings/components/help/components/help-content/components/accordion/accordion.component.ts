import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent {
  @Input() question: string;
  @Input() description: string;
  @Input() accordionId: string;
  isListItemOpened = false;

  toggleAccordion(): void {
    this.isListItemOpened = !this.isListItemOpened;
  }
}
