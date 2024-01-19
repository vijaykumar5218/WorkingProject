import {Component, Input, OnInit} from '@angular/core';
import {OrangeMoneyService} from '../../services/orange-money.service';
import {OmEmployerMatch} from '@shared-lib/services/account/models/om-employer-match.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'om-employer-match',
  templateUrl: './om-employer-match.component.html',
  styleUrls: ['./om-employer-match.component.scss'],
})
export class OmEmployerMatchComponent implements OnInit {
  @Input() clientId: string;
  @Input() planId: string;
  @Input() sessionId: string;

  omEmployerMatchData: OmEmployerMatch;
  omEmployerMatchDataSub = new Subscription();

  constructor(private orangeMoneyService: OrangeMoneyService) {}

  ngOnInit() {
    this.omEmployerMatchDataSub.add(
      this.orangeMoneyService
        .getOmEmployerMatch(this.clientId, this.planId, this.sessionId)
        .subscribe(data => {
          this.omEmployerMatchData = data;
        })
    );
  }

  ngOnDestroy() {
    this.omEmployerMatchDataSub.unsubscribe();
  }
}
