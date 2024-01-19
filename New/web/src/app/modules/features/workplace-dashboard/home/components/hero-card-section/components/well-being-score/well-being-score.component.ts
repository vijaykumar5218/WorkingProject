import {Component} from '@angular/core';
import {MVlandingContent} from '../../../../models/mvlandingcontent.model';
import * as PageText from '../../../../constants/workplace-dashboard-content.json';

@Component({
  selector: 'app-well-being-score',
  templateUrl: './well-being-score.component.html',
  styleUrls: ['./well-being-score.component.scss'],
})
export class WellBeingScoreComponent {
  pageText: MVlandingContent = (PageText as any).default;
}
