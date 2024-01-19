import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {OmEmployerMatchComponent} from './om-employer-match.component';
import {OrangeMoneyService} from '../../services/orange-money.service';
import {Subscription, of} from 'rxjs';

describe('OmEmployerMatchComponent', () => {
  let component: OmEmployerMatchComponent;
  let fixture: ComponentFixture<OmEmployerMatchComponent>;
  let orangeMoneyServiceSpy;
  let employerMatchResponse;

  beforeEach(
    waitForAsync(() => {
      orangeMoneyServiceSpy = jasmine.createSpyObj('OrangeMoneyService', [
        'getOmEmployerMatch',
      ]);

      TestBed.configureTestingModule({
        declarations: [OmEmployerMatchComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: OrangeMoneyService, useValue: orangeMoneyServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(OmEmployerMatchComponent);
      component = fixture.componentInstance;

      employerMatchResponse = {
        showERMatch: true,
        erContributionsHeader: 'Employer Contributions',
        erContributionDesc2:
          'Note: The match amount reflects the most recent information we have on file from your employer.',
        erContributionsDesc:
          'Your Employer is putting money in your account in the following ways:',
        matchTiers: [
          {
            TwoTiersNoMaxMatchTier2: 'Then Match 0.33 of the next 100% of pay',
            TwoTiersNoMaxMatchTier1: 'Match 100% of the first 1% of pay',
          },
        ],
      };

      orangeMoneyServiceSpy.getOmEmployerMatch.and.returnValue(
        of(employerMatchResponse)
      );
    })
  );

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getOmEmployerMatch from orange money service and store result in omEmployerMatchData', () => {
      component.clientId = 'INGWIN';
      component.planId = '123456';
      component.sessionId = 'sessionId';
      component.omEmployerMatchData = undefined;
      fixture.detectChanges();
      expect(orangeMoneyServiceSpy.getOmEmployerMatch).toHaveBeenCalledWith(
        'INGWIN',
        '123456',
        'sessionId'
      );
      expect(component.omEmployerMatchData).toEqual(employerMatchResponse);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from omEmployerMatchDataSub', () => {
      component.omEmployerMatchDataSub = new Subscription();
      const subscription = spyOn(
        component.omEmployerMatchDataSub,
        'unsubscribe'
      );
      component.ngOnDestroy();
      expect(subscription).toHaveBeenCalledTimes(1);
    });
  });
});
