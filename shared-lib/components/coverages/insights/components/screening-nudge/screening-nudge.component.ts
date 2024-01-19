import {Component, Input, OnInit} from '@angular/core';
import {BenefitsService} from '../../../../../services/benefits/benefits.service';
import {PrevCareContent} from '../../../../../services/benefits/models/noBenefit.model';
import {SharedUtilityService} from '../../../../../services/utility/utility.service';

@Component({
  selector: 'app-screening-nudge',
  templateUrl: './screening-nudge.component.html',
  styleUrls: ['./screening-nudge.component.scss'],
})
export class ScreeningNudgeComponent implements OnInit {
  @Input() prevCareKey: string;
  content: PrevCareContent;
  isWeb = false;

  constructor(
    private benefitsService: BenefitsService,
    private utilityService: SharedUtilityService
  ) {}

  ngOnInit() {
    this.isWeb = this.utilityService.getIsWeb();
    this.benefitsService.getNoBenefitContents().then(benContent => {
      const contentJson = benContent[this.prevCareKey];
      if (contentJson) {
        this.content = JSON.parse(contentJson);
      }
    });
  }
}
