import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-money-out',
  templateUrl: './money-out.component.html',
  styleUrls: ['./money-out.component.scss'],
})
export class MoneyOutComponent {
  header = 'Transaction Status Update';
  @Input() moneyOutMessagesList: string[];
}
