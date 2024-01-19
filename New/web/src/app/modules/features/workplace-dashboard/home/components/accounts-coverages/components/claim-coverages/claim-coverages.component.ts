import {Component, Input} from '@angular/core';
import {TileCoverageContent} from './models/tile-coverage-content.model';

@Component({
  selector: 'app-claim-coverages',
  templateUrl: './claim-coverages.component.html',
  styleUrls: ['./claim-coverages.component.scss'],
})
export class ClaimCoveragesComponent {
  @Input() tileCoverageContent: TileCoverageContent;
  @Input() isMyBenefitsUser:boolean;
}
