import {Component, HostListener} from '@angular/core';
import {StepContentElement} from '@shared-lib/services/journey/models/journey.model';
import * as journeyContent from '@shared-lib/services/journey/constants/journey-content.json';
import {JourneyContent} from '@shared-lib/services/journey/models/journeyContent.model';
import {ModalController} from '@ionic/angular';
import {MoreDescription} from '@shared-lib/services/account-info/models/account-and-personal-info.model';
import {SettingsDisplayFlags} from '@shared-lib/services/settings/models/settings.model';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';

@Component({
  selector: 'journeys-modal-component',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  element: StepContentElement;
  screenMessage: MoreDescription;
  settingsDisplayFlags: SettingsDisplayFlags;
  content: JourneyContent = journeyContent;
  fullscreen: boolean;
  values: Record<string, string | string[]>;
  answer: string;
  isWeb: boolean;
  saveFunction: (string) => void;

  constructor(
    private modalController: ModalController,
    private utilityService: SharedUtilityService
  ) {
    this.isWeb = this.utilityService.getIsWeb();
  }

  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this.closeDialog();
  }

  closeDialog() {
    this.modalController.dismiss();
  }

  saveValue(value: string) {
    this.saveFunction(value);
  }
}
