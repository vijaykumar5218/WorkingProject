import {Component, Input} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-alt-access-modal',
  templateUrl: './alt-access-modal.component.html',
  styleUrls: ['./alt-access-modal.component.scss'],
})
export class AltAccessModalComponent {
  @Input() header: string;
  @Input() message: string;
  @Input() buttonText: string;
  constructor(private modal: ModalController) {}
  closeDialogClicked() {
    this.modal.dismiss();
  }
}
