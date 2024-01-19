import {Component, Input} from '@angular/core';
import {Status} from '@shared-lib/constants/status.enum';

@Component({
  selector: 'journeys-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
})
export class StatusComponent {
  @Input() status: Status = Status.notStarted;
  readonly statusEnum = Status;
}
