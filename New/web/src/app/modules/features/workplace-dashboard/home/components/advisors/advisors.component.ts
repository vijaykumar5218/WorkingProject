import {Component, Input} from '@angular/core';
import {OfferCode} from '../../../../../shared/services/adviceCallout/model/OfferCode.model';
import {DomSanitizer} from '@angular/platform-browser';
@Component({
  selector: 'app-advisors',
  templateUrl: './advisors.component.html',
  styleUrls: ['./advisors.component.scss'],
})
export class AdvisorsComponent {
  @Input() offerVal: OfferCode[];

  constructor(public sanitizer: DomSanitizer) {}

  openTargetLink(link: string) {
    window.open(link, '_self');
  }
}
