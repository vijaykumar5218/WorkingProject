import {Injectable} from '@angular/core';

import {ModalController} from '@ionic/angular';

import * as popupContent from '../alt-access/constants/content.json';
import {AltAccessModalComponent} from '../../components/alt-access-modal/alt-access-modal.component';

@Injectable({
  providedIn: 'root',
})
export class AltAccessService {
  content = popupContent;
  constructor(private modalController: ModalController) {}

  async createAndShowModal() {
    const modal = await this.modalController.create({
      component: AltAccessModalComponent,
      cssClass: 'modal-not-fullscreen',
      backdropDismiss: false,
      componentProps: {
        header: this.content.header,
        message: this.content.message,
        buttonText: this.content.buttonText,
      },
    });
    modal.present();
  }
}
