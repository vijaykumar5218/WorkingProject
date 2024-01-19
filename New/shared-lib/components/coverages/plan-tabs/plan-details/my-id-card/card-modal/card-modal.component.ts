import {Component, Input} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {BenefitsService} from '../../../../../../services/benefits/benefits.service';

import {
  NativeSettings,
  AndroidSettings,
  IOSSettings,
} from 'capacitor-native-settings';

@Component({
  selector: '',
  templateUrl: './card-modal.component.html',
  styleUrls: ['./card-modal.component.scss'],
})
export class CardModalComponent {
  @Input() delete = false;
  @Input() yesText: string;
  @Input() noText: string;
  @Input() description: string;
  @Input() header: string;
  @Input() redirectToSetting: boolean;

  private nativeSettings: typeof NativeSettings;

  constructor(
    private modalController: ModalController,
    private benefitService: BenefitsService
  ) {
    this.nativeSettings = NativeSettings;
  }

  deleteCard() {
    if (this.delete) {
      this.benefitService.deleteMedicalCard();
    }

    if (this.redirectToSetting) {
      this.nativeSettings.open({
        optionAndroid: AndroidSettings.ApplicationDetails,
        optionIOS: IOSSettings.App,
      });
    }

    this.closeModal();
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
