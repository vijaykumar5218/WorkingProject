import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StepContentElement} from '@shared-lib/services/journey/models/journey.model';
import {Subscription} from 'rxjs';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {MXAccount} from '@shared-lib/services/mx-service/models/mx.model';

@Component({
  selector: 'journeys-steps-step-input-account-radio-button',
  templateUrl: './account-radio-button.component.html',
  styleUrls: ['./account-radio-button.component.scss'],
})
export class AccountRadioButtonComponent implements OnInit {
  @Input() element: StepContentElement;
  @Output() valueChange = new EventEmitter<string>();
  @Input() answer: string;
  @Input() value: string;
  accountData: Array<MXAccount> = [];
  private subscription: Subscription = new Subscription();
  service: any;

  constructor(private journeyService: JourneyService) {
    this.service = this.journeyService.journeyServiceMap[
      this.journeyService.getCurrentJourney().journeyID
    ];
  }

  ngOnInit() {
    this.subscription.add(
      this.service.getMXAccountData().subscribe(res => {
        this.accountData = res.accounts;
      })
    );
  }

  updateRadioValue(value: string) {
    this.valueChange.emit(value);
  }

  suppressAccountNumber(str: string) {
    return 'XXXXXX' + str.slice(6, 10);
  }

  emitData(id: string) {
    this.accountData.forEach(account => {
      if (
        account.guid === id &&
        account.radioButtonIconName === 'radio-button-on'
      ) {
        account.radioButtonIconName = 'radio-button-off';
        this.updateRadioValue('');
      } else if (
        account.guid === id &&
        account.radioButtonIconName === 'radio-button-off'
      ) {
        account.radioButtonIconName = 'radio-button-on';
        this.updateRadioValue(id);
      } else {
        account.radioButtonIconName = 'radio-button-off';
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
