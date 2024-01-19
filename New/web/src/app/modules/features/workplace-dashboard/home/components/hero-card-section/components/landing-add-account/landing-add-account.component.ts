import {Component} from '@angular/core';
import * as PageText from './constants/content.json';
import {AddAccountLandingContent} from '@shared-lib/models/add-account-landing.model';

@Component({
  selector: 'landing-add-account',
  templateUrl: './landing-add-account.component.html',
  styleUrls: ['./landing-add-account.component.scss'],
})
export class LandingAddAccountComponent {
  pageText = (PageText as any).default;
  content: AddAccountLandingContent;
}
