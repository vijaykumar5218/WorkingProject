import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import * as journeyContent from '@shared-lib/services/journey/constants/journey-content.json';
import {JourneyContent} from '@shared-lib/services/journey/models/journeyContent.model';
import {Router} from '@angular/router';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {ContinueEvent} from '@shared-lib/services/journey/models/journey.model';

@Component({
  selector: 'journeys-steps-step-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss', '../../../../../../scss/button.scss'],
})
export class ButtonComponent {
  @Input() label: string;
  @Input() link: string;
  @Input() type: string;
  @Input() idSuffix: string;
  @Input() noSpacing: boolean;
  @Output() continueClick = new EventEmitter<ContinueEvent>();
  @Input() isActiveBackBtn: boolean;
  @Output() backClick = new EventEmitter<void>();
  @Input() backBtnColor: string;
  @Input() disabled: boolean;
  isWeb: boolean;
  content: JourneyContent = journeyContent;

  constructor(
    private utilityService: SharedUtilityService,
    private router: Router,
    private journeyService: JourneyService
  ) {}

  ngOnInit() {
    this.isWeb = this.utilityService.getIsWeb();
  }

  handleClick() {
    if (!this.link || this.link === 'default') {
      this.continueClick.emit({route: true});
    } else if (this.link === 'mxAddAccount') {
      if (this.isWeb) {
        this.journeyService.openMxAccModal();
      } else {
        this.continueClick.emit({route: false});
        this.journeyService.setAddAccount('true');
        const currentJourney = this.journeyService.getCurrentJourney();
        const route =
          '/journeys/journey/' + currentJourney.journeyID + '/overview';
        this.router.navigate(['account/add-accounts'], {
          queryParams: {backRoute: route},
        });
      }
    } else if (this.link === 'save') {
      this.continueClick.emit({route: false, save: true});
    }
  }

  handleBackClick() {
    this.backClick.emit();
  }
}
