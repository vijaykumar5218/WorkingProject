import {Component} from '@angular/core';
import pageText from './constants/help.json';

@Component({
  selector: 'app-help-popover',
  templateUrl: './help-popover.component.html',
  styleUrls: ['./help-popover.component.scss'],
})
export class HelpPopoverComponent {
  pageText = pageText;
}
