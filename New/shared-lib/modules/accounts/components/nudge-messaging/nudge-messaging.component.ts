import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {NudgeMessaging} from '../../../../../mobile/src/app/modules/features/financial-wellness/models/nudge-messagingContent.model';
import * as fwContent from '@shared-lib/services/account/constants/nudge-messaging-text.json';
import {EmployersMatch} from '@shared-lib/services/account/models/retirement-account/info/employersMatch.model';
import {NudgePopupComponent} from '../nudge-popup/nudge-popup.component';
import {AccountService} from '@shared-lib/services/account/account.service';
import {Account} from '@shared-lib/services/account/models/accountres.model';

@Component({
  selector: 'app-nudge-messaging',
  templateUrl: './nudge-messaging.component.html',
  styleUrls: ['./nudge-messaging.component.scss'],
})
export class NudgeMessagingComponent implements OnInit {
  content: NudgeMessaging = (fwContent as any).default;
  account: Account;
  @Input() employersMatch: EmployersMatch;

  constructor(
    public modalController: ModalController,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.account = this.accountService.getAccount();
  }

  async openLearnMoreModal() {
    const modal = await this.modalController.create({
      component: NudgePopupComponent,
      cssClass: 'modal-not-fullscreen',
      componentProps: {
        url: this.employersMatch?.toolTipText,
        toolTipNote: this.employersMatch?.toolTipNotes,
        nudgeType: this.employersMatch?.nudgeType,
      },
    });
    return modal.present();
  }
}
