import {Component, Input} from '@angular/core';
import {Journey} from '@shared-lib/services/journey/models/journey.model';

@Component({
  selector: 'journeys-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {
  @Input() headerText: string;
  @Input() journeys: Journey[];
  @Input() idPrefix: string;
}
