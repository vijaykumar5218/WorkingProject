import {Component} from '@angular/core';
import {FinancialWellnessContent} from './models/financial-wellnessContent.model';
import * as fwContent from './constants/financial-wellness-text.json';
@Component({
  selector: 'app-financial-wellness',
  templateUrl: './financial-wellness.component.html',
  styleUrls: ['./financial-wellness.component.scss', './_fw-common.scss'],
})
export class FinancialWellnessComponent {
  content: FinancialWellnessContent = (fwContent as any).default;
}
