import {Component} from '@angular/core';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import content from './constants/pageContent.json';
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage {
  actionOption: ActionOptions = {
    headername: 'Feedback',
    btnleft: true,
    btnright: true,
    buttonLeft: {
      name: '',
      link: 'settings',
    },
    buttonRight: {
      name: '',
      link: 'notification',
    },
  };
  welcomeTxt = content.welcome;

  constructor(private headerType: HeaderTypeService) {}

  ionViewWillEnter() {
    this.headerType.publish({
      type: HeaderType.navbar,
      actionOption: this.actionOption,
    });
  }
}
