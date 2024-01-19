import {ModalController} from '@ionic/angular';
import {Component, Input} from '@angular/core';
import * as pageText from './constants/pageText.json';

interface SaveFunction {
  (): Promise<boolean>;
}

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent {
  pageText = JSON.parse(JSON.stringify(pageText)).default;

  @Input() public titleMessage: string;
  @Input() public message: string;
  @Input() public imageUrl: string = null;
  @Input() public yesButtonTxt = this.pageText.buttons.yes;
  @Input() public noButtonTxt = this.pageText.buttons.no;

  public saveFunction: SaveFunction;
  saving: boolean;
  error: boolean;

  constructor(private modalController: ModalController) {}

  closeDialog(saved = false) {
    this.modalController.dismiss({
      saved: saved,
    });
  }

  async closeDialogClicked(save: boolean) {
    this.error = false;
    if (save) {
      this.saving = true;
      if (this.saveFunction) {
        const result = await this.saveFunction();
        this.saving = false;
        if (result) {
          this.closeDialog(true);
        } else {
          this.error = true;
        }
      } else {
        this.closeDialog();
      }
    } else {
      this.closeDialog();
    }
  }
}
