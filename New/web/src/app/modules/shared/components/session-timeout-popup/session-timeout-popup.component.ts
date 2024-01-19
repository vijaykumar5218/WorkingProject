import {ModalController} from '@ionic/angular';
import {Component} from '@angular/core';
import {SessionTimeoutService} from '../../services/session-timeout/session-timeout.service';
import {Subscription} from 'rxjs';
import * as pageData from '../../services/session-timeout/constants/content.json';

interface SaveFunction {
  (): Promise<boolean>;
}

@Component({
  selector: 'session-timeout-popup',
  templateUrl: './session-timeout-popup.component.html',
  styleUrls: ['./session-timeout-popup.component.scss'],
})
export class SessionTimeoutPopupComponent {
  public saveFunction: SaveFunction;
  subscription = new Subscription();
  counter: string;
  content = pageData;

  constructor(
    private modalController: ModalController,
    private sessionTimeoutService: SessionTimeoutService
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.sessionTimeoutService.getSessionExpiringCounter().subscribe(data => {
        this.counter = data;
      })
    );
  }

  closeDialog(saved = false) {
    this.modalController.dismiss({
      saved: saved,
    });
  }

  async closeDialogClicked(save: boolean) {
    if (save) {
      if (this.saveFunction) {
        await this.saveFunction();
        this.closeDialog(true);
      } else {
        this.closeDialog();
      }
    } else {
      this.closeDialog();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
