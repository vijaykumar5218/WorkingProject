import {Component, Input} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-lang-disclaimer-modal',
  templateUrl: './language-disclaimer-modal.component.html',
  styleUrls: ['./language-disclaimer-modal.component.scss'],
})
export class LanguageDisclamerModalComponent {
  @Input() message: string;
  @Input() buttonText: string;
  compWindow: any;
  constructor(private modal: ModalController) {
    this.compWindow = window;
  }
  closeDialogClicked() {
    this.modal.dismiss();
    this.compWindow.location.reload();
  }
}
