import {EditDisplayNameService} from '@shared-lib/services/edit-display-name/edit-display-name.service';
import {AlertComponent} from '@shared-lib/components/alert/alert.component';
import {ModalController} from '@ionic/angular';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import {Component} from '@angular/core';
import * as pageText from '@shared-lib/services/edit-display-name/constants/displayText.json';
import {AccountService} from '@shared-lib/services/account/account.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {PlatformService} from '@shared-lib/services/platform/platform.service';
import {Participant} from '@shared-lib/services/account/models/accountres.model';

@Component({
  selector: 'app-edit-display-name',
  templateUrl: './edit-display-name.page.html',
  styleUrls: ['./edit-display-name.page.scss'],
})
export class EditDisplayNamePage {
  displayText: any = JSON.parse(JSON.stringify(pageText)).default;
  displayName: string;
  subscription: Subscription;
  participantData: Participant;
  actionOption: ActionOptions = {
    headername: 'Edit Display Name',
    btnleft: true,
    btnright: true,
    buttonLeft: {
      name: '',
      link: 'settings/account-and-personal-info',
    },
    buttonRight: {
      name: '',
      link: 'notification',
    },
  };
  isWeb: boolean;
  isDesktop: boolean;
  displayNameVailid = true;

  constructor(
    private headerType: HeaderTypeService,
    private accountService: AccountService,
    private router: Router,
    public modalController: ModalController,
    public editDisplayNameService: EditDisplayNameService,
    private utilityService: SharedUtilityService,
    private platformService: PlatformService
  ) {
    this.isWeb = this.utilityService.getIsWeb();
    this.platformService.isDesktop().subscribe(data => {
      this.isDesktop = data;
    });
  }

  ionViewWillEnter() {
    this.headerType.publish({
      type: HeaderType.navbar,
      actionOption: this.actionOption,
    });
    this.fetchParticipant();
  }

  fetchParticipant() {
    this.subscription = this.accountService.getParticipant().subscribe(data => {
      this.participantData = data;
    });
  }

  cancel() {
    const rootPath = this.isWeb && !this.isDesktop ? 'more' : 'settings';
    this.router.navigateByUrl(`/${rootPath}/account-and-personal-info`);
  }

  valueChanged(val: string | number) {
    this.displayName = val.toString();
    if (this.displayName.trim().length < 1) {
      this.displayNameVailid = false;
    } else {
      this.displayNameVailid = true;
    }
  }

  async saveDisplayName(): Promise<void> {
    const modal = await this.modalController.create({
      component: AlertComponent,
      cssClass: 'modal-not-fullscreen',
      componentProps: {
        titleMessage: this.displayText.alert.message,
        imageUrl: this.displayText.alert.imageUrl,
        saveFunction: async (): Promise<boolean> => {
          return new Promise(res => {
            this.editDisplayNameService
              .saveDisplayName(this.displayName)
              .then(resp => {
                if (resp.displayName && resp.displayName == this.displayName) {
                  res(true);
                } else {
                  res(false);
                }
              });
          });
        },
      },
    });
    modal.onDidDismiss().then(data => {
      this.modalDismissed(data);
    });
    return modal.present();
  }

  modalDismissed(data) {
    if (data.data.saved) {
      this.participantData.displayName = this.displayName;
      this.accountService.setParticipant(this.participantData);
      this.cancel();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
