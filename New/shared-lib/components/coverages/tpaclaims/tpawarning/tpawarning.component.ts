import {Component, Input} from '@angular/core';
import {
  TPAWarning,
  TPAWarningType,
} from '../../../../services/tpa-stream/models/tpa.model';
import * as pageText from './constants/text-data.json';

@Component({
  selector: 'app-tpawarning',
  templateUrl: './tpawarning.component.html',
  styleUrls: ['./tpawarning.component.scss'],
})
export class TPAWarningComponent {
  pageText: Record<string, string> = pageText;
  warnType = TPAWarningType;
  @Input() warning: TPAWarning;
}
