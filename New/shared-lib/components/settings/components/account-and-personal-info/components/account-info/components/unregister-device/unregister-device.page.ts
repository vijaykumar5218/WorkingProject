import {AccountInfoService} from '@shared-lib/services/account-info/account-info.service';
import {Subscription} from 'rxjs';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import {Component} from '@angular/core';
import * as pageText from './constants/displayText.json';
import {UnregisterDevicePageContent} from './models/unregister-device.model';
import {Router} from '@angular/router';
import {UnregisterMessage} from '@shared-lib/services/account-info/models/account-and-personal-info.model';

@Component({
  selector: 'app-unregister-device',
  templateUrl: './unregister-device.page.html',
  styleUrls: ['./unregister-device.page.scss'],
})
export class UnregisterDevicePage {
  displayText: UnregisterDevicePageContent = (pageText as any).default;
  screenMessage: UnregisterMessage;
  moreContentSubscription: Subscription;

  actionOption: ActionOptions = {
    headername: this.displayText.actionOption.headerName,
    btnleft: true,
    btnright: true,
    buttonLeft: {
      name: '',
      link: this.displayText.actionOption.buttonLeft,
    },
    buttonRight: {
      name: '',
      link: this.displayText.actionOption.buttonRight,
    },
  };

  constructor(
    private headerType: HeaderTypeService,
    private accountInfoService: AccountInfoService,
    public router: Router
  ) {}

  ionViewWillEnter() {
    this.headerType.publish({
      type: HeaderType.navbar,
      actionOption: this.actionOption,
    });
  }

  ngOnInit(): void {
    this.fetchScreenMessage();
  }

  fetchScreenMessage(): void {
    this.moreContentSubscription = this.accountInfoService
      .getScreenMessage()
      .subscribe(data => {
        this.screenMessage = JSON.parse(data.UnregisterDeviceText);
      });
  }

  goBack(): void {
    this.router.navigateByUrl('settings/account-and-personal-info');
  }

  ngOnDestroy(): void {
    this.moreContentSubscription.unsubscribe();
  }
}
