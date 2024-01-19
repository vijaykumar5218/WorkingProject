import {Component} from '@angular/core';
import pageText from '../../constants/mybenefits.json';

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.scss'],
})
export class ClaimsComponent {
  header = pageText.claims.header;
  msg = pageText.claims.message;
  claimLinks = pageText.claims.claimLinks;
}
