import {Component} from '@angular/core';
import * as pageText from './constants/displayText.json';
import {Legal} from './models/legal-model';

@Component({
  selector: 'app-legal',
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.scss'],
})
export class LegalComponent {
  displayText: Legal = (pageText as any).default;
}
