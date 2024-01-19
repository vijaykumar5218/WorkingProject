import {Component, Input} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {IonicModule} from '@ionic/angular';
import {Journey} from '@shared-lib/services/journey/models/journey.model';

import {ListComponent} from './list.component';

@Component({selector: 'journeys-journey'})
class MockJourney {
  @Input() journey;
}

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let journeyData: Journey[];

  beforeEach(
    waitForAsync(() => {
      journeyData = [
        {
          journeyID: 1,
          journeyName: 'JourneyName',
          lastModifiedStepIndex: 0,
          landingAndOverviewContent: '',
          resourcesContent: '',
          parsedLandingAndOverviewContent: {
            intro: {
              header: 'Adding to your family',
              message:
                'Having a kid changes everything. Learn how to get your finances in order when your family is growing.',
              imgUrl: 'assets/icon/journeys/all/Master_Close_Ups_Family_2.svg',
            },
            overview: undefined,
          },
          steps: [],
        },
        {
          journeyID: 2,
          journeyName: 'JourneyName',
          lastModifiedStepIndex: 0,
          landingAndOverviewContent: '',
          resourcesContent: '',
          parsedLandingAndOverviewContent: {
            intro: {
              header: 'Adding to your family2',
              message:
                'Having a kid changes everything. Learn how to get your finances in order when your family is growing. 2',
              imgUrl: 'assets/icon/journeys/all/Master_Close_Ups_Family_2.svg2',
            },
            overview: undefined,
          },
          steps: [],
        },
      ];
      TestBed.configureTestingModule({
        declarations: [ListComponent, MockJourney],
        imports: [IonicModule.forRoot()],
        providers: [],
      }).compileComponents();

      fixture = TestBed.createComponent(ListComponent);
      component = fixture.componentInstance;
      component.journeys = journeyData;
      component.headerText = 'All journeys';
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('template', () => {
    it('should display header', () => {
      const journeyHeader = fixture.debugElement.query(By.css('div ion-text'));
      expect(journeyHeader).toBeTruthy();
      expect(journeyHeader.nativeElement.innerHTML.trim()).toEqual(
        'All journeys'
      );
    });

    it('should display a journey for each of the journeys', () => {
      const journeys = fixture.debugElement.queryAll(
        By.css('div journeys-journey')
      );
      expect(journeys.length).toEqual(2);
    });
  });
});
