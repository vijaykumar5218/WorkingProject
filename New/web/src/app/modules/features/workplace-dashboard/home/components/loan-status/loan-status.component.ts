import {Component} from '@angular/core';
import * as PageText from '../../constants/workplace-dashboard-content.json';
import {MVlandingContent} from '../../models/mvlandingcontent.model';

@Component({
  selector: 'app-loan-status',
  templateUrl: './loan-status.component.html',
  styleUrls: ['./loan-status.component.scss'],
})
export class LoanStatusComponent {
  pageText: MVlandingContent = (PageText as any).default;
}
