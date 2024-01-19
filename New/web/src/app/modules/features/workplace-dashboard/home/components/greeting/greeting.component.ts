import {Component, OnInit} from '@angular/core';
import {GreetingService} from '../../../../../shared/services/greeting/greeting.service';
import * as PageText from '../../constants/workplace-dashboard-content.json';
import {MVlandingContent} from '../../models/mvlandingcontent.model';
import {AccountService} from '@shared-lib/services/account/account.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-greeting',
  templateUrl: './greeting.component.html',
  styleUrls: ['./greeting.component.scss'],
})
export class GreetingComponent implements OnInit {
  greetingText: string;
  isMorning: boolean;
  isEvening: boolean;
  pageText: MVlandingContent = (PageText as any).default;
  participantName: string;
  private subscription = new Subscription();

  constructor(
    private greetingService: GreetingService,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.isMorning = this.greetingService.getIsMorningFlag();
    this.isEvening = this.greetingService.getIsEveningFlag();
    this.fetchGreetingText();
    this.fetchDisplayName();
  }

  fetchGreetingText() {
    if (this.isMorning) {
      this.greetingText = this.pageText.morningGreetingTxt;
    } else if (this.isEvening) {
      this.greetingText = this.pageText.eveningGreetingTxt;
    } else {
      this.greetingText = this.pageText.afternoonGreetingTxt;
    }
  }

  fetchDisplayName() {
    this.subscription.add(
      this.accountService.getParticipant().subscribe(participant => {
        if (participant.nameDobDiff) {
          this.participantName = this.pageText.nameDobDiffParticipant;
        } else {
          this.participantName = this.accountService.getDisplayNameOrFirstOrLast(
            participant
          );
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
