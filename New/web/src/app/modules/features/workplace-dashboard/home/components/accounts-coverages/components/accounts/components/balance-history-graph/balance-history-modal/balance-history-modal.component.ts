import {Component, Input} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'web-balance-history-modal',
  templateUrl: './balance-history-modal.component.html',
  styleUrls: ['./balance-history-modal.component.scss'],
})
export class BalanceHistoryModalComponent {
  @Input() modalTitle: string;
  @Input() modalContent: string;

  constructor(private modalController: ModalController) {}

  closeModal(): void {
    this.modalController.dismiss();
  }
}
