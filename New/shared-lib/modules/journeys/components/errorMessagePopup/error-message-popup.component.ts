import {Component, Input} from '@angular/core';
import {ModalController} from '@ionic/angular';
import * as pageText from '@shared-lib/services/account/models/retirement-account/info/info-tab.json';
import {AccountJsonModel} from '@shared-lib/services/account/models/accountres.model';
import {StepContentElement} from '@shared-lib/services/journey/models/journey.model';

@Component({
  selector: 'app-err-msg-popup',
  templateUrl: './error-message-popup.component.html',
  styleUrls: ['./error-message-popup.component.scss'],
})
export class ErrorMessagePopupComponent {
  @Input() element: StepContentElement;
  pageText: AccountJsonModel = pageText;

  constructor(private modalController: ModalController) {}

  closeDialog() {
    this.modalController.dismiss();
  }
}
