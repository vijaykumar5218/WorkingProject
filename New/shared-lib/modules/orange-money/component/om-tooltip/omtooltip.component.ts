import {Component, Input} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-omtooltip',
  templateUrl: './omtooltip.component.html',
  styleUrls: ['./omtooltip.component.scss'],
})
export class OMTooltipComponent {
  @Input() tooltipContent: string;

  constructor(private modalController: ModalController) {}

  closeDialog() {
    this.modalController.dismiss();
  }
}
