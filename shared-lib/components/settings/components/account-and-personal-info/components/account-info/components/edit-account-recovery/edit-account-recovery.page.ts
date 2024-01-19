import {UntypedFormGroup, UntypedFormControl} from '@angular/forms';
import {RecoveryText} from './models/edit-account.model';
import {
  AccountRecovery,
  MoreDescription,
} from '@shared-lib/services/account-info/models/account-and-personal-info.model';
import {AccountInfoService} from '@shared-lib/services/account-info/account-info.service';
import {Subscription} from 'rxjs';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import {Component} from '@angular/core';
import * as pageText from './constants/recoveryText.json';
import {Router} from '@angular/router';

@Component({
  selector: 'app-edit-account-recovery',
  templateUrl: './edit-account-recovery.page.html',
  styleUrls: ['./edit-account-recovery.page.scss'],
})
export class EditAccountRecoveryPage {
  displayText: RecoveryText = (pageText as any).default;
  moreContentSubscription: Subscription;
  recoveryDataSubscription: Subscription;
  screenMessage: MoreDescription;
  loading: boolean;
  editRecoveryForm: UntypedFormGroup;
  accountRecoveryData: AccountRecovery;
  addMobile: boolean;
  addEmail: boolean;
  mobile: string;

  constructor(
    private headerType: HeaderTypeService,
    private accountInfoService: AccountInfoService,
    private router: Router
  ) {
    this.editRecoveryForm = new UntypedFormGroup({
      listOptions: new UntypedFormControl(),
    });
  }

  actionOption: ActionOptions = {
    headername: this.displayText.actionOption.header,
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

  ionViewWillEnter(): void {
    this.headerType.publish({
      type: HeaderType.navbar,
      actionOption: this.actionOption,
    });
  }

  ngOnInit(): void {
    this.fetchScreenContent();
  }

  fetchScreenContent(): void {
    this.moreContentSubscription = this.accountInfoService
      .getScreenMessage()
      .subscribe(data => {
        this.screenMessage = data;
      });
    this.fetchRecoveryData();
  }

  fetchRecoveryData(): void {
    this.recoveryDataSubscription = this.accountInfoService
      .getAccountRecovery()
      .subscribe(data => {
        this.accountRecoveryData = data;
        this.addMobile = data.security.accountRecoveryInfo.mobile
          ? false
          : true;
        this.addEmail = data.security.accountRecoveryInfo.email ? false : true;
        this.mobile = !this.addMobile
          ? this.accountInfoService.formatPhoneNumber(
              data.security.accountRecoveryInfo.mobile
            )
          : '';
      });
  }

  updateContent(type: string): void {
    type === 'mobile'
      ? this.router.navigateByUrl(
          '/settings/account-and-personal-info/account-info/edit-account-recovery/add-update-mobile'
        )
      : this.router.navigateByUrl(
          '/settings/account-and-personal-info/account-info/edit-account-recovery/add-update-email'
        );
  }

  goBack(): void {
    this.router.navigateByUrl('/settings/account-and-personal-info');
  }

  ngOnDestroy(): void {
    this.moreContentSubscription.unsubscribe();
    this.recoveryDataSubscription.unsubscribe();
  }
}
