import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {of} from 'rxjs';
import {delay} from 'rxjs/operators';
import {OMStatus} from '@shared-lib/services/account/models/orange-money.model';
import {OrangeMoneyService} from '@shared-lib/modules/orange-money/services/orange-money.service';
import {AccountService} from '@shared-lib/services/account/account.service';
import {AnnualRateReturnComponent} from './annual-rate-return.component';

describe('AnnualRateReturnComponent', () => {
  let component: AnnualRateReturnComponent;
  let fixture: ComponentFixture<AnnualRateReturnComponent>;
  const orangeMoneyServiceSpy = jasmine.createSpyObj('OrangeMoneyService', [
    'getOrangeData',
    'getOrangeMoneyStatus',
  ]);
  let accountServiceSpy;
  let fetchSpy;
  let orangeDataSubscriptionSpy;
  let fetchDataSpy;
  let fetchPredictSpy;

  beforeEach(
    waitForAsync(() => {
      accountServiceSpy = jasmine.createSpyObj('AccountService', [
        'getRateOfReturn',
        'getOffercode',
        'getPredict',
      ]);
      orangeDataSubscriptionSpy = jasmine.createSpyObj(
        'orangeDataSubscription',
        ['unsubscribe']
      );
      TestBed.configureTestingModule({
        declarations: [AnnualRateReturnComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: AccountService, useValue: accountServiceSpy},
          {provide: OrangeMoneyService, useValue: orangeMoneyServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(AnnualRateReturnComponent);
      component = fixture.componentInstance;
      fetchSpy = spyOn(component, 'fetchData');
      fetchDataSpy = spyOn(component, 'getOfferCodeValue');
      fetchPredictSpy = spyOn(component, 'getpredictValue');

      component.orangeDataSubscription = orangeDataSubscriptionSpy;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call fetch data', () => {
      component.ngOnInit();
      expect(component.fetchData).toHaveBeenCalled();
    });
    it('should call getpredictValue', () => {
      component.ngOnInit();
      expect(component.getpredictValue).toHaveBeenCalled();
    });

    it('should call getOfferCodeValue', () => {
      component.ngOnInit();
      expect(component.getOfferCodeValue).toHaveBeenCalled();
    });
  });

  describe('getOfferCodeValue', () => {
    let offerData;
    beforeEach(() => {
      fetchDataSpy.and.callThrough();
      offerData = [
        {
          title: 'Organize Your $$$',
          offerCode: 'MANACTIPS',
          messageType: 'MESSAGE',
        },
        {title: 'Save More', offerCode: 'INCCONT', messageType: 'MESSAGE'},
        {
          title: 'Diversification',
          offerCode: 'MANACCT',
          messageType: 'MESSAGE',
        },
      ];
      accountServiceSpy.getOffercode.and.returnValue(
        Promise.resolve(offerData)
      );
    });

    it('should load offerCode', async () => {
      component.offerVal = undefined;
      await component.getOfferCodeValue();
      expect(accountServiceSpy.getOffercode).toHaveBeenCalled();
      expect(component.offerVal).toEqual([offerData[0], offerData[2]]);
    });
  });

  describe('getpredictValue', () => {
    let predictData;
    beforeEach(() => {
      fetchPredictSpy.and.callThrough();
      predictData = {
        icon: '',
        MANACCT: {
          messages: [
            'Saving 1% more today may make a difference for tomorrow',
            'One penny on the dollar may not seem like a lot, but don’t forget that small changes can add up over time.',
          ],
          link_name: 'Get Started',
          link_url: '',
        },
        MANACTIPS: {
          messages: [
            'Need to make up for lost time?',
            'You are in the right place. Because you are eligible for catch-up contributions, you get to put away $6,500 more this year for retirement.',
          ],
          link_name: 'Get Started',
          link_url: '',
        },
      };

      accountServiceSpy.getPredict.and.returnValue(
        Promise.resolve(predictData)
      );
    });

    it('should load predictData', async () => {
      component.textPredval = undefined;
      await component.getpredictValue();
      expect(accountServiceSpy.getPredict).toHaveBeenCalled();
      expect(component.textPredval).toEqual(predictData);
    });
  });

  describe('openOffer', () => {
    it('should open in system browser', () => {
      spyOn(window, 'open');
      component.openOffer('https://google.com');
      expect(window.open).toHaveBeenCalledWith('https://google.com', '_blank');
    });
  });

  describe('fetchData', () => {
    let rateReturn;

    beforeEach(() => {
      fetchSpy.and.callThrough();

      orangeMoneyServiceSpy.getOrangeMoneyStatus.and.returnValue(
        OMStatus.FE_DATA
      );
      spyOn(component, 'omStatusChanged');

      rateReturn = {prr: {pct: 0.05, asofdate: '2021-11-30T17:26:46-0500'}};

      accountServiceSpy.getRateOfReturn.and.returnValue(
        Promise.resolve(rateReturn)
      );
    });

    it('should fetch data and set properties FE', fakeAsync(() => {
      const orangeData = {
        feForecastData: {
          investmentRateOfReturn: 0.06,
        },
      };
      orangeMoneyServiceSpy.getOrangeData.and.returnValue(
        of(orangeData).pipe(delay(1))
      );

      component.fetchData();
      tick(1);

      expect(component.omStatusChanged).toHaveBeenCalledWith(OMStatus.FE_DATA);

      expect(orangeMoneyServiceSpy.getOrangeData).toHaveBeenCalled();
      expect(component.projReturn).toEqual(
        orangeData.feForecastData.investmentRateOfReturn * 100.0
      );

      expect(accountServiceSpy.getRateOfReturn).toHaveBeenCalled();
      expect(component.ytdReturn).toEqual(rateReturn.prr.pct);

      const result = 0.05 / 6.0;
      expect(component.progressBarValue).toEqual(result);
    }));

    it('should fetch data and set properties OM', fakeAsync(() => {
      const orangeData = {
        orangeData: {
          participantData: {
            investmentRateOfReturn: 0.06,
          },
        },
      };
      orangeMoneyServiceSpy.getOrangeData.and.returnValue(
        of(orangeData).pipe(delay(1))
      );

      component.fetchData();
      tick(1);

      expect(component.omStatusChanged).toHaveBeenCalledWith(OMStatus.FE_DATA);

      expect(orangeMoneyServiceSpy.getOrangeData).toHaveBeenCalled();
      expect(component.projReturn).toEqual(
        orangeData.orangeData.participantData.investmentRateOfReturn * 100.0
      );

      expect(accountServiceSpy.getRateOfReturn).toHaveBeenCalled();
      expect(component.ytdReturn).toEqual(rateReturn.prr.pct);

      const result = 0.05 / 6.0;
      expect(component.progressBarValue).toEqual(result);
    }));
  });

  describe('omStatusChanged', () => {
    it('should show if status == ORANGE_DATA', () => {
      component.shouldHide = true;
      component.omStatusChanged(OMStatus.ORANGE_DATA);
      expect(component.shouldHide).toEqual(false);
    });

    it('should show if status == FE_DATA', () => {
      component.shouldHide = true;
      component.omStatusChanged(OMStatus.FE_DATA);
      expect(component.shouldHide).toEqual(false);
    });

    it('should show if status == MADLIB_OM', () => {
      component.shouldHide = false;
      component.omStatusChanged(OMStatus.MADLIB_OM);
      expect(component.shouldHide).toEqual(true);
    });

    it('should show if status == MADLIB_FE', () => {
      component.shouldHide = false;
      component.omStatusChanged(OMStatus.MADLIB_FE);
      expect(component.shouldHide).toEqual(true);
    });

    it('should show if status == SERVICE_DOWN', () => {
      component.shouldHide = false;
      component.omStatusChanged(OMStatus.SERVICE_DOWN);
      expect(component.shouldHide).toEqual(true);
    });

    it('should show if status == UNKNOWN', () => {
      component.shouldHide = false;
      component.omStatusChanged(OMStatus.UNKNOWN);
      expect(component.shouldHide).toEqual(true);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from orangeDataSubscription', () => {
      component.ngOnDestroy();
      expect(orangeDataSubscriptionSpy.unsubscribe).toHaveBeenCalled();
    });
  });
});
