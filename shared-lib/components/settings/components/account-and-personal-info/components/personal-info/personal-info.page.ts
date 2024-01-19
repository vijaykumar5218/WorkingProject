import {Subscription} from 'rxjs';
import {Component, OnInit} from '@angular/core';
import * as personalInfoText from './constants/personalInfoText.json';
import {PersonalInfo} from './models/personal-info.model';
import {AccountService} from '@shared-lib/services/account/account.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {Participant} from '@shared-lib/services/account/models/accountres.model';
@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.page.html',
  styleUrls: ['./personal-info.page.scss'],
})
export class PersonalInfoPage implements OnInit {
  displayText: PersonalInfo = (personalInfoText as any).default;
  subscription: Subscription;
  participantData: Participant;
  isWeb: boolean;

  constructor(
    private accountService: AccountService,
    private utilityService: SharedUtilityService
  ) {}

  async ngOnInit() {
    this.fetchParticipant();
    this.isWeb = this.utilityService.getIsWeb();
  }

  fetchParticipant() {
    this.subscription = this.accountService.getParticipant().subscribe(data => {
      this.participantData = data;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
