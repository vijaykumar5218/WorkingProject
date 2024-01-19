import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-loading-text',
  templateUrl: './loading-text.component.html',
  styleUrls: ['./loading-text.component.scss'],
})
export class LoadingTextComponent {
  @Input() public isLoading: boolean;
}
