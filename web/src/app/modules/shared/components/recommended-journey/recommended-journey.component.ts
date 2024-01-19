import {Component, Input, OnInit} from '@angular/core';
import {Status} from '@shared-lib/constants/status.enum';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {AccessService} from '@shared-lib/services/access/access.service';
import {Router} from '@angular/router';
import {from, Observable, of, Subscription} from 'rxjs';
import {ContentService} from '../../services/content/content.service';
import {concatMap} from 'rxjs/operators';
import {RecommendedJourney} from './models/recommended-journey.model';

@Component({
  selector: 'app-recommended-journey',
  templateUrl: './recommended-journey.component.html',
  styleUrls: ['./recommended-journey.component.scss'],
})
export class RecommendedJourneyComponent implements OnInit {
  @Input() journeyHeader?: string;
  @Input() jouryneyButton?: string;
  recommendedJourneys: RecommendedJourney[];
  myWorkplaceDashboardEnabled: boolean;
  private subscription = new Subscription();
  statusCompleted = Status.completed;

  constructor(
    private journeyService: JourneyService,
    private accessService: AccessService,
    private router: Router,
    private contentService: ContentService
  ) {}

  ngOnInit() {
    const subscription = this.fetchRecommendedJourney().subscribe(data => {
      this.recommendedJourneys = data;
      if (this.recommendedJourneys) {
        this.recommendedJourneys.forEach(async element => {
          element.status = this.journeyService.getJourneyStatus(element.steps);
          element.buttonText = await this.fetchJourneyCardContent(element);
        });
      }
    });
    this.subscription.add(subscription);
  }

  fetchRecommendedJourney(): Observable<RecommendedJourney[]> {
    return this.journeyService.fetchJourneys().pipe(
      concatMap(data => {
        if (data.recommended && data.recommended.length > 0) {
          return from(this.accessService.checkWorkplaceAccess()).pipe(
            concatMap(workplaceAccessRes => {
              this.myWorkplaceDashboardEnabled =
                workplaceAccessRes['myWorkplaceDashboardEnabled'];
              return of(data.recommended) as Observable<RecommendedJourney[]>;
            })
          );
        } else {
          return of(null);
        }
      })
    );
  }

  fetchJourneyCardContent(element: RecommendedJourney): Promise<string> {
    return new Promise(res => {
      if (this.myWorkplaceDashboardEnabled) {
        this.subscription.add(
          this.contentService.getLeftSideContent().subscribe(data => {
            this.journeyHeader = data.suggestedLifeEventHeader.journeyHeader;
            if (element.status === Status.inProgress) {
              res(data.suggestedLifeEventHeader.journeyInProgressButton);
            } else if (element.status === Status.notStarted) {
              res(data.suggestedLifeEventHeader.journeyNotStartedButton);
            } else {
              res(undefined);
            }
          })
        );
      } else {
        res(this.jouryneyButton);
      }
    });
  }

  navigateToRecommendedJourney() {
    this.router.navigateByUrl('/journeys');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
