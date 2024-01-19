import {Component, Input} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-translation-message-modal',
  templateUrl: './translation-message-modal.component.html',
  styleUrls: ['./translation-message-modal.component.scss'],
})
export class TranslationMessageModalComponent {
  @Input() message: string;
  @Input() buttonText: string;
  constructor(private modal: ModalController) {}
  closeDialogClicked() {
    this.modal.dismiss();
  }
}
