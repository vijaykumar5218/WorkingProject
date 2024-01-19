import {Component, Input} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'insights-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss'],
})
export class InfoModalComponent {
  @Input() headerText: string;
  @Input() bodyText: string;

  constructor(private modalController: ModalController) {}

  closeInfoDialog(): void {
    this.modalController.dismiss();
  }
}
