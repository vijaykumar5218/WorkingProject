import {Component, Input, OnInit} from '@angular/core';
import {NavParams, ModalController} from '@ionic/angular';
import * as contactText from './constants/contactPage.json';
import {SettingsDisplayFlags} from '@shared-lib/services/settings/models/settings.model';
import {MoreDescription} from '@shared-lib/services/account-info/models/account-and-personal-info.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {AccountService} from '@shared-lib/services/account/account.service';

@Component({
  selector: 'app-contact-coach-popup',
  templateUrl: './contact-coach-popup.component.html',
  styleUrls: ['./contact-coach-popup.component.scss'],
})
export class ContactCoachPopupComponent implements OnInit {
  pageText = JSON.parse(JSON.stringify(contactText)).default;
  @Input() screenMessage: MoreDescription;
  @Input() settingsDisplayFlags: SettingsDisplayFlags;

  constructor(
    public params: NavParams,
    private modalController: ModalController,
    private journeyService: JourneyService,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    if (!this.settingsDisplayFlags?.suppressAppointment) {
      this.screenMessage.WealthCoachStatementText = '';
    }
  }

  closeDialog() {
    this.modalController.dismiss();
  }

  openTimeTapUrl() {
    if (this.settingsDisplayFlags?.suppressAppointment) {
      this.accountService.openPwebAccountLink(
        decodeURIComponent(this.settingsDisplayFlags?.pwebStatementUrl)
      );
    } else {
      this.journeyService.openWebView(this.screenMessage?.TimetapURL);
    }
  }
}
