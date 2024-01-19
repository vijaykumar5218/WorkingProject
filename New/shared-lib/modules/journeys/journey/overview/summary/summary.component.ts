import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  Journey,
  SummaryStep,
} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import * as journeyContent from '@shared-lib/services/journey/constants/journey-content.json';
import {JourneyContent} from '@shared-lib/services/journey/models/journeyContent.model';
import {ActivatedRoute, Router} from '@angular/router';
import {Status} from '@shared-lib/constants/status.enum';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {Subscription} from 'rxjs';
import {PlatformService} from '@shared-lib/services/platform/platform.service';

@Component({
  selector: 'journeys-overview-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnChanges, OnDestroy {
  @Input() journey: Journey;
  content: JourneyContent = journeyContent;
  showRevisit = false;
  buttonLabel = this.content.overviewDoneButton;
  summaryStepList: SummaryStep[] = [];
  journeyType: string;
  subscription = new Subscription();
  isDesktop: boolean;
  isWeb: boolean;
  value: Record<string, string>;
  @Output() valueChange = new EventEmitter<string>();

  constructor(
    private journeyService: JourneyService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private utilityService: SharedUtilityService,
    private platformService: PlatformService
  ) {
    this.platformService.isDesktop().subscribe(data => {
      this.isDesktop = data;
    });
    this.isWeb = this.utilityService.getIsWeb();
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.journey) {
      this.updateForJourney();
    }
  }

  updateForJourney() {
    this.summaryStepList = [];
    this.setRevisitButton();
    this.processSteps();
    const firstStepParsedAnswer = this.journeyService.safeParse(
      this.journey.steps[0].answer
    ) as Record<string, string>;
    this.value =
      (this.journeyService.safeParse(firstStepParsedAnswer?.summary) as Record<
        string,
        string
      >) || {};
  }

  setRevisitButton() {
    const status = this.journeyService.getJourneyStatus(this.journey.steps);
    if (!this.isWeb) {
      const fromJourneys = this.activatedRoute.snapshot.paramMap.get(
        'fromJourneys'
      );
      this.changingBtnLabel(status, fromJourneys);
    } else {
      const activatedRouteSubscription = this.activatedRoute.queryParams.subscribe(
        data => {
          this.journeyType = data.journeyType;
          this.changingBtnLabel(status, data.fromJourneys);
        }
      );
      this.subscription.add(activatedRouteSubscription);
    }
  }

  changingBtnLabel(status: Status, fromJourneys: string) {
    if (status === Status.completed && fromJourneys) {
      this.showRevisit = true;
      this.buttonLabel = this.content.overviewRevisitButton;
    }
  }

  processSteps() {
    this.journey.parsedLandingAndOverviewContent.overview.summarySteps.forEach(
      (summaryStep, i) => {
        summaryStep.idSuffix = i.toString();
        let finalSummaryStep = {...summaryStep};
        if ('journeyStepName' in summaryStep) {
          const step = this.journey.steps.find(
            journeyStep =>
              journeyStep.journeyStepName === summaryStep.journeyStepName
          );

          finalSummaryStep = {
            ...finalSummaryStep,
            stepContent: step.content,
            answer: this.journeyService.safeParse(step.answer) as Record<
              string,
              string
            >,
            status: step.status,
          };
        }
        this.summaryStepList.push(finalSummaryStep);
      }
    );
  }

  handleButtonClick() {
    if (this.showRevisit) {
      if (!this.isWeb) {
        this.router.navigateByUrl(
          '/journeys/journey/' + this.journey.journeyID + '/steps'
        );
      } else {
        this.router.navigate(
          ['/journeys/journey/' + this.journey.journeyID + '/steps'],
          {
            queryParams: {journeyType: this.journeyType},
          }
        );
        this.showRevisit = false;
        this.buttonLabel = this.content.overviewDoneButton;
      }
    } else {
      if (!this.isDesktop && this.isWeb) {
        this.router.navigateByUrl('/journeys-list');
      } else {
        this.router.navigateByUrl('/journeys');
      }
    }
  }

  updateValue(value: string, answerId: string) {
    this.value[answerId] = value;
    this.valueChange.emit(JSON.stringify(this.value));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
