import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-info-line',
  templateUrl: './info-line.component.html',
  styleUrls: ['./info-line.component.scss'],
})
export class InfoLineComponent {
  @Input() title: string;
  @Input() bolded: boolean;
}
