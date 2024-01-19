import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-simple',
  templateUrl: './simple.page.html',
  styleUrls: [],
})
export class SimplePage {
  @Input() text: string;
}
