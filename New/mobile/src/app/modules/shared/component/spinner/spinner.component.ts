import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: [],
})
export class SpinnerComponent {
  @Input() public isLoading = false;
  @Input() public message: string;
}
