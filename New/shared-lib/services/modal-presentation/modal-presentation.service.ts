import {Subject} from 'rxjs';
import {SharedUtilityService} from '../utility/utility.service';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalPresentationService {
  private isPresenting: boolean;
  private showModal: Subject<HTMLIonModalElement> = new Subject<
    HTMLIonModalElement
  >();
  private modals: Array<HTMLIonModalElement> = [];

  constructor(private utilityService: SharedUtilityService) {
    this.showModal.subscribe((modalObj: HTMLIonModalElement) => {
      this.isPresenting = true;
      this.utilityService.setSuppressHeaderFooter(true);
      modalObj.present();
    });
  }

  present(modalObject: HTMLIonModalElement) {
    this.modals.push(modalObject);
    if (!this.isPresenting) {
      this.showModal.next(this.modals[0]);
    }
  }

  dismiss() {
    this.modals[0].dismiss();
    this.modals.shift();
    if (this.modals.length >= 1) {
      this.showModal.next(this.modals[0]);
    } else {
      this.utilityService.setSuppressHeaderFooter(false);
      this.isPresenting = false;
    }
  }
}
