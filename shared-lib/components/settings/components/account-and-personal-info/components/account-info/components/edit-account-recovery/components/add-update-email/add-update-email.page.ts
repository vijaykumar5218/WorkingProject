import {Subscription} from 'rxjs';
import {AccountRecovery} from '@shared-lib/services/account-info/models/account-and-personal-info.model';
import {AccountInfoService} from '@shared-lib/services/account-info/account-info.service';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import {Component} from '@angular/core';
import {UpdateEmailPageText} from '../../models/edit-account.model';
import * as pageText from './constants/displayText.json';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-update-email',
  templateUrl: './add-update-email.page.html',
  styleUrls: ['./add-update-email.page.scss'],
})
export class AddUpdateEmailPage {
  displayText: UpdateEmailPageText = (pageText as any).default;
  accountRecoveryData: AccountRecovery;
  recoveryDataSubscription: Subscription;
  addEmail: boolean;
  email: string;

  actionOption: ActionOptions = {
    headername: '',
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.headerType.publish({
      type: HeaderType.navbar,
      actionOption: this.actionOption,
    });
    this.fetchRecoveryData();
  }

  fetchRecoveryData(): void {
    this.recoveryDataSubscription = this.accountInfoService
      .getAccountRecovery()
      .subscribe(data => {
        this.accountRecoveryData = data;
        this.addEmail = this.accountRecoveryData.security.accountRecoveryInfo
          .email
          ? false
          : true;
        this.actionOption.headername = this.addEmail
          ? this.displayText.actionOption.updateHeader
          : this.displayText.actionOption.addHeader;
        this.headerType.publish({
          type: HeaderType.navbar,
          actionOption: this.actionOption,
        });
      });
  }

  valueChanged(val: string): void {
    this.email = val;
  }

  goBack(): void {
    this.router.navigateByUrl(
      '/settings/account-and-personal-info/account-info/edit-account-recovery'
    );
  }

  ngOnDestroy(): void {
    this.recoveryDataSubscription.unsubscribe();
  }
}
