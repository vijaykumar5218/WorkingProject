import {Component, Input} from '@angular/core';
import {TranslationMessage} from '@web/app/modules/shared/services/content/model/translation-message.model';
import {ModalController} from '@ionic/angular';
import {TranslationMessageModalComponent} from '../../../../../shared/components/translation-message-modal/translation-message-modal.component';

@Component({
  selector: 'app-translation-card-section',
  templateUrl: './translation-card-section.component.html',
  styleUrls: ['./translation-card-section.component.scss'],
})
export class TranslationCardSectionComponent {
  @Input() translationObject: TranslationMessage;
  constructor(private modalController: ModalController) {}
  async openTranslationMessageModal() {
    const modal = await this.modalController.create({
      component: TranslationMessageModalComponent,
      cssClass: ['modal-not-fullscreen', 'translation-card-modal'],
      componentProps: {
        message: this.translationObject.message,
        buttonText: this.translationObject.buttonText,
      },
    });
    modal.present();
  }
}
