import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-add-plan-card',
  templateUrl: './add-plan-card.component.html',
  styleUrls: ['./add-plan-card.component.scss'],
})
export class AddPlanCardComponent {
  @Input() planName: string;
}
